# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-04 10:27
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiment', '0006_auto_20170330_2140'),
    ]

    operations = [
        migrations.CreateModel(
            name='ParticipantType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=256)),
            ],
        ),
        migrations.AlterField(
            model_name='conditiontype',
            name='description',
            field=models.CharField(max_length=256),
        ),
    ]
