class CloseDbMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Response döndüğünde çalışacak kodlar buraya gelecek
        if request.active_layers == "STD":
            # close_db("default")
            pass
        else:
            pass
            # close_db("layer_db")
        return response
