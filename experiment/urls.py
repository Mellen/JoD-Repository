from django.conf.urls import url

from . import views

app_name = 'experiment'

urlpatterns = [
    url(r'^$', views.IndexView.as_view(), name='index'),
    url(r'pis', views.PIS.as_view(), name='participant information sheet'),
    url(r'tutorial', views.Tutorial.as_view(), name='Tutorial'),
    url(r'setupOffice', views.SetupOffice.as_view(), name='setup office'),
    url(r'setupPA', views.SetupPA.as_view(), name='setup Prolific Academic'),
    url(r'settings/(?P<key>[a-zA-Z]+)$', views.SiteSettingsView.as_view(), name='site settings'),
    url(r'^svoQuestion/(?P<pk>[0-9]+)$', views.SVOQuestionView.as_view(), name='svo_question'),
    url(r'^svoAnswer/(?P<pk>[0-9]+)/(?P<you>[0-9]+)/(?P<them>[0-9]+)$', views.SVOAnswerReceiver.as_view(), name='svo_answer'),
    url(r'^consentQuestion/(?P<pk>[0-9]+)$', views.ConsentQuestionView.as_view(), name='consent_question'),
    url(r'^consent$', views.consent, name='consent'),
    url(r'^main$', views.MainExperiment.as_view(), name='main experiment'),
    url(r'^limesurveyReturn$', views.SurveyReturn.as_view(), name='survey return'),
    url(r'^SVO$', views.SVOMainView.as_view(), name='survey return'),
    url(r'^switchToControl$', views.MainExperiment.switch_to_control_get(), name='switch to control'),
    url(r'^finalAcceptanceCheck$', views.MainExperiment.final_acceptance_check_entry(), name='final_acceptance_check'),
]
