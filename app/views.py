from django.http import JsonResponse
from django.views.generic.base import TemplateView
from django.views.generic.base import View

from . import utils


class PlayTemplateView(TemplateView):
    template_name = 'app/index.html'


class GameDataView(View):
    def get(self, request, *args, **kwargs):
        data = {
            'sound_names': utils.get_sound_names(),
        }
        return JsonResponse(data)

