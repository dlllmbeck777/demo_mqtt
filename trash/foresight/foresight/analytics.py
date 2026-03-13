import json
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

f = open('foresight/models/device.json')
data = json.load(f)



def get_status(sensor_data):
    statuses = {}
    extra_status = [{'status': 'Неисправность датчика',
                     'colorLabel': 'OK',
                     'color': '#bc7306',
                     'possibleStatuses': ['Датчик неисправен'], 
                     'operationalRecommendations': ['Проверьте работоспособность датчика']}]
    
    for entry in sensor_data:
        if "v" in entry.keys():
            val = entry['v']
            sensor_code = entry['id'].split('.')[-1][0:2]

            if sensor_code in ['VT', 'PT', 'TT']:
                for device in data['devices']:
                    if device['code'] == sensor_code:

                        for status in device['valueRecommendations']:
                            if (val >= status['fromValueInclusive'] and val < status['toValueExclusive']):

                                if device['group'] in statuses:
                                    if status['sortOrder'] > statuses[device['group']][0]['sortOrder']:
                                        statuses[device['group']].insert(0, status)
                                    else:
                                        statuses[device['group']].append(status)
                                else:    
                                    statuses[device['group']] = [status]
    
    if 'PUMP' not in statuses:
        statuses['PUMP'] = extra_status
            
    if 'BEARING_x5F_UNIT' not in statuses:
        statuses['BEARING_x5F_UNIT'] = extra_status
            
    if 'ELECTRIC_x5F_MOTOR_x5F_BEARING_x5F_1' not in statuses:
        statuses['ELECTRIC_x5F_MOTOR_x5F_BEARING_x5F_1'] = extra_status
            
    if 'ELECTRIC_x5F_MOTOR_x5F_BEARING_x5F_2' not in statuses:
        statuses['ELECTRIC_x5F_MOTOR_x5F_BEARING_x5F_2'] = extra_status
            
    if 'ROTOR' not in statuses:
        statuses['ROTOR'] = extra_status                
                
    return statuses



def get_predictions(last_week_data, current_week_data1):
    current_week_data = {}
    if current_week_data1.keys() != last_week_data.keys():
        for key in current_week_data1.keys():
            if key in last_week_data.keys():
                current_week_data[key] = current_week_data1[key]
    else:
        current_week_data = current_week_data1
    
    predict_list = np.array(list(zip(*np.array(list(current_week_data.values())).reshape(-1,21)))[::1])
    X = np.array(list(zip(*np.array(list(last_week_data.values())).reshape(-1,21)))[::1])
    
    dates = [(datetime.today() + timedelta(hours=8*i)).strftime("%d-%m") for i in range(1,22)]
    res_model = {}

    for sens in current_week_data:
        y = current_week_data[sens]
        #print(y)

        reg = LinearRegression().fit(X, y)
        reg.score(X, y)

        reg.coef_

        reg.intercept_

        #predict_list = np.array([i for i in range(22,43)])

        ans = reg.predict(predict_list)
        res_model[sens] = [list(ans),dates]
    
    for_statuses = []
    for sens in res_model:
        #print(np.mean(res_model[sens][0]))
        for_statuses.append({'id': sens, 'v': np.mean(res_model[sens][0])})
    
    statuses = get_status(for_statuses)
    return res_model, statuses
    