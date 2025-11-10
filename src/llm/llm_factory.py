from langchain_anthropic import ChatAnthropic
from langchain_aws import ChatBedrock
from langchain_groq import ChatGroq
from langchain_openai import AzureChatOpenAI, ChatOpenAI

from src.config.llm_setting import llm_get_setting


class LLMFactory:
    _instance=None

    @classmethod
    def create_llm(cls) -> bool:
        if cls._instance:
            return True
        else:

            configuration = llm_get_setting()

            provider = configuration.provider

            params = {
                "model": configuration.model,
                "temperature": configuration.temperature,
                "api_key": configuration.api_key,
            }
            if configuration.max_tokens is not None:
                params["max_tokens"] = configuration.max_tokens
            if configuration.timeout is not None:
                params["timeout"] = configuration.timeout
            if configuration.max_retries is not None:
                params["max_retries"] = configuration.max_retries

            llm = {
                "groq": ChatGroq,
                "openai": ChatOpenAI,
                "azure": AzureChatOpenAI,
                "anthropic": ChatAnthropic,
                "aws": ChatBedrock,
            }

            cls._instance = llm[provider](**params)

            return True

    @classmethod
    def get_llm(cls):
        if cls._instance is None:
            raise ValueError("LLM instance is not created yet. Call create_llm() first.")
        return cls._instance

def setup_llm():
    LLMFactory.create_llm()