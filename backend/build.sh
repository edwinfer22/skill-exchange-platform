#!/usr/bin/env bash
# exit on error
set -o errexit

pip install fastapi uvicorn SQLAlchemy psycopg2-binary
