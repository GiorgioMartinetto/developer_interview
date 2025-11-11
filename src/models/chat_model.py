import operator
from typing import Annotated, Literal, TypedDict

from langchain_core.messages import BaseMessage
from pydantic import BaseModel, Field


class MessageClassifier(BaseModel):
    message_type: Literal["faq", "products"] = Field(
        ...,
        description="Classify if the message requires a FAQ or product-related response."
    )


class ChatState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]
    category: str
    response: str
    product_info: list[dict[str, str]]
    faq_info: dict[str, str]


