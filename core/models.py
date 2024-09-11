from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date

class CustomUser(AbstractUser):
    pass

    def __str__(self):
        return self.username
    class Meta:
        db_table = "CustomUser"
        
class Institute(models.Model):
    name = models.CharField('Название института', max_length=100)

    def __str__(self):
        return self.name
    class Meta:
        db_table = "Institute"
        verbose_name_plural = "Институты"
        verbose_name = "Институт"  

class Teacher(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, blank=True, null=True, verbose_name='Институт')
    is_admin = models.BooleanField('Проверяющий', null=True)
    last_name = models.CharField('Фамилия', max_length=150)
    first_name = models.CharField('Имя', max_length=150)
    middle_name = models.CharField('Отчество', max_length=150)

    def __str__(self):
        full_name = f"{self.last_name} {self.first_name} {self.middle_name}"
        return full_name.strip()

    class Meta:
        db_table = "Teacher"
        verbose_name_plural = "Преподаватели"
        verbose_name = "Преподаватель"

class Health(models.Model):
    name = models.CharField('Наименование группы здоровья', max_length=150)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = "Health"
        verbose_name_plural = "Группы здоровья"
        verbose_name = "Группа здоровья"

  

class Facultet(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, verbose_name='Институт')
    name = models.CharField('Направление подготовки',max_length=100)
    def __str__(self):
        return f"{self.name}"

    class Meta:
        db_table = "Facultet"
        verbose_name_plural = "Направления подготовки"
        verbose_name = "Направления подготовки"    

class Form(models.Model):
    name = models.CharField('Форма обучения',max_length=100)
    def __str__(self):
        return self.name

    class Meta:
        db_table = "Form"
        verbose_name_plural = "Формы обучения"
        verbose_name = "Форма обучения"

class Profile(models.Model):
    name = models.CharField('Наименование', max_length=255)
    facultet = models.ForeignKey(Facultet, on_delete=models.CASCADE, verbose_name="Направление подготовки")
    form = models.ForeignKey(Form, on_delete=models.CASCADE, verbose_name="Форма обучения")
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = "Profile"
        verbose_name_plural = "Профили обучения"
        verbose_name = "Профиль обучения"     

class Student(models.Model):
    last_name = models.CharField('Фамилия', max_length=150)
    first_name = models.CharField('Имя', max_length=150)
    middle_name = models.CharField('Отчество', max_length=150)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, verbose_name='Профиль обучения')
    year_of_study = models.IntegerField('Курс', null=True)
    group = models.CharField('Группа', max_length=100, null=True)
    average_grade = models.FloatField('Средний балл', null=True)
    health = models.ForeignKey(Health, on_delete=models.CASCADE, null=True, verbose_name='Группа здоровья')

    def __str__(self):
        full_name = f"{self.last_name} {self.first_name} {self.middle_name}"
        return full_name.strip()

    class Meta:
        db_table = "Student"
        verbose_name_plural = "Студенты"
        verbose_name = "Студент"
        
class Status(models.Model):
    name = models.CharField('Статус элективного курса')
    def __str__(self):
        return self.name
    class Meta:
        db_table = "Status"
        
class Elective(models.Model):
    name = models.CharField('Название', max_length=100, null=True, blank=True)
    describe = models.TextField('Описание',  null=True)
    place = models.IntegerField('Количество мест', null=True)
    form = models.ForeignKey(Form, on_delete=models.CASCADE, null=True)
    volume = models.IntegerField('Объем', null=True)
    date_registration = models.DateField(default=date.today)
    date_start = models.DateField(null=True)
    date_finish = models.DateField(null=True)
    marks = models.FloatField('Минимальный балл', null=True)
    health = models.ForeignKey(Health, on_delete=models.CASCADE, null=True)
    status = models.ForeignKey(Status, on_delete=models.CASCADE, null=True)
    registration_closed = models.BooleanField('Регистрация закрыта', default=False)
    
    def __str__(self):
        return f'{self.name}'
    class Meta:
        db_table = "Elective"
        verbose_name_plural = "Элективы"
        verbose_name = "Электив"
    
    
class TeacherElective(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True, verbose_name='Преподаватель')
    elective = models.ForeignKey(Elective, on_delete=models.CASCADE, null=True, verbose_name='Элективный курс')
    def __str__(self):
        return f'{self.teacher.last_name} -  {self.elective.name}'
    class Meta:
        db_table = "TeacherElective"
        verbose_name_plural = "Преподаватели в элективе"
        verbose_name = "Преподаватель в элективе"

class StudentElective(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE,  null=True, verbose_name='Студент')
    elective = models.ForeignKey(Elective, on_delete=models.CASCADE,  null=True, verbose_name='Электив')

    def __str__(self):
        return f'{self.student.last_name} -  {self.elective.name}'
    
    class Meta:
        db_table = "StudentElective"
        verbose_name_plural = "Студенты в элективе"
        verbose_name = "Студент в элективе"

class ElectiveInstitute(models.Model):
    elective = models.ForeignKey(Elective, on_delete=models.CASCADE)
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE)
    course = models.PositiveIntegerField(null=True, blank=True)  
    assign_all_courses = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.elective.name} -  {self.institute.name}'
    
    class Meta:
        db_table = "ElectiveInstitute"
        verbose_name_plural = "Институты в элективе"
        verbose_name = "Институт в элективе"

class ElectiveFacultet(models.Model):
    elective = models.ForeignKey(Elective, on_delete=models.CASCADE)
    facultet = models.ForeignKey(Facultet, on_delete=models.CASCADE)
    course = models.PositiveIntegerField(null=True, blank=True)  
    assign_all_courses = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.elective.name} -  {self.facultet.name}'
    
    class Meta:
        db_table = "ElectiveFacultet"
        verbose_name_plural = "Направления подготовки в элективе"
        verbose_name = "Направления подготовки в элективе"


class ElectiveProfile(models.Model):
    elective = models.ForeignKey(Elective, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    course = models.PositiveIntegerField(null=True, blank=True)  # курс обучения
    assign_all_courses = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.elective.name} -  {self.profile.name}'
    
    class Meta:
        db_table = "ElectiveProfile"
        verbose_name_plural = "Профили подготовки в элективе"
        verbose_name = "Профили подготовки в элективе"