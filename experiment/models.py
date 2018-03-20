from django.db import models
from .ConsentQuestion import ConsentQuestion, ConsentAnswer
from .SVO import SVOQuestion, SVOAnswer
from .ParticipantResult import ParticipantResult, WorkItemResult, ConditionType
from django.contrib.sessions.models import Session
# Create your models here.

def deleteStuff():
    SVOAnswer.objects.all().delete()
    ParticipantResult.objects.all().delete()
    ConsentAnswer.objects.all().delete()
    WorkItemResult.objects.all().delete()
    Session.objects.all().delete()
