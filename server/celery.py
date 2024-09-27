from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

app = Celery('server')
app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()


app.conf.beat_schedule = {
    'update-elective-statuses-daily': {
        'task': 'core.tasks.update_elective_statuses',
        'schedule': crontab(hour=21, minute=00),  # запуск каждый день в полночь
    },
    'clear-expired-tokens-daily': {
        'task': 'core.tasks.clear_expired_tokens',
        'schedule': crontab(hour=21, minute=00),  # запуск каждый день в полночь
    },
}

