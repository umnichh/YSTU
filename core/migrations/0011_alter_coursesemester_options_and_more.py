# Generated by Django 5.1.1 on 2024-09-20 16:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_remove_course_semester_coursesemester'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='coursesemester',
            options={'verbose_name': 'Семестр в курсе', 'verbose_name_plural': 'Семестры в курсе'},
        ),
        migrations.AlterModelTable(
            name='coursesemester',
            table='CourseSemester',
        ),
    ]
