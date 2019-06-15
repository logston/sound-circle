from django.urls import path

from app.views import PlayTemplateView


urlpatterns = [
    path('', PlayTemplateView.as_view(), name="play"),
]

