import requests

# NiFi API bilgileri
nifi_url = "http://20.230.239.209:8082/nifi-api"
headers = {"Content-Type": "application/xml"}

# Template dosyasının içeriğini oku
with open("MTBM.xml", "r") as template_file:
    template_content = template_file.read()

# Template'i içe aktar
response = requests.post(f"{nifi_url}/process-groups/root/templates/import", data=template_content, headers=headers)
print(response.text)

# template_id = response.json()["template"]["id"]
# print(f"Template imported with ID: {template_id}")

# # Template'i başlat
# response = requests.post(f"{nifi_url}/process-groups/root/templates/{template_id}/instantiate", headers=headers)

# if response.status_code == 201:
#     print("Template instantiated successfully.")
# else:
#     print("Failed to instantiate template.")
