const mysql = require('mysql2');
const path = require('path')
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') })

let connection;

const createConnection = () => {
  connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATATBASE
  })

  //Łączenie z bazą danych
  connection.connect((err) => {
    if (err) {
      console.error('Błąd połączenia z bazą danych: ' + err.stack);
      setTimeout(createConnection, 2000);
      return;
    }
    console.log('Połączono z bazą danych jako ID ' + connection.threadId);
  });

  //Obsługa utraty połączenia
  connection.on('error', (err) => {
    console.log("Błąd połączenia z bazą danych" + err.stack);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      createConnection();
    } else {
      throw err;
    }

  })

  // Utrzymywanie aktywnego połączenia(proste zapytanie do bazy co minute)
  setInterval(() => {
    connection.query('SELECT 1', (err) => {
      if (err) console.error('Błąd w zapytaniu podtrzymującym połączenie: ' + err.stack);
    });
  }, 60000);

};

createConnection();

module.exports = connection.promise()





