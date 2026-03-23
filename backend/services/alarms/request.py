import os
import time

import requests

base_url = os.environ.get("BACKEND_BASE_URL", "http://localhost:8000").rstrip("/")
layer_name = str(
    os.environ.get("LEGACY_LAYER_NAME")
    or os.environ.get("DIAGNOSTIC_LAYER_NAME")
    or os.environ.get("COMPANY_NAME")
    or "STD"
).strip()

_CACHE_TTL_SECONDS = int(os.environ.get("ALARMS_TAG_CACHE_TTL_SECONDS", "60"))
_tag_name_cache = {"expires_at": 0.0, "value": []}


def getTagNameData():
    now = time.time()
    if _tag_name_cache["value"] and now < _tag_name_cache["expires_at"]:
        return _tag_name_cache["value"]

    req = base_url + f"/api/v1/tags/details/{layer_name}"
    try:
        response = requests.get(req, timeout=15)
        response.raise_for_status()
        incoming_tag_name = response.json()
        if not isinstance(incoming_tag_name, list):
            raise ValueError(f"Expected list payload from {req}")
        _tag_name_cache["value"] = incoming_tag_name
        _tag_name_cache["expires_at"] = now + _CACHE_TTL_SECONDS
        return incoming_tag_name
    except Exception as exc:
        print(f"getTagNameData warning: {exc}; url={req}")
        return _tag_name_cache["value"] or []


def getFormule(Quantity_type):
    headers = {"Content-type": "application/json", "Accept": "application/json"}
    req = base_url + "/api/v1/uoms/details/"
    print(req)
    data = {"QUANTITY_TYPE": Quantity_type}
    res = requests.post(req, json=data, headers=headers, timeout=15)
    return res.json()
