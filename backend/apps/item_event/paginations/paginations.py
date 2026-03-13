from rest_framework import pagination


class ItemEventPaginations(pagination.PageNumberPagination):
    page_size_query_param = "page_size"

    def get_page_size(self, request):
        page_size = request.parser_context["kwargs"].get("page_size")

        return int(page_size)
