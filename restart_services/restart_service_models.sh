#!/bin/bash

# Navigate to the directory containing the docker-compose.yml file
#cd /path/to/your/docker-compose-directory || exit


# Pull the latest images (optional, if you want to update)
# docker-compose pull

# Restart all services
#docker-compose down
#docker-compose up -d

#docker compose -f /home/administrator/Desktop/migr_folder/ligeia.ai/docker-compose/db/docker-compose.yml up -d
#docker compose -f /home/administrator/Desktop/migr_folder/ligeia.ai/docker-compose/data/docker-compose.yml up -d
#docker compose -f /home/administrator/Desktop/migr_folder/ligeia.ai/docker-compose/app/docker-compose.yml up -d

#docker compose -f /home/administrator/Desktop/migr_folder/ligeia.ai/docker-compose/db/docker-compose.yml restart
#docker compose -f /home/administrator/Desktop/migr_folder/ligeia.ai/docker-compose/data/docker-compose.yml restart
#docker compose -f /home/administrator/Desktop/migr_folder/ligeia.ai/docker-compose/app/docker-compose.yml restart

#docker cp /home/administrator/Desktop/migr_folder/backup_nifi/flow.json.gz apache_nifi:/opt/nifi/nifi-current/conf/flow.json.gz
#docker cp /home/administrator/Desktop/migr_folder/backup_nifi/flow.xml.gz apache_nifi:/opt/nifi/nifi-current/conf/flow.xml.gz
#docker restart apache_nifi


#docker compose -f /home/administrator/Desktop/migr_folder/ligeia.ai/models/docker-compose.yml restart
#docker ps -a --filter "name=prediction" --format "{{.ID}}" | xargs -r docker restart
docker restart predictive_modeling
sleep 10
