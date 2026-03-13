import environ
import couchdb
import json
import datetime
from utils.service_config import COUCHDB_PASSWORD, COUCHDB_URL, COUCHDB_USER

env = environ.Env(DEBUG=(bool, False))
user = env("COUCHDB_USER", default=COUCHDB_USER)
password = env("COUCHDB_PASSWORD", default=COUCHDB_PASSWORD)
couchserver = couchdb.Server(COUCHDB_URL)


class couchdbUtils():

    def createDoc(self,**kwargs):
        try:
            self._CheckDb(model = kwargs['model'])
            db = couchserver[kwargs['model']]
            db.save(kwargs['doc'])
          
        except Exception as e:
            print('HATA',e)

    def _CheckDb(self,**kwargs):
        try:
            db = couchserver.create(kwargs['model'])
        except:
            pass

           
