from django.urls import path

from app.views import PlayTemplateView
from app.views import GameDataView


urlpatterns = [
    path('', PlayTemplateView.as_view(), name='play'),
    path('game-data', GameDataView.as_view(), name='game_data'),
]

