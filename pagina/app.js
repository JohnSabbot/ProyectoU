const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'SoftwareProductos'
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'pagina')));


//FALTA AGREGAR BACKEND ACA PARA LAS FUNCIONES DE AGREGAAR PRODUCTOS DE LA BASE DE DATOS UWU


app.listen(port, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
