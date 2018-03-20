import uuid
from django.db import models
from .ParticipantResult import ParticipantResult

class SVOQuestion(models.Model):
    you_options = models.TextField()
    them_options = models.TextField()

    def __str__(self):
        return 'you: ' + self.you_options + ' (count ' + str(self.you_options.count(',')+1) + ')\n' + 'them: ' + self.them_options + '\n (count ' + str(self.them_options.count(',')+1) + ')'

class SVOAnswer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submit_date_time = models.DateTimeField('date accepted', auto_now=True)
    participant = models.ForeignKey(ParticipantResult)
    question = models.ForeignKey(SVOQuestion)
    you_receive = models.IntegerField()
    they_receive = models.IntegerField()
