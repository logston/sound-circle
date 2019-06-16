import random

from django.http import JsonResponse
from django.views.generic.base import TemplateView
from django.views.generic.base import View

from . import utils


class PlayTemplateView(TemplateView):
    template_name = 'app/index.html'


class GameDataView(View):
    def get(self, request, *args, **kwargs):
        sound_names = utils.get_sound_names()

        device_sound_name = random.choice(sound_names)

        data = {
            'device_sound_name': device_sound_name,
            'sound_names': sound_names,
        }
        return JsonResponse(data)

