from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# from foresight.tasks import device_result
from main.forms import MaintenanceForm, MaintenanceOilForm, MaintenanceSealantForm, RepairForm, RepairWorkBearingForm, RepairWorkRotorForm, RepairWorkShaftForm, RepairWorkWheelForm
from django.forms import formset_factory
from django.contrib import messages
from django.core.paginator import Paginator
from main.models import Maintenance, Pump, Repair, Station, Sensor, Value, Prediction, Max_prediction
from main.filters import RepairFilter, MaintenanceFilter
from django.shortcuts import get_object_or_404
from pymongo import MongoClient
from bson import json_util
import json
from datetime import datetime, timedelta
# from foresight.analytics import get_colors, get_statuses, get_history_data
from math import exp
# Create your views here.
from django.http import HttpResponse
from main.resources import RepairResource, MaintenanceResource
import pandas as pd
from io import BytesIO
from .utils import queryset_to_workbook
import random
import numpy as np
from scipy.fft import fft, fftfreq
@login_required
def homePage(request):
  stations = Station.objects.all()
  return render(request, 'dashboard.html', context={'stations': stations,
                                                      })


# @login_required
# def getReport(request):
#   if request.method == "GET":
#     pump = request.GET.get('pump')
#     print(pump)
#     start = request.GET.get('start')
#     end = request.GET.get('end')
#     if (start == ""):
#       startDate = datetime.now() - timedelta(days=1)
#     else:
#       startDate = datetime.strptime(start, '%Y-%m-%d')
#     if (end == ""):
#       endDate = datetime.now()
#     else:
#       endDate = datetime.strptime(end, '%Y-%m-%d')
#     temp = datetime.now()
#     if (endDate < startDate):
#       temp = endDate 
#       endDate = startDate
#       startDate = temp
#     startDate = datetime.timestamp(startDate)
#     endDate = datetime.timestamp(endDate)
#     print(startDate*1000)
#     print(endDate*1000)
#     queryset = Value.objects.filter(sensor__in = Sensor.objects.filter(pump=Pump.objects.get(pk=pump)), t__lte=endDate*1000, t__gte=startDate*1000)
#     columns = (
#         'sensor',
#         'v',
#         'q',
#         't',
#         )
#     workbook = queryset_to_workbook(queryset, columns)
#     response = HttpResponse(
#             content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
#       )
#     response['Content-Disposition'] = 'attachment; filename="report.xlsx"'
#     return response


    



@login_required
def motorView(request, pk):
  pump = Pump.objects.get(pk=pk)
  sensors = Sensor.objects.filter(pump = pump)
  values = {}
  fft = {}
  for sensor in sensors: 
    temp = []
    fft_y = []
    for value in list([Value.objects.filter(sensor = sensor).order_by('-id').values_list('v', flat=True)[:100][::-1], Value.objects.filter(sensor = sensor).order_by('-id').values_list('t', flat=True)[:100][::-1]]):
      temp.append(value[:10])  
      fft_y.append(value)  
       
    time = []
    for ts in temp[1]:
        time.append(str(datetime.fromtimestamp(int(ts/1000)).time()))
    values[sensor.pk] = [temp[0], time]
    fft_x = []
    for i in range(1,100):
      fft_x.append(i)
    if sensor.code.split("-")[0] == "VT":
      fft[sensor.code] = [get_fft(fft_y[0]).tolist(), fft_x]
  prediction = Prediction.objects.filter(pump=pump).last()
  rand = {}
  print(fft)
  for i in range(4):
    rand[i] = random.randrange(90, 100)
  return render(request, 'motorview.html', context={'pump': pump,
                                                    'values': json.dumps(values),
                                                    'prediction': json.dumps(prediction.prediction),
                                                    'status': json.dumps(prediction.status),
                                                    'rand':rand,
                                                    'fft': fft,
                                                      })



def get_fft(raw_values):
    normalized_data = raw_values
    yf = fft(normalized_data)
    num = np.size(raw_values)
    freq = [i / num for i in list(range(num))]
    spectrum=yf.real*yf.real+yf.imag*yf.imag
    nspectrum=spectrum/spectrum[0]
    return(nspectrum[1:])


@login_required
def techWorkPage(request):
  if request.method == "POST":
    maintenance_form = MaintenanceForm(request.POST)
    print(maintenance_form['maintenanceDateStart'].value())
    print(maintenance_form['maintenanceDateEnd'].value())
    oil_formset = formset_factory(form=MaintenanceOilForm)(request.POST, prefix='oil')
    sealant_formset = formset_factory(form=MaintenanceSealantForm)(request.POST, prefix='sealant')
    if maintenance_form.is_valid() and oil_formset.is_valid() and sealant_formset.is_valid():
      maintenance = maintenance_form.save(commit=False)
      print(maintenance.pump.station.name)
      print(maintenance.station.name)
      if maintenance.pump.station == maintenance.station:
        maintenance.save()
        for form in oil_formset:
          work = form.save(commit=False)
          work.maintenance = maintenance
          work.workPerformed = 'oil'
          work.maintenance.pump.oil_counter +=1
          work.maintenance.pump.save()
          work.save()   
        for form in sealant_formset:
          work = form.save(commit=False)
          work.maintenance = maintenance
          work.workPerformed = 'sealant'
          work.maintenance.pump.sealant_counter +=1
          work.maintenance.pump.save()
          work.save()   
      else:
        oil_formset = formset_factory(form=MaintenanceOilForm, extra=0, max_num=1)(prefix='oil')
        sealant_formset = formset_factory(form=MaintenanceSealantForm, extra=0, max_num=1)(prefix='sealant')
        return render(request, 'techwork.html', context = {
                                                  'maintenance_form': maintenance_form,
                                                  'oil_formset': oil_formset,
                                                  'sealant_formset': sealant_formset,
                                                  'message': "Насос и станция не совпадают"
        })
    else:
      print(maintenance_form.errors)
    messages.success(request, "Запрос сохранен!")
  maintenance_form = MaintenanceForm()
  oil_formset = formset_factory(form=MaintenanceOilForm, extra=0, max_num=1)(prefix='oil')
  sealant_formset = formset_factory(form=MaintenanceSealantForm, extra=0, max_num=1)(prefix='sealant')
  return render(request, 'techwork.html', context = {
                                                  'maintenance_form': maintenance_form,
                                                  'oil_formset': oil_formset,
                                                  'sealant_formset': sealant_formset,
  })

@login_required
def repairPage(request):
  if request.method == "POST":
    repair_form = RepairForm(request.POST)  
    bearing_formset = formset_factory(form=RepairWorkBearingForm)(request.POST, prefix='bearing')
    wheel_formset = formset_factory(form=RepairWorkWheelForm)(request.POST, prefix='wheel')
    shaft_formset = formset_factory(form=RepairWorkShaftForm)(request.POST, prefix='shaft')
    rotor_formset = formset_factory(form=RepairWorkRotorForm)(request.POST, prefix='rotor')
    if bearing_formset.is_valid() and repair_form.is_valid() and wheel_formset.is_valid() and shaft_formset.is_valid() and rotor_formset.is_valid():
      repair = repair_form.save(commit=False)
      if repair.pump.station == repair.station:
        repair.save()
        for form in bearing_formset:
          work = form.save(commit=False)
          work.repair = repair
          work.workPerformed = 'bearing'
          work.repair.pump.bearing_counter +=1
          work.repair.pump.save()
          work.save()   
        for form in wheel_formset:
          work = form.save(commit=False)
          work.repair = repair
          work.workPerformed = 'wheel'
          work.repair.pump.wheel_counter +=1
          work.repair.pump.save()
          work.save()   
        for form in shaft_formset:
          work = form.save(commit=False)
          work.repair = repair
          work.workPerformed = 'shaft'
          work.repair.pump.shaft_counter +=1
          work.repair.pump.save()
          work.save()   
        for form in rotor_formset:
          work = form.save(commit=False)
          work.repair = repair
          work.workPerformed = 'rotor'
          work.repair.pump.rotor_counter +=1
          work.repair.pump.save()
          work.save()  
      else:
        bearing_formset = formset_factory(form=RepairWorkBearingForm, extra=0, max_num=100)(prefix='bearing')
        wheel_formset = formset_factory(form=RepairWorkWheelForm, extra=0, max_num=1)(prefix='wheel')
        shaft_formset = formset_factory(form=RepairWorkShaftForm, extra=0, max_num=1)(prefix='shaft')
        rotor_formset = formset_factory(form=RepairWorkRotorForm, extra=0, max_num=1)(prefix='rotor')
        return render(request, 'repair.html', context = {
                                                  'repair_form': repair_form,
                                                  'bearing_formset': bearing_formset,
                                                  'wheel_formset': wheel_formset,
                                                  'shaft_formset': shaft_formset,
                                                  'rotor_formset': rotor_formset,
                                                  'message':"Насос и станция не совпадают"
        })
    else:
      print("ERROR")
    messages.success(request, "Запрос сохранен!")
  repair_form = RepairForm()
  bearing_formset = formset_factory(form=RepairWorkBearingForm, extra=0, max_num=100)(prefix='bearing')
  wheel_formset = formset_factory(form=RepairWorkWheelForm, extra=0, max_num=1)(prefix='wheel')
  shaft_formset = formset_factory(form=RepairWorkShaftForm, extra=0, max_num=1)(prefix='shaft')
  rotor_formset = formset_factory(form=RepairWorkRotorForm, extra=0, max_num=1)(prefix='rotor')
  return render(request, 'repair.html', context = {
                                                  'repair_form': repair_form,
                                                  'bearing_formset': bearing_formset,
                                                  'wheel_formset': wheel_formset,
                                                  'shaft_formset': shaft_formset,
                                                  'rotor_formset': rotor_formset
  })


@login_required
def workHistoryPage(request):
  maintenance_list = Maintenance.objects.all()
  maintenance_filter = MaintenanceFilter(request.GET, queryset=maintenance_list)
  maintenance_list = maintenance_filter.qs
  pump_list = Pump.objects.filter(id__in=maintenance_list.values_list('pump_id', flat=True))
  paginator = Paginator(maintenance_list, 15)
  page_number = request.GET.get('page')
  page_obj = paginator.get_page(page_number)
  return render(request, 'techworkhistory.html', context = {
                                                            'maintenance_filter': maintenance_filter,
                                                            'pump_list':pump_list,
                                                            'page_obj': page_obj})

  
@login_required
def repairHistoryPage(request):
  repair_list = Repair.objects.all()
  repair_filter = RepairFilter(request.GET, queryset=repair_list)
  repair_list = repair_filter.qs
  pump_list = Pump.objects.filter(id__in=repair_list.values_list('pump_id', flat=True))
  paginator = Paginator(repair_list, 15)
  page_number = request.GET.get('page')
  page_obj = paginator.get_page(page_number)
  return render(request, 'repairhistory.html', context = {
                                                            'repair_filter': repair_filter,
                                                            'pump_list':pump_list,
                                                            'page_obj': page_obj})

def repiarExport(request):
    person_resource = RepairResource()
    dataset = person_resource.export()
    response = HttpResponse(dataset.xls, content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename="repairhistory.xls"'
    return response

def maintenanceExport(request):
    person_resource = MaintenanceResource()
    dataset = person_resource.export()
    response = HttpResponse(dataset.xls, content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename="maintenancehistory.xls"'
    return response




