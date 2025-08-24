import 'dotenv/config';
import express from 'express';
import handlebars from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import connectionDB from './data/dataBase.js';
import ProductManager from './managers/ProductManager.js';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import sessionsRouter from './routes/sessions.router.js';
import './config/passport.js';

// Configuración inicial
const app = express();
const productManager = new ProductManager();

connectionDB().then(() => {
  console.log('✅ MongoDB conectado correctamente');
}).catch(err => {
  console.error('❌ Error de conexión a MongoDB:', err);
});

// Configuración de Handlebars
const hbs = handlebars.create({
    helpers: {
        eq: (a, b) => a === b
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), 'public')));
app.use(cookieParser());

// Configuración de sesión - Versión definitiva para Atlas
app.use(session({
  secret: 'tu_clave_secreta',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    // No pongas sslvalidate aquí
  })
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routers
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', async (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);

  socket.on('addProduct', async (productData) => {
    try {
      await productManager.addProduct(productData);
      const productosActualizados = await productManager.getProducts();
      io.emit('updateProducts', productosActualizados);
    } catch (error) {
      socket.emit('productError', { message: error.message });
    }
  });

  socket.on('deleteProduct', async (id) => {
    try {
      await productManager.deleteProduct(id);
      const productosActualizados = await productManager.getProducts();
      io.emit('updateProducts', productosActualizados);
    } catch (error) {
      socket.emit('productError', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 8081;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;