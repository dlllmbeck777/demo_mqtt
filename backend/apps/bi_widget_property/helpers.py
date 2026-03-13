def find_cal_or_tag(value, liste, validated_data, tag_cal, tags_calculated):
    id_list = []
    if any(value in item for item in liste):
        for id in validated_data.get("PROPERTY_TAG"):
            is_find = tags_calculated.objects.filter(TAG_ID=id)
            if is_find:
                id_list.append(id)
                tag_cal.append(is_find[0])

    if tag_cal:
        validated_data["PROPERTY_TAG_CAL"] = tag_cal
        for id in id_list:
            validated_data.get("PROPERTY_TAG").remove(id)
