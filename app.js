const express = require('express');
const path = require('path');
const mysql = require('mysql');
const multer = require('multer');

const app = express();
const port = 3000;


const upload = multer({dest: 'imagenes/'});


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'softwareproductos'
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});



app.use(express.urlencoded({extended: true}));

app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));






app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'pagina'))); 


app.post('/registrar_usuario', (req, res) =>{
    const {nombre_usuario, apellido_usuario, direccion, correoElectronico, contraseña, rol} = req.body;
    const sql = 'INSERT INTO usuarios (nombre_usuario, apellido_usuario, direccion, correoElectronico, contraseña, rol) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql,[nombre_usuario, apellido_usuario, direccion, correoElectronico, contraseña, rol], (err, result) =>{
        if(err){
            console.error('Error al registrar usuario', err);
        }else{
            console.log('El usuario se registro correctamente');
            res.redirect('/login.html');
        }
    });
});


app.post('/iniciar_sesion', (req, res) =>{
    const {correoElectronico, contraseña} = req.body;
    const sql = 'SELECT rol FROM usuarios WHERE correoElectronico = ? AND contraseña = ?';
    connection.query(sql,[correoElectronico, contraseña], (err, result) =>{
        if(err){
            console.error('Error al iniciar sesion', err);
        }else if(result.length > 0){
            const rol = result[0].rol;
            if(rol === 1){
                res.redirect('/Admin.html');
            }else if(rol === 2){
                res.redirect('/producto.html');
            }
        }
        else{
            res.send('Correo o contraseña incorrectos');
        }
    });



});


app.get('/categorias', (req, res) => {
    connection.query('SELECT * FROM categorias', (error, results) => {
        if (error) {
            console.error('Error al obtener categorías: ' + error.message);
            res.status(500).send('Error en el servidor al obtener categorías');
            return;
        }
        res.json(results);
    });
});

app.get('/proveedores', (req, res) => {
    connection.query('SELECT * FROM proveedores', (error, results) => {
        if (error) {
            console.error('Error al obtener proveedores: ' + error.message);
            res.status(500).send('Error en el servidor al obtener proveedores');
            return;
        }
        res.json(results);
    });
});

app.post('/guardar_producto', upload.single('imagen'), (req, res) => {
    const { nombre, precio, stock, proveedor, categoria } = req.body;

    if (!req.file) {
        return res.status(400).send('No se ha subido ninguna imagen.');
    }

    const imagen = req.file.filename;
    const sql = 'INSERT INTO productos (nombreProducto, precioUnitario, stock, imagen, IdProveedor, IdCategoria) VALUES (?, ?, ?, ?, ?, ?)';
    
    connection.query(sql, [nombre, precio, stock, imagen, proveedor, categoria], (error) => {
        if (error) {
            console.error('Error al insertar producto: ' + error.message);
            res.status(500).send('Error en el servidor al guardar el producto');
            return;
        }
        console.log('Producto insertado correctamente.');
        res.redirect('/agregarProducto.html');
    });
});


app.get('/catalogo', (req, res) => {
    const sql = 'SELECT * FROM productos';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Error al obtener productos: ' + error.message);
            res.status(500).send('Error en el servidor al obtener los productos');
            return;
        }
        res.json(results);
    });
});


app.delete('/eliminar_producto/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM productos WHERE IdProducto = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).send('Error al eliminar producto.');
        } else {
            res.send('Producto eliminado correctamente.');
        }
    });
});

app.get('/producto/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM productos WHERE IdProducto = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al obtener los datos del producto:', err);
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


app.post('/modificar_producto', upload.single('imagen'), (req, res) => {
    const { idHide, nombreProducto, precioUnitario, stock, IdProveedor, IdCategoria } = req.body;
    if (!req.file) {
        return res.status(400).send('No se ha subido ninguna imagen.');
    }
    const imagen = req.file.filename;
    const sql = 'UPDATE productos SET nombreProducto = ?, precioUnitario = ?, stock = ?, imagen = ?, IdProveedor = ?, IdCategoria = ? WHERE IdProducto = ?';
    connection.query(sql, [nombreProducto, precioUnitario, stock, imagen, IdProveedor, IdCategoria, idHide], (err, result) => {
        if (err) {
            console.error('Error al modificar el producto:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        console.log('Producto modificado correctamente.');
        res.redirect('/gestionProductos.html');
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



app.get('/proveedores', (req, res) => {
    const query = 'SELECT * FROM proveedores';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener proveedores:', error);
            res.status(500).send('Error al obtener proveedores.');
        } else {
            res.json(results);
        }
    });
});





app.post('/agregar_proveedor', (req, res) => {
    const { nombre_proveedor, correoElectronico } = req.body;
    const query = 'INSERT INTO proveedores (nombre_proveedor, correoElectronico) VALUES (?, ?)';
    connection.query(query, [nombre_proveedor, correoElectronico], (error, results) => {
        if (error) {
            console.error('Error al agregar proveedor:', error);
            res.status(500).send('Error al agregar proveedor.');
        } else {
            res.status(201).send('Proveedor agregado.');
        }
    });
});

app.delete('/eliminar_proveedor/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM proveedores WHERE IdProveedor = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar proveedor:', error);
            res.status(500).send('Error al eliminar proveedor.');
        } else {
            res.send('Proveedor eliminado.');
        }
    });
});

app.get('/proveedores/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM proveedores WHERE IdProveedor = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al obtener los datos del producto:', err);
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

app.post('/modificar_proveedor', (req, res) => {
    const { idHide, nombre_proveedor, correoElectronico } = req.body;
    const sql = 'UPDATE proveedores SET nombre_proveedor = ?, correoElectronico = ? WHERE IdProveedor = ?';

    connection.query(sql, [nombre_proveedor, correoElectronico, idHide], (err, result) => {
        if (err) {
            console.error('Error al modificar el proveedor:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        console.log('Proveedor modificado correctamente.');
        res.redirect('/gestionProveedor.html');
    });
});
app.listen(port, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
