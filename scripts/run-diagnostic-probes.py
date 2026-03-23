import time

from diagnostic_probe_runtime import run_once


if __name__ == "__main__":
    interval = int(os.environ.get("DIAGNOSTIC_PROBE_INTERVAL_SECONDS", "60"))
    while True:
        run_once()
        time.sleep(interval)
