from django.core.mail import EmailMessage
from django.views.generic import TemplateView
from django.views import generic
from django.utils.decorators import classonlymethod
from django.conf.urls import url, include
from django.http import JsonResponse
from .SiteSettings import SiteSettings
from .ParticipantResult import ParticipantResult, WorkItemResult, ConditionType
import uuid
from random import randrange, randint
from datetime import datetime
import csv
import io

max_partner = 10

class MainExperiment(TemplateView):
    template_name = 'experiment.html'
    
    def post(self, request, *args, **kwargs):
        participant_id = uuid.UUID(self.request.session['user'])
        participant = ParticipantResult.objects.filter(pk=participant_id).first()
        
        if participant is None:
            request.session.flush()
            return self.get(request, args, kwargs) #sorry, I know this is a bit confusing
        
        trial_number = WorkItemResult.objects.filter(participant=participant).count() + 1

        partner_item = self.findPartner(participant)

        if request.POST['rdoDestroy'] == 'yes':
            was_destroyed = True
            amount_destroyed = 5
        else:
            was_destroyed = False
            amount_destroyed = 0

        partner_will_destroy = request.POST['rdoPartnerDestroy'] == 'yes'
        
        if trial_number > 1:
            last_item = WorkItemResult.objects.filter(participant=participant, trial_number=trial_number-1).first()
            if last_item.was_destroyed:
                amount_destroyed_in_last_round = 1
            else:
                amount_destroyed_in_last_round = 0
            total_payoff_at_round_start = last_item.total_payoff_at_round_start
        else:
            amount_destroyed_in_last_round = 0
            total_payoff_at_round_start = 0

        dice_throw = randint(1,6)
        
        newWIR = WorkItemResult(participant=participant, condition=participant.condition, trial_number=trial_number, was_destroyed=was_destroyed, amount_destroyed=amount_destroyed, amount_destroyed_in_last_round=amount_destroyed_in_last_round, total_payoff_at_round_start=total_payoff_at_round_start,partner_will_destroy=partner_will_destroy,dice_throw=dice_throw)

        if partner_item is not None:
            newWIR.partner = partner_item.participant
            partner_item.partner = participant
            last_partner = WorkItemResult.objects.filter(participant=partner_item.participant, trial_number=partner_item.trial_number-1).first()
            last_amount_b = 0
            if last_partner is not None:
                last_amount_b = last_partner.total_payoff_at_round_start
            self.calculatePayout(newWIR, total_payoff_at_round_start, partner_item, last_amount_b)
            partner_item.save()

        newWIR.save()
        
        return self.get(request, args, kwargs)

    def findPartner(self, participant):

        partner = None

        if participant.prolificacademicid is None:
            potentials = WorkItemResult.objects.exclude(participant=participant).filter(partner=None, participant__prolificacademicid=None).order_by('trial_number')
        else:
            potentials = WorkItemResult.objects.exclude(participant=participant).exclude(participant__prolificacademicid=None).filter(partner=None).order_by('trial_number')
                
        for p in potentials:
            already_partnered_count = WorkItemResult.objects.filter(participant=p.participant, partner=participant).count()
                    
            if already_partnered_count == 0:
                partner = p
                break
            
        return partner

    def calculatePayout(self, partnerA, last_amount_a, partnerB, last_amount_b):
        a_destroyed_amount = 0
        b_destroyed_amount = 0
        
        if partnerA.dice_throw == 1 or partnerA.dice_throw == 6:
            a_destroyed_amount = 5
        else:
            a_destroyed_amount = partnerB.amount_destroyed
        
        if partnerB.dice_throw == 1 or partnerB.dice_throw == 6:
            b_destroyed_amount = 5
        else:
            b_destroyed_amount = partnerA.amount_destroyed

        if partnerA.was_destroyed:
            a_destroyed_amount += 1

        if partnerB.was_destroyed:
            b_destroyed_amount += 1

        partnerA.total_payoff_at_round_start = last_amount_a + (10 - a_destroyed_amount)
        partnerB.total_payoff_at_round_start = last_amount_b + (10 - b_destroyed_amount)
        
    
    def get_context_data(self, **kwargs):
        if 'user' in self.request.session:
            result = ParticipantResult.objects.filter(pk=self.request.session['user']).first()
        else:
            result = self.new_participant()

        if result is None:
            result = self.new_participant()

        self.request.session['user'] = str(result.id)
            
        context = super(MainExperiment, self).get_context_data(**kwargs)
        context['max_partner'] = max_partner
        context['partnerNumber'] = WorkItemResult.objects.filter(participant__pk=uuid.UUID(self.request.session['user'])).count() + 1
        context['waitingMessage'] = 'Connecting you to partner ' + str(context['partnerNumber']) + ' of ' + str(max_partner)  + '...'
        context['completePercent'] = ((context['partnerNumber']-1) / max_partner) * 100;
        context['is_prolific'] = self.request.session['is_prolific']
        context['condition'] = result.condition.description
        
        return context

    def new_participant(self):
        if 'condition' not in self.request.session:
            conditions = ConditionType.objects.all()

            condition = conditions[randrange(0, len(conditions))]

            self.request.session['condition'] = condition.id
        else:
            condition = ConditionType.objects.filter(pk=self.request.session['condition']).first()
        
        result = ParticipantResult(condition=condition)
        result.save()

        return result

    @classonlymethod
    def final_acceptance_check_entry(cls):

        def final_acceptance_check(request):

            participant = ParticipantResult.objects.filter(pk=request.session['user']).first()
            
            if request.POST['acceptance'] == 'agree':
                participant.can_use_data = True
            elif request.POST['acceptance'] == 'withdraw':
                participant.can_use_data = False

            participant.save()

            msg = 'Thank you for taking part in this study. Please remember to note down your participant number: <strong>'+str(request.session['user'])[:7]+'</strong>.'

            if request.session['is_prolific']:
                msg = 'Thank you for taking part in this study.'
            
            response = JsonResponse({'msg': msg})
            return response

        return final_acceptance_check
    
    @classonlymethod
    def switch_to_control_get(cls):
    
        def switchToControl(request):
            if 'user' in request.session:
                result = ParticipantResult.objects.filter(pk=request.session['user']).first()
                condition = ConditionType.objects.filter(description='Control').first()
                result.condition = condition
                result.save()
                request.session['condition'] = condition.id
                request.session['conditionDescription'] = condition.description

            return JsonResponse({'msg': 'AOK'})

        return switchToControl
        
    
class SurveyReturn(TemplateView):
    template_name = 'last_step.html'

    def get_context_data(self, **kwargs):
        context = super(SurveyReturn, self).get_context_data(**kwargs)
        context['PAURL'] = SiteSettings.objects.filter(key='PAURL').first().value;
        participant = ParticipantResult.objects.filter(pk=uuid.UUID(self.request.session['user'])).first()

        context['date'] = datetime.now().strftime('%d %B %Y')

        context['participant_id'] = participant.id
            
        self.check_for_payouts()
        return context

    def check_for_payouts(self):
        unpaid = ParticipantResult.objects.exclude(prolificacademicid=None).filter(paid=False)

        should_be_paid = []

        for participant in unpaid:
            partner_count = WorkItemResult.objects.exclude(partner=None).filter(participant=participant).count()
            if partner_count == max_partner:
                should_be_paid.append(participant)

        if len(should_be_paid) > 0:
            f = io.StringIO()
            writer = csv.writer(f)
            writer.writerow(['prolific_id', 'pay_out'])
            
            for participant in should_be_paid:
                payout = WorkItemResult.objects.filter(participant=participant, trial_number=max_partner).first().total_payoff_at_round_start
                writer.writerow([participant.prolificacademicid, payout/10])

            bonus_email = SiteSettings.objects.filter(key='bonus_email').first().value
                
            email = EmailMessage('People To Pay', 'Input this csv into the Prolific Academic bonus system for the JoD experiment.', 'jod_bonus@matthewellen.co.uk', [bonus_email])
            email.attach('bonuses.csv', f.getvalue(), 'text/csv')
            result = email.send()

            if result == 1:
                for participant in should_be_paid:
                    participant.paid = True
                    participant.save()


class Tutorial(TemplateView):
    template_name = 'tutorial1.html'
