# Experiment code

This is a Django project.

## Getting up and running

To get it to run, first you'll need to setup a database. You'll also need to set some environment variables:

`DATABASE_URL`: This is how the app will connect to your database, for example: postgres://user:password@database.example.com:5432/experiment

`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`: These specify the email configuration for sending out the bonus payment email (used with Prolific Academic)

`DJANGO_SECRET`: This is the secret Django uses for things like session keys.

An example of starting the server in bash:

    DATABASE_URL="postgres://user:password@database.example.com:5432/experiment" DJANGO_SECRET="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" EMAIL_HOST="email.example.com" EMAIL_PORT=25 EMAIL_USER="mellen@example.com" EMAIL_PASSWORD="this password is secure" gunicorn destExp.wsgi

If you're running it from Heroku, set the environment variables in the settings tab of the dashboard under "Config Variables".

Running it for the first time will require going through the regular Django setup.

Once you're up and running you'll need to add somethings to the database. Firstly you'll need to add some settings to the settings object. You can do this either via the Django admin interface (under "Experiment" then "Site settingss"), or via `python manage.py shell`. The following is an example python listing:

    from experiment.SiteSettings import SiteSettings as settings
    setting = settings(key='bonus_email', value="email@example.com")
    setting.save()
    setting = settings(key='limesurveyURL', value="https://limesurvey.example.com/index.php/123456?lang=en")
    setting.save()
    setting = settings(key='PAURL', value="https://www.prolific.ac/submissions/complete?cc=AAAAAAAA")

- The `limesurveyURL` should point your survey for the follow up questions.
- The `PAURL` should be the completion URL supplied to you by Prolific Academic. If you're not using Prolific Academic, you can ignore this.
- The `bonus_email` is the email address where you are sent the list of bonuses to pay out for Prolific Academic.

Secondly you'll need to setup the consent questions. Again, this can be done via the Django admin interface or the Django shell. The following is the listing for using the shell:

    from experiment.ConsentQuestion import ConsentQuestion as CQ
    cq = CQ(body='I have read the study information sheet and understand what the study will involve.', order=1, camera_only=False)
    cq.save()
    cq = CQ(body='I understand that this project has been reviewed by, and received ethics clearance through, the University of Oxford Central University Research Ethics Committee and the Ministry of Defence Research Ethics Committee.', order=2, camera_only=False)
    cq.save()
    cq = CQ(body='I understand that my participation is voluntary and that I am free to withdraw myself at any time, without giving any reason, and without any adverse consequences or penalty.', order=3, camera_only=False)
    cq.save()
    cq = CQ(body='I understand that only the researcher, his supervisors and members of the University auditing the process will have access to any personal data provided.', order=4, camera_only=False)
    cq.save()
    cq = CQ(body='I understand that the anonymised experimental data may be made available to other researchers.', order=5, camera_only=False)
    cq.save()
    cq = CQ(body='I understand how to raise concerns or make a complaint.', order=8, camera_only=False)
    cq.save()
    cq = CQ(body='I agree to take part in the study.', order=9, camera_only=False)
    cq.save()
    cq = CQ(body='Please note that you may only participate in this task and survey if you are 18 years of age or over. I certify that I am 18 years of age or over.', order=10, camera_only=False)
    cq.save()
    cq = CQ(body='I understand that the research will be written up and published as part of a student thesis, stored in the University’s online archive accessible on the internet, may be published online in journal articles and used in conference and other presentations and publications.', order=6, camera_only=False)
    cq.save()
    cq = CQ(body='I understand that some aspects of this study will require me to be watched via webcam, but that no recording will be made.', order=7, camera_only=True)
    cq.save()

**N.B.** The system is currently hard coded to have 10 consent questions, so a bit of work will be needed if you need to adjust the number of questions. The text in these questions must be changed to suit your needs.

## Experiment options

Currently there are two ways to start the experiment:

1. http://experiment.example.com/setupOffice

This will allow you to choose the condition (eye, camera, control) and then start the experiment

2. http://experiment.example.com/setupPA

This is the setup for if you're running via Prolific Academic. It asks for the user's Prolific Academic ID and randomly assigns a condition.

## Admin controls

There are 6 extra things on the Django admin screen.

4 CSVs

- Download Summary: This generates a per participant CSV summary of the data
- Download Current Data: This generates a per trial CSV extract of all the data currently acquired
- Download Current Payouts List: This generates a CSV of participant Ids and how much they should be paid out. The participants' entries in the database will change when you click this, to indicate they have been paid.
- Download SVO data: This generates a CSV of the SVO data

2 Actions

- Make Dummy Entries: If you need to pay your participants, but the number of participants you've had isn't divisible by 11, this will generate dummy entries to give the participants who haven't been matched with enough people enough matches to get paid.
- Remove Withdrawn Data: If someone withdraws their data at the end of the experiment, the data will be marked for removal, so click this to finish the job.
