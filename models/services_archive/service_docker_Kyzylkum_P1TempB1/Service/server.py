import flask
import logging
import pandas as pd
import numpy as np
import lightgbm as lgb
import dill as pickle
import utils
from decimal import Decimal
from utils import ApiError
import warnings
import json

warnings.filterwarnings("ignore")


logger = utils.init_logger('Sensor_predict_model')


with open('train3d_P1TempB1_pred18h.obj', 'rb') as f:
    m = pickle.load(f)


app = flask.Flask(__name__)


@app.route('/get-prediction', methods=['POST'])
def get_prediction():
    try:
        request = flask.request.get_json()
        if "train_data" not in request:
            raise ApiError('ERR001', 'No data for model')
            

        train_data = pd.DataFrame(request['train_data'])
        execution_time=request['execution_time']
        print('before forecast')        
        try:
            forecast=m.predict(train_data,execution_time)
            print('after forecast')
        except Exception:
            raise ApiError('ERR004', 'Exception in prediction')
        #print(forecast.head())
        return flask.jsonify(forecast.to_dict(orient='records'))

    except Exception as err:
        logger.error(err)
        raise err


@app.route('/health', methods=['GET'])
def service_check():
    return flask.jsonify({'result': 'OK'})


@app.errorhandler(ApiError)
def api_error_handler(error):
    logger.error(error.get_error(), exc_info=True)
    return flask.jsonify(error.get_error())


@app.errorhandler(Exception)
def handler(error):
    m = "Error: {} Message: {}".format(type(error).__name__, error)
    logger.error(m, exc_info=True)
    return flask.jsonify(ApiError('ERR000', 'Internal error: ' + m).get_error())

