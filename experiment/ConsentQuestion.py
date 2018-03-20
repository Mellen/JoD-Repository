from django.db import models
from .ParticipantResult import ParticipantResult

class ConsentQuestion(models.Model):
    body = models.TextField()
    order = models.IntegerField(default=0)
    camera_only = models.BooleanField(default=False)

    def __str__(self):
        return self.body
    
class ConsentAnswer(models.Model):
    question = models.ForeignKey(ConsentQuestion)
    accept_date = models.DateTimeField('date accepted')
    participant = models.ForeignKey(ParticipantResult)
