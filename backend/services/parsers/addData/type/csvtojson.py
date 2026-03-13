import csv
import json
import uuid

files = ["RESOURCE_LIST"]
# open the CSV file and read its contents into a list of dictionaries
for file in files:
    with open((file + ".csv"), "r") as csv_file:
        csv_data = csv.DictReader(csv_file, delimiter=",")
        data = []
        for row in csv_data:
            row.pop("id")
            data.append({**row})
        # data = [
        #     {
        #         **row,
        #     }
        #     for row in csv_data
        # ]
    # json_data = json.dumps(data, ensure_ascii=False).replace("\\", "")
    # convert the list of dictionaries to a JSON string

    # write the JSON string to a file
    with open((file + ".json"), "w") as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)


import json

# JSON dosyasını oku
# with open('TYPE_PROPERTY.json', 'r') as f:
#     data = json.load(f)

# new_data = []
# # Valueları değiştir
# for item in data:
#     item['LAST_UPDT_DATE'] ="2023-01-01"
#     item['CODE_LIST_LVL'] ="0"
#     item['LENGTH'] ="0"
#     item['DECIMALS'] ="0"
#     new_data.append(item)
# # JSON dosyasına yaz
# with open('TYPE_PROPERTY.json', 'w') as f:
#     json.dump(data, f, indent=4,ensure_ascii=False)
