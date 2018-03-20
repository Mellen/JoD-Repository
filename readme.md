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
