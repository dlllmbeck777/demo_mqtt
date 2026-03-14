import argparse
import time

from diagnostic_runtime import run_consumer


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--topic", required=True, choices=["notifications", "warnings", "logs"])
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    while True:
        try:
            run_consumer(args.topic)
        except Exception as exc:
            print(f"[diagnostic-consumer:{args.topic}] {exc}", flush=True)
            time.sleep(5)
