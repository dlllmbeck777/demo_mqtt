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


app = flask.Flask(__name__)


@app.route('/get-prediction_P1TempB1_pred18h', methods=['POST'])
def get_prediction_P1TempB1_pred18h():
    try:
        with open('train3d_P1TempB1_pred18h.obj', 'rb') as f:
            m = pickle.load(f)
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
        

@app.route('/get-prediction_P1TempB2_pred18h', methods=['POST'])
def get_prediction_P1TempB2_pred18h():
    try:
        with open('train3d_P1TempB2_pred18h.obj', 'rb') as f:
            m = pickle.load(f)
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
        
        
        
@app.route('/get-prediction_P1Tempm1_pred12h', methods=['POST'])
def get_prediction_P1Tempm1_pred12h():
    try:
        with open('train3d_P1Tempm1_pred12h.obj', 'rb') as f:
            m = pickle.load(f)
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
        
        
        
@app.route('/get-prediction_P1Tempm2_pred12h', methods=['POST'])
def get_prediction_P1Tempm2_pred12h():
    try:
        with open('train3d_P1Tempm2_pred12h.obj', 'rb') as f:
            m = pickle.load(f)
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
        
        
        
@app.route('/get-prediction_P1Tempm3_pred18h', methods=['POST'])
def get_prediction_P1Tempm3_pred18h():
    try:
        with open('train3d_P1Tempm3_pred18h.obj', 'rb') as f:
            m = pickle.load(f)
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



@app.route('/get-prediction_P1Press_pred12h', methods=['POST'])
def get_prediction_P1Press_pred12h():
    try:
        with open('train3d_P1Press_pred12h.obj', 'rb') as f:
            m = pickle.load(f)
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
        
        
@app.route('/get-prediction_P1I_pred12h', methods=['POST'])
def get_prediction_P1I_pred12h():
    try:
        with open('train3d_P1I_pred12h.obj', 'rb') as f:
            m = pickle.load(f)
        request = flask.request.get_json()
        if "train_data" not in request:
            raise ApiError('ERR001', 'No data for model')
            

        train_data = pd.DataFrame(request['train_data'])
        execution_time=request['execution_time']
        print('before forecast')    
        print('train_date.shape',train_date.shape)    
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
        
        
@app.route('/get-prediction_P2TempB1_pred18h', methods=['POST'])
def get_prediction_P2TempB1_pred18h():
    try:
        with open('train3d_P2TempB1_pred18h.obj', 'rb') as f:
            m = pickle.load(f)
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
        

@app.route('/get-prediction_P2TempB2_pred18h', methods=['POST'])
def get_prediction_P2TempB2_pred18h():
    try:
        with open('train3d_P2TempB2_pred18h.obj', 'rb') as f:
            m = pickle.load(f)
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
        
        
        
@app.route('/get-prediction_P2Tempm1_pred12h', methods=['POST'])
def get_prediction_P2Tempm1_pred12h():
    try:
        with open('train3d_P2Tempm1_pred12h.obj', 'rb') as f:
            m = pickle.load(f)
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
        
        
        
@app.route('/get-prediction_P2Tempm2_pred12h', methods=['POST'])
def get_prediction_P2Tempm2_pred12h():
    try:
        with open('train3d_P2Tempm2_pred12h.obj', 'rb') as f:
            m = pickle.load(f)
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
        
        
        
@app.route('/get-prediction_P2Tempm3_pred18h', methods=['POST'])
def get_prediction_P2Tempm3_pred18h():
    try:
        with open('train3d_P2Tempm3_pred18h.obj', 'rb') as f:
            m = pickle.load(f)
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



@app.route('/get-prediction_P2Press_pred12h', methods=['POST'])
def get_prediction_P2Press_pred12h():
    try:
        with open('train3d_P2Press_pred12h.obj', 'rb') as f:
            m = pickle.load(f)
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
        
        
@app.route('/get-prediction_P2I_pred12h', methods=['POST'])
def get_prediction_P2I_pred12h():
    try:
        with open('train3d_P2I_pred12h.obj', 'rb') as f:
            m = pickle.load(f)
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
        
        
        
@app.route('/get-prediction_P4TempB1_pred18h', methods=['POST'])
def get_prediction_P4TempB1_pred18h():
    try:
        with open('train3d_P4TempB1_pred18h.obj', 'rb') as f:
            m = pickle.load(f)
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
        

@app.route('/get-prediction_P4TempB2_pred18h', methods=['POST'])
def get_prediction_P4TempB2_pred18h():
    try:
        with open('train3d_P4TempB2_pred18h.obj', 'rb') as f:
            m = pickle.load(f)
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
        
        
        
@app.route('/get-prediction_P4Tempm1_pred12h', methods=['POST'])
def get_prediction_P4Tempm1_pred12h():
    try:
        with open('train3d_P4Tempm1_pred12h.obj', 'rb') as f:
            m = pickle.load(f)
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
        
        
        
@app.route('/get-prediction_P4Tempm2_pred12h', methods=['POST'])
def get_prediction_P4Tempm2_pred12h():
    try:
        with open('train3d_P4Tempm2_pred12h.obj', 'rb') as f:
            m = pickle.load(f)
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
        
        
        
@app.route('/get-prediction_P4Tempm3_pred18h', methods=['POST'])
def get_prediction_P4Tempm3_pred18h():
    try:
        with open('train3d_P4Tempm3_pred18h.obj', 'rb') as f:
            m = pickle.load(f)
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
        
        
@app.route('/get-prediction_P4I_pred12h', methods=['POST'])
def get_prediction_P4I_pred12h():
    try:
        with open('train3d_P4I_pred12h.obj', 'rb') as f:
            m = pickle.load(f)
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

