#!/bin/bash

LOGFORMAT="%(t)s %(h)s %(u)s %(r)s %(L)s %(l)s %(p)s"

exec gunicorn -b 0.0.0.0:1478 -w 5 --timeout 300 --access-logfile - --access-logformat "$LOGFORMAT" --error-logfile - server:app
