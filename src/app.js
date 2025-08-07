require('dotenv').config();

const express = require('express');
const exphbs = require('express-handlebars');
const { createServer } = require('http'); 
const { Server } = require('socket.io');  
const path = require('path');
const viewsRouter = require('./routes/views.router');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const ProductManager = require('./managers/ProductManager');
const { title } = require('process');
const productManager = new ProductManager();
const connectionDB = require('./data/dataBase');
connectionDB(); 
const session = require('express-session');

const app = express();

app.engine('handlebars', exphbs.engine({
  extname: '.handlebars',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'tu_clave_secreta',
  resave: false,
  saveUninitialized: true
}));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});


const httpServer = createServer(app);
const io = new Server(httpServer);
let productosActualizados = [];

io.on('connection', async (socket) => {
  socket.on('addProduct', async (productData) => {
    await productManager.addProduct(productData);
    const productosActualizados = await productManager.getProducts();
    io.emit('updateProducts', productosActualizados);
  });

  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id); 
    const productosActualizados = await productManager.getProducts();
    io.emit('updateProducts', productosActualizados);
  });
});

const PORT = process.env.PORT || 8081;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});







