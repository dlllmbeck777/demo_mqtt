import os

os.chdir('/django/backend')
os.system('python manage.py makemigrations')
os.system('python manage.py migrate')
