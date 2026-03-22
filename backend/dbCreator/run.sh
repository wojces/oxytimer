#!/bin/bash

# Wczytanie konfiguracji z pliku config
source config

# Sprawdzenie czy plik config został poprawnie wczytany
if [[ -z "$USER" || -z "$PASSWORD" || -z "$HOST" ]]; then
  echo "Plik config jest niekompletny. Upewnij się, że zawiera USER, PASSWORD i HOST."
  exit 1
fi

# Sprawdzenie czy baza danych baza danych istnieje
DB_EXISTS=$(mysql -u"$USER" -p"$PASSWORD" -h"$HOST" -e "SHOW DATABASES LIKE '$DB_NAME';" | grep "$DB_NAME")

# Jeśli baza danych istnieje, usuń ją
if [[ "$DB_EXISTS" == "$DB_NAME" ]]; then
  echo "Baza danych istnieje. Usuwanie..."
  mysql -u"$USER" -p"$PASSWORD" -h"$HOST" -e "DROP DATABASE $DB_NAME;"
fi

# Tworzenie nowej bazy danych
echo "Tworzenie nowej bazy danych.."
mysql -u"$USER" -p"$PASSWORD" -h"$HOST" -e "CREATE DATABASE $DB_NAME;"

# Importowanie danych z pliku DUMP
if [[ -f "$DUMP" ]]; then
  echo "Importowanie danych z pliku DUMP"
  mysql -u"$USER" -p"$PASSWORD" -h"$HOST" $DB_NAME < $DUMP

  echo "Importowanie zakończone."
else
  echo "Plik DUMP nie istnieje."
  exit 1
fi

echo "Skrpyt zakończony pomyślnie."

