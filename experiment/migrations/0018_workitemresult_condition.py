# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-08-02 20:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('experiment', '0017_participantresult_can_use_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='workitemresult',
            name='condition',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='experiment.ConditionType'),
            preserve_default=False,
        ),
    ]
