# Generated by Django 5.1.1 on 2024-10-04 17:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0019_remove_statusbyadmin_describe_elective_comment_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='electiveprofilecourse',
            name='all_course',
        ),
        migrations.AddField(
            model_name='electiveprofilecourse',
            name='someCourses',
            field=models.TextField(null=True, verbose_name='ЧТО ЭТО)'),
        ),
        migrations.DeleteModel(
            name='StatusByAdminElective',
        ),
    ]
