from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
import datetime



# View to get user role
class UserRoleView(APIView):

    def get(self, request):
        user = request.user
        try:
            student = Student.objects.get(user=user)
            return Response({'role': 'student'})
        except Student.DoesNotExist:
            pass

        try:
            teacher = Teacher.objects.get(user=user)
            return Response({'role': 'teacher'})
        except Teacher.DoesNotExist:
            pass
        try:
            admin = Admin.objects.get(user=user)
            return Response({'role': 'admin'})
        except Teacher.DoesNotExist:
            pass
    
        return Response({'error': 'Роль не найдена'}, status=status.HTTP_404_NOT_FOUND)


# View for Teacher's cabinet
class TeacherCabinetView(APIView):

    def get(self, request):
        user = request.user
        try:
            teacher = Teacher.objects.get(user=user)
            serializer = TeacherSerializer(teacher)
            return Response(serializer.data)
        except Teacher.DoesNotExist:
            return Response({'error': 'Преподаватель не найден'}, status=status.HTTP_404_NOT_FOUND)


# View for Student's cabinet
class StudentCabinetView(APIView):

    def get(self, request):
        user = request.user
        try:
            student = Student.objects.get(user=user)
            serializer = StudentSerializer(student)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response({'error': 'Студент не найден'}, status=status.HTTP_404_NOT_FOUND)


# View for all electives
class AllElectivesView(APIView):

    def get(self, request):
        admin_status = StatusByAdmin.objects.filter(name='Принят').first()
        electives = Elective.objects.filter(admin_status=admin_status)
        serializer = ElectiveSerializer(electives, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Elective view to handle both GET and POST requests
class ElectiveView(APIView):

    def get(self, request):
        teachers = Teacher.objects.all()
        healths = Health.objects.all()
        forms = Form.objects.all()

        teacherSerializer = TeacherSerializer(teachers, many=True)
        healthSerializer = HealthSerializer(healths, many=True)
        formSerializer = FormSerializer(forms, many=True)

        data = {
            'teachers': teacherSerializer.data,
            'healths': healthSerializer.data,
            'forms': formSerializer.data
        }

        return Response(data)

    def post(self, request):
        data = request.data
        teacher = Teacher.objects.get(user=request.user)
        
        serializer = ElectiveSerializer(data=data)
        if serializer.is_valid():
            validated_data = serializer.validated_data

            health_id = data.get('health')
            form_id = data.get('form')
            health = Health.objects.get(id=health_id)
            form = Form.objects.get(id=form_id)
            status_first = Status.objects.filter(name='Скоро начнётся').first()
            type_id = data.get('type')
            type = Type.objects.get(id=type_id)
            admin_status = StatusByAdmin.objects.filter(name='Ожидает проверки').first()
            elective = Elective.objects.create(
                name=validated_data['name'],
                describe=validated_data['describe'],
                place=validated_data['place'],
                form=form,
                volume=validated_data['volume'],
                date_start=validated_data['date_start'],
                date_finish=validated_data['date_finish'],
                marks=validated_data['marks'],
                health=health,
                status=status_first,
                made_by=teacher,
                type = type,
                note = validated_data['note'],
                admin_status = admin_status
            )

            teacher_ids = data.get('selectedTeachers', [])
            for teacher_id in teacher_ids:

                teacher = Teacher.objects.get(id=teacher_id)
                TeacherElective.objects.create(elective=elective, teacher=teacher)
        
            profiles = data.get('checked', [])
            checked_courses = data.get('checkedCourses', [])  # Если данные приходят как просто список семестров
            checked_courses_list = data.get('checkedCoursesList', {})  # Если данные приходят в виде {profile_id: [semester_ids]}

            # course = data.get('course', None)
            # semestr = data.get('semestr', None)
            # assign_all_semestrs = data.get('assign_all_semestrs', False)
            
            if checked_courses:
                for profile_id in profiles:
                    try:
                        profile = Profile.objects.get(id=profile_id)
                        elective_profile = ElectiveProfile.objects.create(elective=elective, profile=profile)
                        for semester_id in checked_courses:
                            semester = Semester.objects.get(id=semester_id)
                            ElectiveProfileCourse.objects.create(electiveprofile=elective_profile, semester=semester)
                    except Profile.DoesNotExist:
                        return Response({'error': f'Профиль с айди {profile_id} не найден'}, status=status.HTTP_404_NOT_FOUND)
                    
            elif checked_courses_list:
                for profile_id, semester_ids in checked_courses_list.items():
                    try:
                        profile = Profile.objects.get(id=profile_id)
                        elective_profile = ElectiveProfile.objects.create(elective=elective, profile=profile)
                        for semester_id in semester_ids:
                            semester = Semester.objects.get(id=semester_id)
                            ElectiveProfileCourse.objects.create(electiveprofile=elective_profile, semester=semester)
                    except Profile.DoesNotExist:
                        return Response({'error': f'Профиль с айди {profile_id} не найден'}, status=status.HTTP_404_NOT_FOUND)
                

            return Response({
                'message': 'Elective created',
                'elective': ElectiveSerializer(elective).data
            }, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
class ElectiveDetailView(APIView):
    
    def get(self, request, id):
        try:
            elective = Elective.objects.get(id=id)
            serializer = ElectiveSerializer(elective)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Elective.DoesNotExist:
            return Response({'error': 'Электив не найден'}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, id):
        elective = Elective.objects.filter(id=id).first()
        elective.delete()
        return Response({'message' : 'электив удалён и это печально'})


class EnrollElectiveView(APIView):
    def post(self, request, id):
        try:
            student = Student.objects.get(user=request.user)
            elective = Elective.objects.get(id=id)
            admin_status = StatusByAdmin.objects.filter(name='Принят').first()
            if StudentElective.objects.filter(student=student, elective=elective).exists():
                return Response({'error' : 'Студент уже записан'}, status=status.HTTP_400_BAD_REQUEST)
            counter = StudentElective.objects.filter(elective=elective).count()
            if elective.admin_status == admin_status:
                if elective.place - counter > 0:
                    StudentElective.objects.create(student=student, elective=elective)
                else:
                    return Response({'error' : 'Нет мест на элективе'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'message': 'Студент записался'}, status=status.HTTP_201_CREATED)
        except Student.DoesNotExist:
            return Response({'error': 'Студент не найден!'}, status=status.HTTP_404_NOT_FOUND)
        except Elective.DoesNotExist:
                return Response({'error': 'Электив не найден'}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, id):
        try:
            student = Student.objects.get(user=request.user)
            elective = Elective.objects.get(id=id)
            studentelective = StudentElective.objects.get(student=student, elective=elective)
            studentelective.delete()
            return Response({'Success' : 'Запись студента отменена'}, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({'error': 'Студент не найден!'}, status=status.HTTP_404_NOT_FOUND)
        except Elective.DoesNotExist:
                return Response({'error': 'Электив не найден'}, status=status.HTTP_404_NOT_FOUND)
        except StudentElective.DoesNotExist:
            return Response({'error': 'Студент не записан на этот электив'}, status=status.HTTP_400_BAD_REQUEST)
        
class ElectiveAvaliableStudentView(APIView):
    
    def get(self, request):
        try:
            user = request.user
            student = Student.objects.get(user=user)
            student_profile = student.profile
            admin_status = StatusByAdmin.objects.filter(name='Принят').first()
            available_electives = Elective.objects.filter(
            electiveprofile__profile=student_profile, admin_status=admin_status 
        ).exclude(studentelective__student=student)
            available_elective = []
            for elective in available_electives:
                counter = StudentElective.objects.filter(elective=elective).count()
                if elective.place - counter > 0:
                    available_elective.append(elective)

            serializer = ElectiveSerializer(available_elective, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Student.DoesNotExist:
            return Response({'error': 'Студент не найден'}, status=status.HTTP_404_NOT_FOUND)
        
class StudentElectiveView(APIView):
    def get(self, request):
        try:
            user = request.user
            student = Student.objects.get(user=user)
            enrolled_electives = Elective.objects.filter(studentelective__student=student)
            serializer = ElectiveSerializer(enrolled_electives, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Student.DoesNotExist:
            return Response({'error': 'Студент не найден'}, status=status.HTTP_404_NOT_FOUND)

class TeacherElectivView(APIView):
    def get(self, request):
        try:
            user = request.user
            teacher = Teacher.objects.get(user=user)
            admin_status = StatusByAdmin.objects.filter(name='Принят').first()
            electives = Elective.objects.filter(teacherelective__teacher=teacher, admin_status=admin_status)
            serializer = ElectiveSerializer(electives, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({'error': 'Преподаватель не найден'}, status=status.HTTP_404_NOT_FOUND)
        
class UploadInstitutesView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        if 'document' not in request.FILES:
            return Response({'error': 'Файл отсутствует'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uploaded_file = request.FILES['document']
            data = pd.read_excel(uploaded_file)

            for index, row in data.iterrows():
                institute_name = row['Институт']
                ugsn_name = row['УГСН']
                faculty_name = row['Специальность']
                profile_name = row['Профиль']
                form_of_study = row['Форма обучения']

                form = Form.objects.filter(name=form_of_study.capitalize()).first()
                institute, _ = Institute.objects.get_or_create(name=institute_name)
                ugsn, _ = Ugsn.objects.get_or_create(name=ugsn_name, institute=institute)
                faculty, _ = Facultet.objects.get_or_create(name=faculty_name, ugsn=ugsn)

                if not pd.isnull(profile_name):
                    profile, _ = Profile.objects.get_or_create(name=profile_name, facultet=faculty, form=form)

            return Response({'message': 'Данные загружены'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(str(e))
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class AllInstitutes(APIView):
    def get(self, request):
        institutes = Institute.objects.all()
        facultets = Facultet.objects.all()
        profiles = Profile.objects.all()
        courses = Course.objects.all()
        semesters = Semester.objects.all()
        instituteSerializer = InstituteSerializer(institutes, many=True)
        facultetSerializer = FacultetSerializer(facultets, many=True)
        profileSerializer = ProfileSerializer(profiles, many=True)
        courseSerializer = CourseSerializer(courses, many=True)
        semesterSerializer = SemesterSerializer(semesters, many=True)
        data = {
            'institutes': instituteSerializer.data,
            'facultets': facultetSerializer.data,
            'profiles': profileSerializer.data,
            'courses' : courseSerializer.data,
            'semesters' : semesterSerializer.data
        }
        return Response(data)

class StudentElectivesFitler(APIView):
    def get(self, request):
        try:
            student = Student.objects.get(user=request.user)
            electives = Elective.objects.filter(
                electiveinstitute__institute = student.institute
            )
        except Student.DoesNotExist:
            return Response({'error' : 'Студент не найден'})
    

# class AddInstituteElective(APIView):  
#     def post(self, request, elective_id): 
#         elective = Elective.objects.get(id=elective_id)
#         data = request.data

#         institutes = data.get('institutes', [])
#         facultets = data.get('facultets', [])
#         profiles = data.get('profiles', [])

#         for institute_data in institutes:
#             institute_id = institute_data.get('id')
#             semestr = institute_data.get('semestr', None)
#             assign_all_semestrs = institute_data.get('assign_all_semestrs', False)

#             try:
#                 institute = Institute.objects.get(id=institute_id)
#                 ElectiveInstitute.objects.create(
#                     elective=elective,
#                     institute=institute,
#                     semestr=semestr if not assign_all_semestrs else None,
#                     assign_all_semestrs=assign_all_semestrs
#                 )
#             except Institute.DoesNotExist:
#                 return Response({'error': f'Институт с айди {institute_id} не найден'}, status=status.HTTP_404_NOT_FOUND)

#         for facultet_data in facultets:
#             facultet_id = facultet_data.get('id')
#             semestr = facultet_data.get('semestr', None)
#             assign_all_semestrs = facultet_data.get('assign_all_semestrs', False)

#             try:
#                 facultet = Facultet.objects.get(id=facultet_id)
#                 ElectiveFacultet.objects.create(
#                     elective=elective,
#                     facultet=facultet,
#                     semestr=semestr if not assign_all_semestrs else None,
#                     assign_all_semestrs=assign_all_semestrs
#                 )
#             except Facultet.DoesNotExist:
#                 return Response({'error': f'Факультет с айди {facultet_id} не найден'}, status=status.HTTP_404_NOT_FOUND)

#         for profile_data in profiles:
#             profile_id = profile_data.get('id')
#             semestr = profile_data.get('semestr', None)
#             assign_all_semestrs = profile_data.get('assign_all_semestrs', False)

#             try:
#                 profile = Profile.objects.get(id=profile_id)
#                 ElectiveProfile.objects.create(
#                     elective=elective,
#                     profile=profile,
#                     semestr=semestr if not assign_all_semestrs else None,
#                     assign_all_semestrs=assign_all_semestrs
#                 )
#             except Profile.DoesNotExist:
#                 return Response({'error': f'Профиль с айди {profile_id} не найден'}, status=status.HTTP_404_NOT_FOUND)

#         return Response({'message': 'всякое назначено'}, status=status.HTTP_201_CREATED)

    
class ElectivesMadeByTeacher(APIView):
    def get(self, request):
        teacher = Teacher.objects.get(user=request.user)
        electives = Elective.objects.filter(made_by=teacher)
        electiveseriazier = ElectiveSerializer(electives, many=True)
        return Response(electiveseriazier.data)


class AllDataView(APIView):
    def get(self, request):
        institutes = Institute.objects.all()
        ugsns = Ugsn.objects.all()
        facultets = Facultet.objects.all()
        profiles = Profile.objects.all()
        teachers = Teacher.objects.all()
        forms = Form.objects.all()
        healths = Health.objects.all()
        courses = Course.objects.all()
        types = Type.objects.all()

        instituteSerializer = InstituteSerializer(institutes, many=True)
        ugsnSerializer = UGSNSerializer(ugsns, many=True)
        facultetSerializer = FacultetSerializer(facultets, many=True)
        profileSerializer = ProfileSerializer(profiles, many=True)
        formSerializer = FormSerializer(forms, many=True)
        teacherSerializer = TeacherSerializer(teachers, many=True)
        healthSerializer = HealthSerializer(healths, many=True)
        courseSerializer = CourseSerializer(courses, many=True)
        typeSerializer = TypeSerializer(types, many=True)

        data = {
            'institutes': instituteSerializer.data,
            'ugsns': ugsnSerializer.data,
            'facultets': facultetSerializer.data,
            'profiles': profileSerializer.data,
            'forms' : formSerializer.data,
            'teachers' : teacherSerializer.data,
            'healths' : healthSerializer.data,
            'courses' : courseSerializer.data,
            'types' : typeSerializer.data
        }   
        return Response(data)


class ElectiveEditView(APIView):
    def get(self, request, id):
        try:
            elective = Elective.objects.get(id=id)

            # Получаем учителей для электива и сериализуем их
            teacher_electives = TeacherElective.objects.filter(elective=elective)
            teachers = [TeacherSerializer(teacher_elective.teacher).data for teacher_elective in teacher_electives]
            
            # Получаем профили и семестры для электива
            elective_profiles = ElectiveProfile.objects.filter(elective=elective)
            checked_profiles = [ProfileSerializer(profile.profile).data for profile in elective_profiles]

            # Структура checkedCoursesList
            checked_courses_list = {}
            for elective_profile in elective_profiles:
                courses = ElectiveProfileCourse.objects.filter(electiveprofile=elective_profile)
                checked_courses_list[elective_profile.profile.id] = [SemesterSerializer(course.semester).data for course in courses]

            # Подготовка данных для ответа
            data = {
                'id': elective.id,
                'name': elective.name,
                'describe': elective.describe,
                'place': elective.place,
                'form': FormSerializer(elective.form).data,  
                'volume': elective.volume,
                'note' : elective.note,
                'date_start': elective.date_start,
                'date_finish': elective.date_finish,
                'marks': elective.marks,
                'health': HealthSerializer(elective.health).data,  
                'status': StatusSerializer(elective.status).data,  
                'type': TypeSerializer(elective.type).data,  
                'selectedTeachers': teachers,  
                'checked': checked_profiles,  
                'checkedCoursesList': checked_courses_list,  
            }

            return Response(data, status=status.HTTP_200_OK)

        except Elective.DoesNotExist:
            return Response({'error': 'Электив не найден'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, id):
        try:
            elective = Elective.objects.get(id=id)
            data = request.data

            # Обновление основных полей электива
            elective.name = data.get('name', elective.name)
            elective.describe = data.get('describe', elective.describe)
            elective.place = data.get('place', elective.place)
            elective.form_id = data.get('form', elective.form.id)
            elective.volume = data.get('volume', elective.volume)
            elective.date_start = data.get('date_start', elective.date_start)
            elective.date_finish = data.get('date_finish', elective.date_finish)
            elective.marks = data.get('marks', elective.marks)
            elective.health_id = data.get('health', elective.health.id)
            elective.status_id = data.get('status', elective.status.id)
            elective.type_id = data.get('type', elective.type.id)
            elective.note = data.get('note', elective.note)
            elective.save()

            # Обновление учителей
            selected_teachers = data.get('selectedTeachers', [])
            TeacherElective.objects.filter(elective=elective).delete()
            for teacher_id in selected_teachers:
                teacher = Teacher.objects.get(id=teacher_id)
                TeacherElective.objects.create(elective=elective, teacher=teacher)

            # Обновление профилей и семестров
            checked_profiles = data.get('checked', [])
            checked_courses_list = data.get('checkedCoursesList', {})
            ElectiveProfile.objects.filter(elective=elective).delete()

            for profile_id in checked_profiles:
                profile = Profile.objects.get(id=profile_id)
                elective_profile = ElectiveProfile.objects.create(
                    elective=elective,
                    profile=profile
                )
                
                semesters = checked_courses_list.get(str(profile_id), [])
                for semester_id in semesters:
                    semester = Semester.objects.get(id=semester_id)
                    ElectiveProfileCourse.objects.create(
                        electiveprofile=elective_profile,
                        semester=semester
                    )

            return Response({'message': 'Электив обновлён'}, status=status.HTTP_200_OK)

        except Elective.DoesNotExist:
            return Response({'error': 'Электив не найден'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class TeacherElectiveArchive(APIView):
    def get(self, request):
        try:
            teacher = Teacher.objects.get(user=request.user)
            statuss = Status.objects.get(name='Завершён')
            teacherElective = Elective.objects.filter(teacherelective__teacher=teacher, status=statuss)
            serializer = ElectiveSerializer(teacherElective, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Teacher.DoesNotExist:
            return Response({"error": "Пользователь не является преподавателем."}, status=status.HTTP_400_BAD_REQUEST)

        except Status.DoesNotExist:
            return Response({"error": "Статус 'Завершён' не найден."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": f"Произошла ошибка: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    

class StudentElectiveArchive(APIView):
    def get(self, request):
        try:
            student = Student.objects.get(user=request.user)
            statuss = Status.objects.get(name='Завершён')
            studentElective = Elective.objects.filter(studentelective__student=student, status=statuss)
            serializer = ElectiveSerializer(studentElective, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({"error": "Пользователь не является студентом."}, status=status.HTTP_400_BAD_REQUEST)

        except Status.DoesNotExist:
            return Response({"error": "Статус 'Завершён' не найден."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": f"Произошла ошибка: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class ElectivesToCheck(APIView):
    def get(self, request):
        try:
            statusByAdmin = StatusByAdmin.objects.get(name='Ожидает проверки')
            electives = Elective.objects.filter(admin_status=statusByAdmin)
            serializer = ElectiveSerializer(electives, many=True)
            admin_statuses = StatusByAdmin.objects.all()
            admin_serializer = StatusByAdminSerializer(admin_statuses, many=True)
            data = {}
            data = {
                'admin_statuses': admin_serializer.data,
                'checked_electives' : serializer.data
            }
            return Response(data, status=status.HTTP_200_OK)
        
        except statusByAdmin.DoesNotExist:
                return Response({"error": "Статус 'Ожидает проверки' не найден."}, status=status.HTTP_404_NOT_FOUND)
        
class CheckedElectives(APIView):
    def get(self, request):
        try:
            statusByAdmin = StatusByAdmin.objects.get(name='Принят')
            electives = Elective.objects.filter(admin_status=statusByAdmin)
            serializer = ElectiveSerializer(electives, many=True)
     
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except statusByAdmin.DoesNotExist:
                return Response({"error": "Статус 'Принят' не найден."}, status=status.HTTP_404_NOT_FOUND)
        
class CanceledElectives(APIView):
    def get(self, request):
        try:
            statusByAdmin = StatusByAdmin.objects.get(name='Отклонён')
            electives = Elective.objects.filter(admin_status=statusByAdmin)
            serializer = ElectiveSerializer(electives, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except statusByAdmin.DoesNotExist:
                return Response({"error": "Статус 'Отклонён' не найден."}, status=status.HTTP_404_NOT_FOUND)
        

class CheckElectives(APIView):
    def get(self, request):
        admin_statuses = StatusByAdmin.objects.all()
        return Response(StatusByAdminSerializer(admin_statuses).data)
    
    def post(self, request, id):
        try:
            # Получаем данные из запроса
            data = request.data
            print(data)
            elective = Elective.objects.get(id=id)
            status_id = data.get('status_id')  # Идентификатор нового статуса
            comment = data.get('comment')  # Комментарий от администратора (необязательный)

            # Проверяем, что статус был передан
            if not status_id:
                return Response({"error": "Необходимо указать идентификатор статуса"}, status=status.HTTP_400_BAD_REQUEST)

            # Находим новый статус в модели StatusByAdmin
            try:
                admin_status = StatusByAdmin.objects.get(id=status_id)
                print(admin_status)
            except StatusByAdmin.DoesNotExist:
                return Response({"error": "Указанный статус не найден"}, status=status.HTTP_404_NOT_FOUND)

            
            if admin_status.name == 'Отклонён' and not comment:
                return Response({"error": "Необходимо указать комментарий при отклонении"}, status=status.HTTP_400_BAD_REQUEST)

            # Обновляем статус и комментарий (если есть)
            elective.admin_status = admin_status
            if comment:
                elective.comment = comment

            # Сохраняем изменения в базе данных
            elective.save()

            # Возвращаем сообщение об успешном изменении статуса
            return Response({"message": f"Статус электива успешно изменён на '{admin_status.name}'."}, status=status.HTTP_200_OK)

        except Elective.DoesNotExist:
            return Response({"error": "Электив не найден."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": f"Произошла ошибка: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TeacherResendElective(APIView):
    def get(self, request):
        try:
            status_to_check = StatusByAdmin.objects.get(name='Ожидает проверки')    
            admin_serializer = StatusByAdminSerializer(status_to_check)
            return Response(admin_serializer.data)
        
        except StatusByAdmin.DoesNotExist:
            return Response({"error": "Статус не найден."}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request, id):
        try:
            elective = Elective.objects.get(id=id)
            status_to_check = StatusByAdmin.objects.get(name='Ожидает проверки')
            elective.admin_status = status_to_check
            elective.comment = ""
            elective.save()
            return Response({"message": "статус изменён"}, status=status.HTTP_200_OK)
        
        except StatusByAdmin.DoesNotExist:
            return Response({"error": "Статус не найден."}, status=status.HTTP_404_NOT_FOUND)
        except Elective.DoesNotExist:
            return Response({"error": "Электив не найден."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Произошла ошибка: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudentElectiveRequest(APIView):
    def get(self, request, id):
        elective = Elective.objects.get(id=id)
        students =  Student.objects.filter(studentelective__elective=elective)
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)