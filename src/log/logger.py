import sys
from pathlib import Path

from loguru import logger



def  setup_logger():
    # Rimuove il logger di default
    logger.remove()

    # Crea la directory dei log se non esiste
    log_directory = Path("./logs")
    if not log_directory.exists():
        Path.mkdir(log_directory)

    # Configura il logger per scrivere su file con rotazione
    logger.add(
        log_directory / "./app.log",
        rotation="10 MB",  # Ruota il file quando raggiunge 10MB
        retention="1 week",  # Mantiene i log per una settimana
        compression="zip",  # Comprime i file di log ruotati
        format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function}:{line} | {message}",
        level="DEBUG",
        encoding="utf-8",
    )

    # Configura il logger per la console
    logger.add(
        sys.stderr,
        format="<green>{time:HH:mm:ss}</green> | <level>{level}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | <level>{message}</level>",
        level="INFO",
        colorize=True,
    )
