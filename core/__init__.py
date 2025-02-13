from __future__ import absolute_import, unicode_literals

# Убедитесь, что Celery загружает задачи при запуске приложения
from server.celery import app as celery_app

__all__ = ('celery_app',)