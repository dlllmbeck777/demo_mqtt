import psycopg2
import os

def connect_db(db_host,db_name,db_user,db_password):
    # PostgreSQL veritabanına bağlanma işlemi
    try:
        connection = psycopg2.connect(
            dbname=db_name,
            user=db_user,
            password=db_password,
            host=db_host
        )

        # Veritabanı ile etkileşim için bir cursor oluşturun
        cursor = connection.cursor()

        return cursor,connection

    except (Exception, psycopg2.Error) as error:
        print("Hata oluştu:", error)
        return error
