from django.http import JsonResponse, Http404
from django.views import generic
from django.db import models

class SiteSettings(models.Model):
    key = models.CharField(max_length=4096)
    value = models.CharField(max_length=4096)

    def __str__(self):
        return 'key: ' + self.key + ', value: ' + self.value

class SiteSettingsView(generic.detail.SingleObjectMixin, generic.View):
    def get(self, request, *args, **kwargs):
        key = kwargs['key']
        value = SiteSettings.objects.filter(key=key).first().value
        return JsonResponse({'value':value})
