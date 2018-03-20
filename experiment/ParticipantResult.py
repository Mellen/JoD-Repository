from django.db import models
import uuid

class ConditionType(models.Model):
    description = models.CharField(max_length=256)
    number = models.IntegerField(default=1)

    def __str__(self):
        return self.description

class ParticipantResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    condition = models.ForeignKey(ConditionType)
    limesurveyid = models.CharField(max_length=256, null=True)
    prolificacademicid = models.CharField(max_length=256, null=True)
    can_use_data = models.BooleanField(default=True)
    paid = models.BooleanField(default=False)

    def __str__(self):
        return str(self.id) + ', ' + self.condition.description

class WorkItemResult(models.Model):
    participant = models.ForeignKey(ParticipantResult, related_name='participant')
    condition = models.ForeignKey(ConditionType)
    partner = models.ForeignKey(ParticipantResult, null=True, related_name='partner')
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trial_number = models.IntegerField()
    amount_destroyed = models.FloatField()
    was_destroyed = models.BooleanField()
    partner_will_destroy = models.BooleanField()
    dice_throw = models.PositiveIntegerField()
    amount_destroyed_in_last_round = models.FloatField()
    total_payoff_at_round_start = models.FloatField()

