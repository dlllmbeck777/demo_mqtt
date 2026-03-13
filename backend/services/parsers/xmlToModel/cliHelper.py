import os

def get_apps_dir():
    appsDir = '/django/backend/apps'
    return appsDir
        
def get_backend_dir():
    backendDir = (os.path.abspath(os.path.join(get_apps_dir(), os.pardir)))
    return backendDir

def create_folder(appname):
    os.system('mkdir '+get_apps_dir() + '/'+appname.lower())

def create_new_django_app(appname):
    appsdir = get_apps_dir()
    create_folder(appname)
    os.chdir(get_backend_dir())
    os.system('python manage.py startapp ' +appname+ ' ' +appsdir+'/'+appname)
    os.chdir(appsdir + '/' + appname)
    

    
