import json
import requests
import os

base_url = os.environ["BACKEND_BASE_URL"]
req = base_url + "/api/v1/tags/details/Horasan"

# from request import req
def getTagNameData():
    req = base_url + "/api/v1/tags/details/Horasan"
    r = requests.get(req)
    incoming_tag_name = r.json()
    return incoming_tag_name


def getFormule(Quantity_type):
    headers = {"Content-type": "application/json", "Accept": "application/json"}
    req = base_url + "/api/v1/uoms/details/"
    print(req)
    data = {"QUANTITY_TYPE": Quantity_type}
    res = requests.post(req, json.dumps(data), headers=headers)
    return res.json()
