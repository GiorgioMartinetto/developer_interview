import json
from loguru import logger

from langchain_core.messages import HumanMessage

from src.llm.chatbot import ChatbotGraph
from src.models.chat_model import ChatState


class ChatbotService:
    def __init__(self):
        self.chatbot_graph = ChatbotGraph()
        self.session_state = self.get_initial_state()

    def send_message_to_chatbot(self, request):
        response, context = self.process_message(request.message, self.session_state)

        return response, context

    def reset_state(self):
        self.session_state = self.get_initial_state()

    def process_message(self, user_message: str, current_session_state: ChatState):
        current_session_state["messages"].append(HumanMessage(content=user_message))

        result = self.chatbot_graph.graph.invoke(current_session_state)

        logger.info(f"QUIII \n {result}")

        updated_session_state = result

        response_text = updated_session_state.get(
            "response", "Mi dispiace, non sono riuscito a generare una risposta."
        )

        context = {
            "category": updated_session_state.get("category"),
            "product_info": json.dumps(updated_session_state.get("product_info")),
            "faq_info": json.dumps(updated_session_state.get("faq_info")),
        }

        # Pulisci i dati temporanei dallo stato per la prossima iterazione
        updated_session_state["product_info"] = []
        updated_session_state["faq_info"] = {}

        self.session_state = updated_session_state

        return response_text, context

    def get_initial_state(self) -> ChatState:
        return {
            "messages": [],
            "category": "",
            "response": "",
            "product_info": [],
            "faq_info": {},
        }
