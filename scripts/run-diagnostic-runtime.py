import os
import threading
import time

from diagnostic_probe_runtime import run_once
from diagnostic_runtime import run_consumer


def probe_loop() -> None:
    interval = int(os.environ.get("DIAGNOSTIC_PROBE_INTERVAL_SECONDS", "60"))
    while True:
        try:
            run_once()
        except Exception as exc:
            print(f"[diagnostic-runtime:probes] {exc}", flush=True)
        time.sleep(interval)


def consumer_loop(topic: str) -> None:
    while True:
        try:
            run_consumer(topic)
        except Exception as exc:
            print(f"[diagnostic-runtime:{topic}] {exc}", flush=True)
            time.sleep(5)


if __name__ == "__main__":
    threads = [
        threading.Thread(target=probe_loop, name="diagnostic-probes", daemon=True),
        threading.Thread(target=consumer_loop, args=("notifications",), name="diagnostic-notifications", daemon=True),
        threading.Thread(target=consumer_loop, args=("warnings",), name="diagnostic-warnings", daemon=True),
        threading.Thread(target=consumer_loop, args=("logs",), name="diagnostic-logs", daemon=True),
    ]

    for thread in threads:
        thread.start()

    while True:
        for thread in threads:
            if not thread.is_alive():
                raise SystemExit(f"Diagnostic worker thread exited unexpectedly: {thread.name}")
        time.sleep(5)
