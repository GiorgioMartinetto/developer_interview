

from langchain_core.messages import AIMessage
from langchain_core.output_parsers import PydanticOutputParser, StrOutputParser
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from langgraph.graph import END, StateGraph
from loguru import logger

from src.entities.product.product_crud import get_products_list
from src.llm.llm_factory import LLMFactory
from src.models.chat_model import ChatState, MessageClassifier
from src.utilis.sys_utilis import read_yaml_file


class ChatbotGraph:
    def __init__(self):
        self.llm = LLMFactory.get_llm()
        self.graph = self._build_graph()
        self.config = read_yaml_file("chatbot_config.yml")

    def _build_graph(self):
        graph_builder = StateGraph(ChatState)

        # Nodi
        graph_builder.add_node("classify_message", self.classify_message)
        graph_builder.add_node("product_agent", self.product_agent)
        graph_builder.add_node("faq_agent", self.faq_agent)

        # Entry point
        graph_builder.set_entry_point("classify_message")

        # Routing
        graph_builder.add_conditional_edges(
            "classify_message",
            self.route_message,
            {
                "products": "product_agent",
                "faq": "faq_agent",
            },
        )
        graph_builder.add_edge("product_agent", END)
        graph_builder.add_edge("faq_agent", END)

        app = graph_builder.compile()
        return app

    def classify_message(self, state: ChatState):

        """Classifica il messaggio dell'utente in 'products' o 'faq' usando l'LLM."""
        user_message = state["messages"][-1].content


        parser = PydanticOutputParser(pydantic_object=MessageClassifier)

        system_message = SystemMessagePromptTemplate.from_template(self.config["classify_message"])
        human_message = HumanMessagePromptTemplate.from_template("{user_message}")

        classification_prompt = ChatPromptTemplate.from_messages([system_message, human_message])

        chain = classification_prompt | self.llm | parser

        try:
            category = chain.invoke({"user_message": user_message, "format_instruction": parser.get_format_instructions()})

            if not category or category.message_type not in ["products", "faq"]:
                message_type = "faq"
            else:
                message_type = category.message_type
        except Exception as e:
            logger.warning(f"Failed to parse classification response: {e}. Defaulting to 'faq'.")
            message_type = "faq"

        return {"category": message_type}

    def product_agent(self, state: ChatState):

        user_message = state["messages"][-1].content

        products_info = get_products_list()

        system_message = SystemMessagePromptTemplate.from_template(self.config["products_system_message"])
        human_message = HumanMessagePromptTemplate.from_template("{user_message}")

        product_prompt = ChatPromptTemplate.from_messages(
            [system_message, human_message]
        )

        product_chain = product_prompt | self.llm | StrOutputParser()

        product_answer = product_chain.invoke(
            {"user_message": user_message, "products_info": products_info}
        ).strip()

        return {"response": product_answer, "messages": [AIMessage(content=product_answer)], "product_info": products_info}

    def faq_agent(self, state: ChatState):
        user_message = state["messages"][-1].content


        # Build system and human message templates
        system_message = SystemMessagePromptTemplate.from_template(
            self.config["faq_system_message"]
        )
        human_message = HumanMessagePromptTemplate.from_template("{user_message}")

        # Combine into a chat prompt
        faq_prompt = ChatPromptTemplate.from_messages([system_message, human_message])

        # Build a runnable chain (prompt -> LLM -> string output)
        faq_chain = faq_prompt | self.llm | StrOutputParser()

        # Invoke with the correct input variable
        faq_answer = faq_chain.invoke({"user_message": user_message}).strip() or ""


        return {"response": faq_answer, "messages": [AIMessage(content=faq_answer)]}



    def route_message(self, state: ChatState):
        """Funzione di routing basata sulla categoria."""
        category = state.get("category")

        if category == "products":
            return "products"
        else:
            return "faq"
