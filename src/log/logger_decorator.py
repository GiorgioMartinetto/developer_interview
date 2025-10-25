import asyncio
import time
from collections.abc import Callable
from functools import wraps
from typing import Any

from loguru import logger


def frontier_logger() -> Callable:
    """
    Decorator per funzioni esposte dalle API.
    Logga ingresso, uscita, argomenti, risultato e eccezioni.
    Supporta funzioni sincrone e async.
    """

    def decorator(func: Callable) -> Callable:
        if asyncio.iscoroutinefunction(func):

            @wraps(func)
            async def async_wrapper(*args, **kwargs) -> Any:
                log = logger.bind(
                    module=func.__module__, func=func.__name__, layer="frontier"
                )
                log.log(
                    "INFO",
                    "ENTER {func} args={args} kwargs={kwargs}",
                    func=func.__name__,
                    args=args,
                    kwargs=kwargs,
                )
                try:
                    result = await func(*args, **kwargs)
                    log.log(
                        "SUCCESS",
                        "EXIT {func} result={result}",
                        func=func.__name__,
                        result=result,
                    )
                    return result
                except Exception:
                    log.exception("EXCEPTION in {func}", func=func.__name__)
                    raise

            return async_wrapper
        else:

            @wraps(func)
            def sync_wrapper(*args, **kwargs) -> Any:
                log = logger.bind(
                    module=func.__module__, func=func.__name__, layer="frontier"
                )
                log.log(
                    "INFO",
                    "ENTER {func} args={args} kwargs={kwargs}",
                    func=func.__name__,
                    args=args,
                    kwargs=kwargs,
                )
                try:
                    result = func(*args, **kwargs)
                    log.log(
                        "SUCCESS",
                        "EXIT {func} result={result}",
                        func=func.__name__,
                        result=result,
                    )
                    return result
                except Exception:
                    log.exception("EXCEPTION in {func}", func=func.__name__)
                    raise

            return sync_wrapper

    return decorator


def inner_logger() -> Callable:
    """
    Decorator per funzioni di supporto.
    Logga ingresso/uscita in modo meno verboso e misura il tempo di esecuzione.
    Supporta funzioni sincrone e async.
    """

    def decorator(func: Callable) -> Callable:
        if asyncio.iscoroutinefunction(func):

            @wraps(func)
            async def async_wrapper(*args, **kwargs) -> Any:
                log = logger.bind(
                    module=func.__module__, func=func.__name__, layer="inner"
                )
                start = time.perf_counter()
                log.log("INFO", "START {func}", func=func.__name__)
                try:
                    result = await func(*args, **kwargs)
                    elapsed = (time.perf_counter() - start) * 1000.0
                    log.log(
                        "SUCCESS",
                        "END {func} elapsed_ms={elapsed:.2f}",
                        func=func.__name__,
                        elapsed=elapsed,
                    )
                    return result
                except Exception:
                    log.exception("EXCEPTION in {func}", func=func.__name__)
                    raise

            return async_wrapper
        else:

            @wraps(func)
            def sync_wrapper(*args, **kwargs) -> Any:
                log = logger.bind(
                    module=func.__module__, func=func.__name__, layer="inner"
                )
                start = time.perf_counter()
                log.log("INFO", "START {func}", func=func.__name__)
                try:
                    result = func(*args, **kwargs)
                    elapsed = (time.perf_counter() - start) * 1000.0
                    log.log(
                        "SUCCESS",
                        "END {func} elapsed_ms={elapsed:.2f}",
                        func=func.__name__,
                        elapsed=elapsed,
                    )
                    return result
                except Exception:
                    log.exception("EXCEPTION in {func}", func=func.__name__)
                    raise

            return sync_wrapper

    return decorator
