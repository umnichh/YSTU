# Generated by Django 5.1.1 on 2024-09-28 16:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0018_alter_admin_options_alter_statusbyadmin_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='statusbyadmin',
            name='describe',
        ),
        migrations.AddField(
            model_name='elective',
            name='comment',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Комментарий'),
        ),
        migrations.CreateModel(
            name='StatusByAdminElective',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.TextField(null=True, verbose_name='Комментарий')),
                ('elective', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.elective')),
                ('status_by_admin', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.statusbyadmin')),
            ],
        ),
    ]
