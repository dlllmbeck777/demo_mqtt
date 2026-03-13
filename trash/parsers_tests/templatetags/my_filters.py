from django.template.defaulttags import register

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


@register.filter
def get_last_key(dictionary, key):
    return list(dictionary.keys())[-1]
    