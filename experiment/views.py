from django.views import generic
from django.views.generic import TemplateView
from django.shortcuts import redirect
from django.http import HttpResponse
from .questionViews import ConsentQuestionView, consent, SVOQuestionView, SVOAnswerReceiver, SVOMainView
from .experimentViews import MainExperiment, SurveyReturn, Tutorial
from .models import ConditionType, ParticipantResult
from .SiteSettings import SiteSettingsView
from random import randrange
from datetime import datetime

# Create your views here.

class IndexView(TemplateView):
    template_name = 'index.html'
    
class Home(TemplateView):
    template_name = 'main_index.html'

class PIS(TemplateView):
    template_name = 'pis.html'

    def get_context_data(self, **kwargs):        
        context = super(TemplateView, self).get_context_data(**kwargs)
        context['date'] = datetime.now().strftime('%d %B %Y')
        
        return context

    
class SetupOffice(generic.ListView):
    template_name = 'setupOffice.html'
    context_object_name = 'data'

    def post(self, request, *args, **kwargs):
        request.session.flush()
        condition_id = request.POST['selCondition']
        condition = ConditionType.objects.filter(pk=condition_id).first()
        participant = ParticipantResult(condition=condition)
        participant.save()
        request.session['user'] = str(participant.id)
        request.session['user_short'] = str(participant.id)[:7]
        request.session['condition'] = condition_id
        request.session['conditionDescription'] = condition.description
        request.session['is_prolific'] = False
        return redirect('/experiment/pis/')
    
    def get_queryset(self):
        conditions = ConditionType.objects.all()
        
        queryset = []

        for condition in conditions:
            item = {'id': condition.id, 'description': condition.description, 'count':0}
            count = ParticipantResult.objects.filter(condition=condition).count()
            item['count'] = count
            queryset.append(item)
            
        return queryset

class SetupPA(TemplateView):
    template_name = 'setupPA.html'

    def post(self, request, *args, **kwargs):
        request.session.flush()
        conditions = ConditionType.objects.all()
        condition = conditions[randrange(0, len(conditions))]
        participant = ParticipantResult(condition=condition,prolificacademicid=request.POST['txtProlificID'])
        participant.save()
        request.session['user'] = str(participant.id)
        request.session['user_short'] = str(participant.id)[:7]
        request.session['condition'] = condition.id
        request.session['conditionDescription'] = condition.description
        request.session['is_prolific'] = True
        return redirect('/experiment/pis/')

def acme(request):
    return HttpResponse('IhMnXAF7yLiVmBObHr26FlWeFCndmZkcauyhbpxb6tw.Eh0PsY5iDEUOm0k1bFC74E7dTAqLUQAkOgJx2cZId_g')
