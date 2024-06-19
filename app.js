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

app.post('/guardar_producto',(req, res) => {
    const { nombreProducto, precioUnitario, stock } = req.body;
    const sql = 'INSERT INTO productos (nombreProducto, precioUnitario, stock) VALUES (?, ?, ?)';
    connection.query(sql, [nombreProducto, precioUnitario, stock], (err, result) => {
        if (err) throw err;
        console.log('Producto insertado correctamente.');
        res.redirect('/');
    });
});

app.get('/catalogo', (req, res) => {
    connection.query('SELECT * FROM productos', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});


app.delete('/eliminar_producto/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM productos WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        console.log('Producto eliminado correctamente.');
        res.sendStatus(200); 
    });
});

app.post('/modificar_producto', (req, res) => {
    const { IdProducto, nombreProducto, precioUnitario, stock, IdCategoria } = req.body;
    const sql = 'UPDATE productos SET nombreProducto = ?, precioUnitario = ?, stock = ?, IdCategoria = ? WHERE IdProducto = ?';
    connection.query(sql, [nombreProducto, precioUnitario, stock, IdCategoria, IdProducto], (err, result) => {
        if (err) {
            console.error('Error al modificar el producto:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        console.log('Producto modificado correctamente.');
        res.redirect('/pagAdmin.html');
    });
});

app.get('/catalogo/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM productos WHERE IdProducto = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al obtener los datos de los productos:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Producto no encontrado');
            return;
        }
        res.json(result[0]);
    });
});


app.listen(port, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
