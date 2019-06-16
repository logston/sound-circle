from django.views.generic.base import TemplateView


class PlayTemplateView(TemplateView):
    template_name = 'build/index.html'

