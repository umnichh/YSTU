from django.core.management import call_command
from celery import shared_task
from .models import Elective

@shared_task
def update_elective_statuses():
    electives = Elective.objects.all()
    for elective in electives:
        elective.change_status()

@shared_task
def clear_expired_tokens():
    call_command('flushexpiredtokens')