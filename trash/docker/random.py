import json
import random
import datetime
import time
import os


def agregat (x):       
        print (x)
        minut = 0
        file_object = open("myfile", 'a')
        file_object.write(x+'\n')
        file_object.close()
        t = ("Temperature: ")
        p = ("Pressure: ")
        v1 = ("Vibration X")
        v2 = ("Vibration Y")
        v3 = ("Vibration motor")
        c = ("C")
        Bar = ("Bar")
        vib = ("mm/s")
        
        while  minut < 8 :
                now = datetime.datetime.now()
                vib1 = random.uniform(0,10)       
                vib1 = round (vib1,2)
                vib2 = random.uniform(0,10)       
                vib2 = round (vib2,2)
                vib3 = random.uniform(0,10)       
                vib3 = round (vib3,2)
                temp = random.uniform(20,90)
                temp = round (temp,2)
                press = random.uniform(0,16)
                press = round (press,2)
                print (now.strftime("%d-%m-%Y %H:%M  "))
                print (t,temp,c)
                print (p,press,Bar)
                print (v1,vib1,vib)
                print (v2,vib2,vib)
                print (v3,vib3,vib)
                now  = str(now.strftime("%d-%m-%Y %H:%M  "))
                temp = str (temp)
                press = str (press)
                vib1 = str (vib1)
                vib2 = str (vib2)
                vib3 = str (vib3)
                minut+=1       
                with open('myfile', 'a') as file_object:
                    file_object = open("myfile", 'a')
                    file_object.write(now +'\n')

                    file_object.write(v1)
                    file_object.write(vib1)
                    file_object.write(vib)
                    file_object.write(v2)
                    file_object.write(vib2)
                    file_object.write(vib)
                    file_object.write(v3)
                    file_object.write(vib3)
                    file_object.write(vib)
                    file_object.write(t)
                    file_object.write(temp)
                    file_object.write(c)
                    file_object.write(p)
                    file_object.write(press)
                    file_object.write( Bar )
                   
                agr = {x:now,t:temp,p:press,v1:vib1,v2:vib2,v3:vib3}
                a=json.dumps(agr,ensure_ascii=False,indent=4)
                with open("data_file.json", "a") as write_file:
                        json.dump(a, write_file)                       


agregat ("Sattelite-1,pump 151/1")
agregat ("Sattelite-1,pump 151/2")
agregat ("Sattelite-1,pump 151/3")
agregat ("Sattelite-1,pump 151/4") 
agregat ("Sattelite-1,pump 161/1")
agregat ("Sattelite-1,pump 161/2")
agregat ("Sattelite-1,pump 161/3")
agregat ("Sattelite-1,pump 161/4") 
agregat ("OPZ,pump P2-A")
agregat ("OPZ,pump P2-B")
agregat ("OPZ,pump P2-C")
agregat ("OPZ,pump P3-A")
agregat ("OPZ,pump P3-B")
agregat ("OPZ,pump P3-C")
agregat ("OPZ,pump 85-A")
agregat ("OPZ,pump 85-B")
agregat ("OPZ,pump 85-C")