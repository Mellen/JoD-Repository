# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-08-03 11:55
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('experiment', '0019_conditiontype_number'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='consentanswer',
            name='username',
        ),
        migrations.AddField(
            model_name='consentanswer',
            name='participant',
            field=models.ForeignKey(default='2ad6f196-4fab-45c0-9a03-db476d5e2275', on_delete=django.db.models.deletion.CASCADE, to='experiment.ParticipantResult'),
            preserve_default=False,
        ),
    ]