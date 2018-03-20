from django.http import JsonResponse, Http404
from django.views import generic
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .ConsentQuestion import ConsentQuestion, ConsentAnswer
from .SVO import SVOQuestion, SVOAnswer
from .ParticipantResult import ParticipantResult

class ConsentQuestionView(generic.ListView):
    template_name = 'consentQuestion.html'
    context_object_name = 'question'

    def get_queryset(self):
        print('CQVgqs', self.request.session.keys())
        question = get_object_or_404(ConsentQuestion, order=self.kwargs['pk'])
        if question.camera_only and self.request.session['conditionDescription'] != 'Camera':
            question = get_object_or_404(ConsentQuestion, order=int(self.kwargs['pk'])+1)
        return {'order': question.order,'q':question}

class SVOQuestionView(generic.detail.SingleObjectMixin, generic.View):
    def get(self, request, *args, **kwargs):
        question = get_object_or_404(SVOQuestion, pk=self.kwargs['pk'])
        return JsonResponse({'id': self.kwargs['pk'], 'you_options':question.you_options.split(','), 'them_options':question.them_options.split(',')})

class SVOAnswerReceiver(generic.detail.SingleObjectMixin, generic.View):

    def post(self, request, *args, **kwargs):
        question = get_object_or_404(SVOQuestion, pk=kwargs['pk'])
        you_option = kwargs['you']
        them_option = kwargs['them']
        participant = get_object_or_404(ParticipantResult, pk=request.session['user'])
        answer = SVOAnswer(question=question, you_receive=you_option, they_receive=them_option, participant=participant)
        answer.save()
        return JsonResponse({'msg':'saved'})
    
def consent(request):
    now = timezone.now()
    participant = get_object_or_404(ParticipantResult, pk=request.session['user'])
    for question in ConsentQuestion.objects.all():
        answer = ConsentAnswer(question = question, participant=participant, accept_date = now)
        answer.save()
        return JsonResponse({'msg':'got your consent'})
    else:
        return JsonResponse({'msg':'please input a name'})

class SVOMainView(generic.TemplateView):
    template_name = 'svoMain.html'
