from functools import update_wrapper
from uuid import UUID
from django.db.models import Max, Count
from django.conf.urls import url, include
from django.contrib import admin
from .ConsentQuestion import ConsentQuestion
from .SVO import SVOQuestion, SVOAnswer
from .ParticipantResult import ConditionType, WorkItemResult, ParticipantResult
from .SiteSettings import SiteSettings
from .experimentViews import max_partner
import csv
from django.http import HttpResponse, JsonResponse
import io

# Register your models here.

admin.site.register(ConsentQuestion)
admin.site.register(SVOQuestion)
admin.site.register(ConditionType)
admin.site.register(SiteSettings)

@admin.register(ParticipantResult)
class ResultsDownload(admin.ModelAdmin):
    def get_urls(self):
        def wrap(view):
            def wrapper(*args, **kwargs):
                return self.admin_site.admin_view(view)(*args, **kwargs)
            wrapper.model_admin = self
            return update_wrapper(wrapper, view)

        urls = super().get_urls()

        info = self.model._meta.app_label, self.model._meta.model_name

        my_urls = [
            url(r'getdata/$', wrap(self.download_csv), name='getdata'),
            url(r'getpayouts/$', wrap(self.download_payouts), name='getpayouts'),
            url(r'makedummies/$', wrap(self.make_dummy_entries), name='makedummies'),
            url(r'getsummary/$', wrap(self.participant_summary), name='summary'),
            url(r'getsvodata/$', wrap(self.svo_data), name='getsvodata'),
            url(r'deleteoptouts/$', wrap(self.delete_opt_outs), name='deleteoptouts'),
        ]

        return my_urls + urls

    def delete_opt_outs(self, request, *args, **kwargs):
        f = io.StringIO()
        writer = csv.writer(f)
        writer.writerow(['participant id'])

        deleters = ParticipantResult.objects.filter(can_use_data=False)

        svo_deletes = SVOAnswer.objects.filter(participant__in=deleters).delete()

        for deleter in deleters:
            writer.writerow([str(deleter.id)[:7]])
            self.rewrite_data_with_dummies(deleter)
        
        f.seek(0)
        response = HttpResponse(f, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=delete_from_limesurvey.csv'        
        return response

    def rewrite_data_with_dummies(self, deleter):
        dummy = self.get_dummy()

        data_to_delete = WorkItemResult.objects.filter(participant=deleter)

        for datum in data_to_delete:
            partner_datum = WorkItemResult.objects.filter(participant=datum.partner, partner=deleter).first()
            if partner_datum is not None:
                partner_datum.partner = dummy
                partner_datum.save()

        data_to_delete.delete()
    
    def svo_data(self, request, *args, **kwargs): 
        f = io.StringIO()
        writer = csv.writer(f)

        writer.writerow(['participant id', 'paid yourself', 'paid other'])

        query_set = SVOAnswer.objects.all().order_by('participant', 'question')

        for s in query_set:
            writer.writerow([str(s.participant.id), str(s.participant.id)[:7], s.you_receive, s.they_receive])
        
        f.seek(0)
        response = HttpResponse(f, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=SVO.csv'        
        return response
       
    
    def participant_summary(self, request, *args, **kwargs):
        f = io.StringIO()
        writer = csv.writer(f)

        writer.writerow(['participant id', 'condition', 'number of times destroyed', 'number of times left intact'])
        dummy = self.get_dummy()
        query_set_true = WorkItemResult.objects.exclude(participant=dummy).filter(was_destroyed=True).values('participant', 'condition__description').annotate(Count('was_destroyed'))
        query_set_false = WorkItemResult.objects.exclude(participant=dummy).filter(was_destroyed=False).values('participant', 'condition__description').annotate(Count('was_destroyed'))
        query_set_all = WorkItemResult.objects.exclude(participant=dummy).values('participant', 'condition__description').distinct()

        true_counts = {}
        
        for s in query_set_true:
            true_counts[(s['participant'], s['condition__description'])] = s['was_destroyed__count']

        false_counts = {}
            
        for s in query_set_false:
            false_counts[(s['participant'], s['condition__description'])] = s['was_destroyed__count']

        for s in query_set_all:
            tc = 0
            fc = 0
            
            if (s['participant'], s['condition__description']) in true_counts:
                tc = true_counts[(s['participant'], s['condition__description'])]

            if (s['participant'], s['condition__description']) in false_counts:
                fc = false_counts[(s['participant'], s['condition__description'])]

            writer.writerow([str(s['participant'])[:7], s['condition__description'], tc, fc])
            
        f.seek(0)
        response = HttpResponse(f, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=summary.csv'
        return response
        
    
    def download_payouts(self, request, *args, **kwargs):
        f = io.StringIO()
        writer = csv.writer(f)
        writer.writerow(['participant id', 'total payout'])
        dummy = self.get_dummy()
        exclude_set = WorkItemResult.objects.exclude(participant=dummy).filter(participant__prolificacademicid=None, participant__paid=False, partner=None).values('participant').distinct()
        for ex in exclude_set:
            print(ex)
        query_set = WorkItemResult.objects.exclude(participant=dummy).exclude(participant__in=exclude_set).filter(participant__prolificacademicid=None, participant__paid=False).values('participant').annotate(Max('total_payoff_at_round_start'))
        for s in query_set:
            print(s)
            writer.writerow([str(s['participant'])[:7], (s['total_payoff_at_round_start__max']/10)-4])
            p = ParticipantResult.objects.filter(id=s['participant']).first()
            p.paid = True
            p.save()
        
        f.seek(0)
        response = HttpResponse(f, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=payout.csv'
        return response

    def make_dummy_entries(self, request, *args, **kwargs):

        dummy = self.get_dummy()
        
        unpaid = ParticipantResult.objects.filter(paid=False, prolificacademicid=None)

        needs_dummies = []

        for participant in unpaid:
            unpartnered = WorkItemResult.objects.filter(participant=participant, partner=None)
            needs_dummies.append(unpartnered)

        for dummy_list in needs_dummies:
            for needy in dummy_list:
                last_payout = 0
                if needy.trial_number > 1:
                    previous = WorkItemResult.objects.filter(trial_number=needy.trial_number-1, participant=needy.participant).first()
                    last_payout = previous.total_payoff_at_round_start
                dummyWI = WorkItemResult(participant=dummy, partner=needy.participant, trial_number=needy.trial_number, was_destroyed=needy.was_destroyed, amount_destroyed=0, amount_destroyed_in_last_round=0, total_payoff_at_round_start=0, partner_will_destroy=False, dice_throw=3, condition=dummy.condition)
                dummyWI.save()
                needy.partner = dummy
                if needy.dice_throw == 1 or needy.dice_throw == 6:
                    needy.total_payoff_at_round_start = last_payout + 5
                else:
                    needy.total_payoff_at_round_start = last_payout + 10
                if needy.was_destroyed:
                    needy.total_payoff_at_round_start -= 1
                needy.save()
            
        response = JsonResponse({'msg': 'Dummies created.'})
        return response

    def get_dummy(self):
        setting = SiteSettings.objects.filter(key='dummy').first()
        dummy = None
        if setting is not None:
            dummy_id = SiteSettings.objects.filter(key='dummy').first().value;
            dummy = ParticipantResult.objects.filter(pk=UUID(dummy_id)).first()
        else:
            setting = SiteSettings(key='dummy', value='')
            
        if dummy is None:
            dummy = ParticipantResult(condition=ConditionType.objects.all().first())
            dummy_id = str(dummy.id)
            dummy.save()
            setting.value = dummy_id
            setting.save()

        return dummy
    
    def download_csv(self, request, *args, **kwargs):
        dummy = self.get_dummy()
        f = io.StringIO()
        writer = csv.writer(f)
        writer.writerow(['participant_id', 'trial_number', 'condition', 'chose to destroy', 'expected to be destroyed', 'total_payoff_at_round_start'])
        query_set = WorkItemResult.objects.all()
        for s in query_set:
            if s.participant.id != dummy.id:
                writer.writerow([str(s.participant.id)[:7], s.trial_number, s.condition.number, 1 if s.was_destroyed else 0, 1 if s.partner_will_destroy else 0, s.total_payoff_at_round_start])
        f.seek(0)
        response = HttpResponse(f, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=results.csv'
        return response

@admin.register(WorkItemResult)
class ResultsAdmin(admin.ModelAdmin):
    actions = ['download_csv']
    list_display = ('get_participant_id', 'get_partner_id', 'get_prolific', 'trial_number', 'get_condition', 'amount_destroyed', 'was_destroyed', 'amount_destroyed_in_last_round', 'total_payoff_at_round_start', 'dice_throw')
    ordering = ('participant__pk','trial_number',)

    def download_csv(self, request, query_set):
        f = io.StringIO()
        writer = csv.writer(f)
        writer.writerow(['participant id', 'trial_number', 'condition', 'amount_destroyed', 'was_destroyed', 'amount_destroyed_in_last_round', 'total_payoff_at_round_start'])
        
        for s in query_set:
            writer.writerow([s.participant.id, s.trial_number, s.participant.condition.description, s.amount_destroyed, s.was_destroyed, s.amount_destroyed_in_last_round, s.total_payoff_at_round_start])
        
        f.seek(0)
        response = HttpResponse(f, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=results.csv'
        return response

    download_csv.short_description = 'Download the results as a CSV.'
    
    def get_participant_id(self, obj):
        return obj.participant.id

    get_participant_id.short_description = 'participant id'

    def get_partner_id(self, obj):
        if obj.partner is not None:
            return obj.partner.id
        else:
            return '-'

    get_partner_id.short_description = 'partner id'
        
    def get_prolific(self, obj):
        return obj.participant.prolificacademicid

    get_prolific.short_description = 'prolific academic id'

    def get_condition(self, obj):
        return obj.participant.condition.description

    get_condition.short_description = 'condition'
