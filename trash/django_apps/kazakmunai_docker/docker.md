docker exec -it ddb92c0fe1c5  bash

docker cp Input.xlsx ddb92c0fe1c5:/home/jovyan/Input.xlsx 

docker run -v /home/kurmangazy/Desktop/karzhanbasmunai:/home/jovyan -p 10000:8888 jupyter/scipy-notebook:6b49f3337709

docker build -t my_notebook .

docker run -v /home/kurmangazy/Desktop/karzhanbasmunai:/home/jovyan -p 10000:8888 my_notebook

docker-compose up