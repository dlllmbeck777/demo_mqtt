import requests
import os
from helper import send_alarm, get_warning_messages

base_url = os.environ.get("NIFI_API_URL")

process_group_name = "inkai_data_pipeline"

process_name = "ConsumeMQTT"


def get_process_group_id(group_name):
    response = requests.get(base_url + "process-groups/root/process-groups")
    process_groups = response.json()["processGroups"]

    for group in process_groups:
        if group["component"]["name"] == group_name:
            return group["id"]


def get_processors_in_process_group(group_id):
    response = requests.get(base_url + f"process-groups/{group_id}/processors")
    processors = response.json()["processors"]
    return processors


def check_process_status(processors, process_name):
    for processor in processors:
        if processor["component"]["name"] == process_name:
            processor_id = processor["id"]
            response = requests.get(base_url + f"processors/{processor_id}/diagnostics")
            status = response.json()["component"]["processorStatus"]["runStatus"]
            return status


if __name__ == "__main__":
    group_id = get_process_group_id(process_group_name)
    if group_id:
        processors = get_processors_in_process_group(group_id)
        status = check_process_status(processors, process_name)
        if status == "Running":
            error_message = get_warning_messages("INFO", "en-US")
            send_alarm(
                error_message=error_message,
                source="MQTT-Nifi",
                category="connectivity_status",
                topic="warnings",
            )
        elif status == "Stopped":
            error_message = get_warning_messages("FAILED", "en-US")
            send_alarm(
                error_message=error_message,
                source="MQTT-Nifi",
                category="connectivity_status",
                state="Stopped",
                alarms_type="Warning",
                topic="warnings",
            )
        else:
            error_message = (
                f"{process_name} process not found in the specified process group."
            )
            send_alarm(
                error_message=error_message,
                source="MQTT-Nifi",
                category="connectivity_status",
                state="Stopped",
                alarms_type="Warning",
                topic="warnings",
            )
    else:
        error_message = f"Process group {process_group_name} not found."
        send_alarm(
            error_message=error_message,
            source="MQTT-Nifi",
            category="connectivity_status",
            state="Stopped",
            alarms_type="Warning",
            topic="warnings",
        )
