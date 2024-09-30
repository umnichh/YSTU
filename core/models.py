from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date

class CustomUser(AbstractUser):
    pass

    def __str__(self):
        return self.username
    class Meta:
        db_table = "CustomUser"

class Admin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    last_name = models.CharField('Фамилия', max_length=150)
    first_name = models.CharField('Имя', max_length=150)
    middle_name = models.CharField('Отчество', max_length=150)

    def __str__(self):
        return f"{self.last_name} {self.first_name} {self.middle_name}"

    class Meta:
        db_table = "Admin"
        verbose_name_plural = "Администрация"
        verbose_name = "Админ"

class Type(models.Model):
    name = models.CharField('Тип курса', max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "Type"
        verbose_name_plural = "Тип курсов"
        verbose_name = "Тип курса"
    
class Course(models.Model):
    name = models.PositiveIntegerField("Курс", null=True, blank=True)
    def __str__(self):
        return f"{self.name} курс"
    
    class Meta:
        db_table = "Course"
        verbose_name_plural = "Курсы"
        verbose_name = "Курс"

class Semester(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, verbose_name="Курс")
    name = models.PositiveIntegerField("Семестр", null=True, blank=True)

    def __int__(self):
        return f"{str(self.name)}"
    
    class Meta:
        db_table = "Semester"
        verbose_name_plural = "Семестры"
        verbose_name = "Семестр"

class Institute(models.Model):
    name = models.CharField('Название института', max_length=100)

    def __str__(self):
        return self.name
    class Meta:
        db_table = "Institute"
        verbose_name_plural = "Институты"
        verbose_name = "Институт"  

class Ugsn(models.Model):
    name = models.CharField('УГСН', max_length=10)
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, verbose_name='Институт')

    def __str__(self):
        return self.name
    class Meta:
        db_table = "Ugsn"
        verbose_name_plural = "УГСН"
        verbose_name = "УГСН"  

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
    ugsn = models.ForeignKey(Ugsn, on_delete=models.CASCADE, null=True, verbose_name="УГСН")
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
        return f"{self.name} - {self.form.name}"
    
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
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True,)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, null=True)
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
        verbose_name_plural = "Статусы элективного курса"
        verbose_name = "Статус элективного курса"

class StatusByAdmin(models.Model):
    name = models.CharField('Название', max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = "StatusByAdmin"
        verbose_name_plural = "Статусы проверки"
        verbose_name = "Статус проверки"
        


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
    type = models.ForeignKey(Type, on_delete=models.CASCADE, null=True, verbose_name="Тип курса")
    made_by = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True)
    note = models.TextField('Примечание преподавателя', null=True)
    comment = models.CharField('Комментарий', max_length=255, null=True, blank=True)
    admin_status = models.ForeignKey(StatusByAdmin, on_delete=models.CASCADE, null=True)

    def change_status(self):
        today = date.today()

        if self.date_start and self.date_finish:
            if self.date_start <= today < self.date_finish:
                status_started = Status.objects.get(name='Начался')
                self.status = status_started
            elif today >= self.date_finish:
                status_finished = Status.objects.get(name='Завершён')
                self.status = status_finished
            else:
                status_soon = Status.objects.get(name='Скоро начнётся')
                self.status = status_soon
            self.save()

    
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
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    assign_all_semestrs = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.elective.name} -  {self.institute.name}'
    
    class Meta:
        db_table = "ElectiveInstitute"
        verbose_name_plural = "Институты в элективе"
        verbose_name = "Институт в элективе"

class ElectiveFacultet(models.Model):
    elective = models.ForeignKey(Elective, on_delete=models.CASCADE)
    facultet = models.ForeignKey(Facultet, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE) 
    assign_all_semestrs = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.elective.name} -  {self.facultet.name}'
    
    class Meta:
        db_table = "ElectiveFacultet"
        verbose_name_plural = "Направления подготовки в элективе"
        verbose_name = "Направления подготовки в элективе"

class ElectiveProfile(models.Model):
    elective = models.ForeignKey(Elective, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.elective.name} -  {self.profile.name}'
    
    class Meta:
        db_table = "ElectiveProfile"
        verbose_name_plural = "Профили подготовки в элективе"
        verbose_name = "Профили подготовки в элективе"



class ElectiveProfileCourse(models.Model):
    electiveprofile = models.ForeignKey(ElectiveProfile, on_delete=models.CASCADE, null=True)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, null=True)
    all_course = models.BooleanField("Назначен ли всем курсам", default=False)

    def __str__(self):
        return f'{self.electiveprofile.elective.name} -  {self.semester}'
    
    class Meta:
        db_table = "ElectiveProfileCourse"
        verbose_name_plural = "Курсы в профиле в элективе"
