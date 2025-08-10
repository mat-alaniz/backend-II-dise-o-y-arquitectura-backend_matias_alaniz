import 'dotenv/config';

import express from 'express';
import exphbs from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import sessionsRouter from './routes/sessions.router.js';
import ProductManager from './managers/ProductManager.js';
import { title } from 'process';
import connectionDB from './data/dataBase.js';
import session from 'express-session';
import chalk from 'chalk';

connectionDB();

const productManager = new ProductManager();
const app = express();

app.engine('handlebars', exphbs.engine({
  extname: '.handlebars',
  layoutsDir: path.join(path.resolve(), 'views', 'layouts'),
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(path.resolve(), 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), 'public')));
app.use(session({
  secret: 'tu_clave_secreta',
  resave: false,
  saveUninitialized: true
}));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);

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







