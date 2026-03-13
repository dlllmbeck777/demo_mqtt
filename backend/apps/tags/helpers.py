import redis
import environ
from .models import tags
from apps.resources_types.models import resources_types
from apps.code_list.models import code_list
from apps.templates.orm_CodeList import CodeListORM

env = environ.Env(DEBUG=(bool, False))


def TagsPropertyResourceLabel(data, dataList, culture):
    label_ids = [item.get("LABEL_ID") for item in data]
    qs_resources = resources_types.objects.filter(ID__in=label_ids, CULTURE=culture)
    resources = {}
    for resource in qs_resources:
        resources[resource.ID] = {
            "SHORT_LABEL": resource.SHORT_LABEL,
            "MOBILE_LABEL": resource.MOBILE_LABEL,
        }

    for item in data:
        if item.get("CODE_LIST"):
            qs_codeList = code_list.objects.filter(
                LIST_TYPE=item.get("CODE_LIST"), CULTURE=culture
            )
            item["CODE"] = CodeListORM.getCodeList(
                qs_codeList, culture=culture, hierarchy=False
            )

        resource = resources.get(item.get("LABEL_ID"))
        if resource:
            item["SHORT_LABEL"] = resource.get("SHORT_LABEL")
            item["MOBILE_LABEL"] = resource.get("MOBILE_LABEL")
        dataList.append(item)


def data_generator(tag_id, label):
    redis_host = env("REDIS_TS_HOST")
    tag_name = list(tags.objects.filter(TAG_ID=tag_id).values("NAME"))[0].get("NAME")
    rds = redis.StrictRedis(redis_host, port=6379, db=2)
    data = rds.ts().mrange(
        "-", "+", ["tag_name=" + tag_name], empty=True, with_labels=label
    )

    return _dataType(data, label)


def _dataType(data, label):
    new_list = []
    large_data = data
    CHUNK_SIZE = 4096
    for chunk_start in range(0, len(large_data), CHUNK_SIZE):
        chunk_end = chunk_start + CHUNK_SIZE
        chunk = (large_data[chunk_start:chunk_end],)
        for item in chunk:
            for tempt in item:
                _label_or_ts(new_list, tempt, label)
    return new_list


def _label_or_ts(new_list, tempt, label):
    if label:
        # print(list(tempt.values())[0][0])
        data = list(tempt.values())[0][0]

    else:
        data = [
            list(tempt.values())[0][1][0][0],
            list(tempt.values())[0][1][0][1],
        ]
    new_list.append(data)
