from src.config.llm_setting import llm_get_setting
from src.llm.llm_implementation.llm_anthropic_model import LLMAnthropicModel
from src.llm.llm_implementation.llm_aws_model import LLMAwsModel
from src.llm.llm_implementation.llm_azure_model import LLMAzureModel
from src.llm.llm_implementation.llm_groq_model import LLMGroqModel
from src.llm.llm_implementation.llm_openai_model import LLMOpenAiModel


class LLMFactory:
    _instance=None

    @classmethod
    def create_llm(cls):
        if cls._instance:
            return cls._instance
        else:
            configuration = llm_get_setting()

            llm = {
                "groq": LLMGroqModel,
                "openai": LLMOpenAiModel,
                "azure": LLMAzureModel,
                "anthropic": LLMAnthropicModel,
                "aws": LLMAwsModel
            }

            return None

def setup_llm():
    LLMFactory.create_llm()