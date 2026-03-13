import requests
import json

url = 'http://predictive_modeling:1478/get-prediction_P1TempB1_pred18h'
#data = {'key1': 'value1', 'key2': 'value2'}
with open("fetched_data_p1.txt", "r") as file:
    content = file.read()
    jsondata = json.loads(content)

response = requests.post(url, json=jsondata,verify=False)#, timeout=40*60)
#response = requests.get('http://predictive_modeling:1478/health')

#print('len',repr(response.text))
print(response.status_code)
with open('model_output.json', 'w', encoding='utf-8') as f:
    json.dump(response.json(), f, ensure_ascii=False, indent=4)

