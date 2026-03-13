from rest_framework import serializers
from db_dictionaries.models._type_product import Type_product
from rest_framework_recursive.fields import RecursiveField

class typeProductList(serializers.ModelSerializer):
    # children = typeProductSerializer(many=True)
    # children = RecursiveField(many=True, required=False)
    # full_name = serializers.Field(source='code_text')
    leaf_nodes = serializers.SerializerMethodField()
    
    class Meta:
        depth = 1
        model = Type_product
        fields = ['id', 'code', 'code_text', 'parent', 'children', 'leaf_nodes']
        # fields = '__all__'
        http_method_names = ['get', 'head', 'options', 'delete', 'put', 'post']
    
    def get_leaf_nodes(self, obj):
        return typeProductList(obj.get_children(), many=True).data


class typeProductDetail(serializers.ModelSerializer):
    children = typeProductList(many=True)
    # children = RecursiveField(many=True, required=False)
    # full_name = serializers.Field(source='code_text')
    # leaf_nodes = serializers.SerializerMethodField()
    
    class Meta:
        model = Type_product
        fields = ['id', 'code', 'code_text', 'parent', 'children']
        # fields = '__all__'
        http_method_names = ['get', 'head', 'options', 'delete', 'put', 'post']



