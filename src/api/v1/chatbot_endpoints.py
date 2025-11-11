
from fastapi import APIRouter, HTTPException, status

from src.core.chatbot_service import ChatbotService
from src.models.request_models import ChatRequest
from loguru import logger
chatbot_router = APIRouter(
    prefix="/v1/chatbot",
    tags=["Chatbot"]
)

chatbot_service = ChatbotService()


@chatbot_router.post("/conversation",
                     status_code=status.HTTP_200_OK,
                     description="Send a message to the chatbot and get a response")
async def chat_with_bot(request: ChatRequest) -> str:

    try:
        response, current_context = chatbot_service.send_message_to_chatbot(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@chatbot_router.post("/reset_conversation")
async def reset_conversation():
    """
    Endpoint per resettare lo stato della conversazione del chatbot.
    """
    try:
        chatbot_service.reset_state()
        return {"message": "Conversazione resettata con successo."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
