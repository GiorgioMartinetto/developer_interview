from pathlib import Path
from typing import Any

import yaml
from dotenv import load_dotenv


def read_yaml_file(file_name: str) -> dict[str, Any]:
    """
    Read and parse a YAML file.

    Args:
        file_name (str): Name of the YAML file to read

    Returns:
        Dict[str, Any]: Parsed YAML content as a dictionary

    Raises:
        FileNotFoundError: If the specified file doesn't exist
        yaml.YAMLError: If the file contains invalid YAML syntax
        PermissionError: If there are insufficient permissions to read the file
    """
    try:
        path = Path("./config/")/file_name

        # Check if file exists
        if not path.exists():
            raise FileNotFoundError(f"YAML file not found: {file_name}")

        # Check if it's a file (not a directory)
        if not path.is_file():
            raise ValueError(f"Path is not a file: {file_name}")

        # Read and parse the YAML file
        with path.open(encoding="utf-8") as file:
            data = yaml.safe_load(file)

        # Handle empty files
        if data is None:
            return {}

        return data

    except FileNotFoundError:
        raise
    except PermissionError as e:
        raise PermissionError(f"Permission denied reading file: {file_name}") from e
    except yaml.YAMLError as e:
        raise yaml.YAMLError(
            f"Invalid YAML syntax in file {file_name}: {str(e)}"
        ) from e
    except Exception as e:
        raise Exception(
            f"Unexpected error reading YAML file {file_name}: {str(e)}"
        ) from e


def load_db_config(file_path: str = ".env") -> dict[str, Any]:
    env_pth = Path(file_path)
    if not env_pth.exists():
        raise FileNotFoundError(f"File - {file_path} - not found ")
    load_dotenv(file_path)
    data = {}
    with env_pth.open("r", encoding="utf-8") as f:
        for line in f:
            if line.strip() and not line.startswith("#"):
                key, value = line.strip().split("=", 1)
                data[key] = value
    return data

