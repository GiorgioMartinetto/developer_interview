from functools import lru_cache
from typing import Literal

from pydantic import BaseModel

from src.utilis.sys_utilis import load_env_config, read_yaml_file


class LLMSetting(BaseModel):
    provider: Literal[
        "groq",
        "openai",
        "azure",
        "anthropic",
        "aws",
    ]
    model: str
    temperature: float
    max_tokens: int | None = None
    timeout: int | None = None
    max_retries: int | None = None
    api_key: str

@lru_cache
def llm_get_setting() -> LLMSetting:
    config_data = read_yaml_file(file_name="llm_config.yml")
    env_data = load_env_config()
    # Merge config data with env data
    settings = {
        **config_data,
        "api_key": env_data.get(f"{config_data['provider'].upper()}_API_KEY", ""),
    }
    return LLMSetting(**settings)
