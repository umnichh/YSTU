# Generated by Django 5.1.1 on 2024-09-12 13:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_electivefacultet_electiveinstitute_electiveprofile'),
    ]

    operations = [
        migrations.RenameField(
            model_name='electivefacultet',
            old_name='assign_all_courses',
            new_name='assign_all_semestrs',
        ),
        migrations.RenameField(
            model_name='electiveinstitute',
            old_name='assign_all_courses',
            new_name='assign_all_semestrs',
        ),
        migrations.RenameField(
            model_name='electiveprofile',
            old_name='assign_all_courses',
            new_name='assign_all_semestrs',
        ),
    ]
