from rest_framework import pagination


class SimplePaginations(pagination.PageNumberPagination):
    page_size = 50
