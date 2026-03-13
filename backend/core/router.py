from django.conf import settings
import socket


def test_connection_to_db(database_name):
    try:
        db_definition = getattr(settings.dev, 'DATABASES')[database_name]
        s = socket.create_connection(
            (db_definition['HOST'], db_definition['PORT']), 5)
        s.close()
        return True
    except:
        return False


class DatabaseAppsRouter(object):
 
    def db_for_read(self, model, **hints):
        if model._meta.app_label in settings.DATABASE_APPS_MAPPING:
            return settings.DATABASE_APPS_MAPPING[model._meta.app_label]
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label in settings.DATABASE_APPS_MAPPING:
            return settings.DATABASE_APPS_MAPPING[model._meta.app_label]
        return None
    
    def allow_relation(self, obj1, obj2, **hints):            
        db1 = settings.DATABASE_APPS_MAPPING.get(obj1._meta.app_label)
        db2 = settings.DATABASE_APPS_MAPPING.get(obj2._meta.app_label)
        if db1 and db2:
            return db1 == db2
        return None
 
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if db in settings.DATABASE_APPS_MAPPING.values():
            return settings.DATABASE_APPS_MAPPING.get(app_label) == db
        elif app_label in settings.DATABASE_APPS_MAPPING:
            return False
    
    # def allow_syncdb(self, db, model):        
    #     if db in settings.DATABASE_APPS_MAPPING.values():
    #         return settings.DATABASE_APPS_MAPPING.get(model._meta.app_label) == db
    #     elif settings.DATABASE_APPS_MAPPING.has_key(model._meta.app_label):
    #         return False
    #     return None