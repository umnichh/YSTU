# Установка базового образа
FROM python:3.12.5

# Установка переменной окружения PYTHONUNBUFFERED
ENV PYTHONUNBUFFERED=1

# Создание директории приложения в контейнере
RUN mkdir /ElectiveNeverEnds

# Установка рабочей директории
WORKDIR /ElectiveNeverEnds

# Копирование зависимостей проекта и установка их
COPY requirements.txt /ElectiveNeverEnds/
RUN pip install -r requirements.txt

# Копирование всего проекта в контейнер
COPY . /ElectiveNeverEnds/
