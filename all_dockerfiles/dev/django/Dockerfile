# [Choice] Python version (use -bullseye variants on local arm64/Apple Silicon): 3, 3.10, 3.9, 3.8, 3.7, 3.6, 3-bullseye, 3.10-bullseye, 3.9-bullseye, 3.8-bullseye, 3.7-bullseye, 3.6-bullseye, 3-buster, 3.10-buster, 3.9-buster, 3.8-buster, 3.7-buster, 3.6-buster
FROM python:3.10.0-slim-buster

# RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.2/zsh-in-docker.sh)" -- \
#   -t https://github.com/denysdovhan/spaceship-prompt \
#   -a 'SPACESHIP_PROMPT_ADD_NEWLINE="false"' \
#   -a 'SPACESHIP_PROMPT_SEPARATE_LINE="false"' \
#   -p git \
#   -p ssh-agent \
#   -p https://github.com/zsh-users/zsh-autosuggestions \
#   -p https://github.com/zsh-users/zsh-completions


ENV APP_HOME=/django
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/staticfiles
WORKDIR $APP_HOME

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
  && apt-get install -y build-essential \
  && apt-get install -y libpq-dev \
  && apt-get install -y gettext \
  && apt-get -y install netcat gcc postgresql \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

COPY ./py-requirements /django/py-requirements

RUN pip --disable-pip-version-check --no-cache-dir install -r /django/py-requirements/dev.txt \
  && rm -rf /django/py-requirements

COPY ./dockerfile/dev/django/entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

COPY ./dockerfile/dev/django/start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

# COPY ./dockerfile/dev/django/celery/worker/start /start-celeryworker
# RUN sed -i 's/\r$//g' /start-celeryworker
# RUN chmod +x /start-celeryworker

# COPY ./dockerfile/dev/django/celery/flower/start /start-flower
# RUN sed -i 's/\r$//g' /start-flower
# RUN chmod +x /start-flower

# copy project
# COPY . .

ENTRYPOINT ["/entrypoint"]