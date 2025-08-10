# Ecommerce Backend - Proyecto Completo

## Programación Backend I & II: Desarrollo Avanzado, Diseño y Arquitectura

# 📌 Contenido

1. Evolución del Proyecto

2. Tecnologías

3. Instalación

4. Endpoints

5. Vistas

# 🚀 Evolución del Proyecto

1️⃣ Primera Entrega (FileSystem - Backend I)

✔️ CRUD completo de productos

✔️ Persistencia en archivos JSON

✔️ Router básico con Express

✔️ Manejo manual de IDs

2️⃣ Segunda Entrega (MongoDB + Handlebars - Backend I)

✔️ Migración a MongoDB (Mongoose)

✔️ Modelos: Product y Cart

✔️ Sessions básicas

✔️ Vistas con Handlebars

✔️ Login básico

3️⃣ Entrega Final (Versión Profesional - Backend I)

✔️ Paginación avanzada (limit, page, sort, query)

✔️ Gestión de carritos con populate

✔️ Validaciones reforzadas

✔️ Vistas completas (products, cart)

4️⃣ Integración de WebSockets (Tiempo Real - Backend II)

✔️ Integración de Socket.IO

✔️ Vista realTimeProducts.handlebars

✔️ Actualización en vivo de la lista de productos al agregar o eliminar

✔️ Endpoint /realtimeproducts

5️⃣ CRUD de Usuarios + Autenticación & Autorización (Backend II)

✔️ Modelo User con:

  first_name, last_name, email (único), age, password (hash con bcrypt), cart, role (user por defecto y admin)

✔️ Registro de usuarios con validación de datos y email único

✔️ Login con verificación de credenciales y generación de JWT

✔️ Autorización en rutas protegidas usando Passport + JWT

✔️ Endpoint /current para obtener datos del usuario autenticado (sin exponer contraseña)

✔️ Manejo de errores y validación de token

## 🛠 Tecnologías

· Backend: Node.js, Express, Mongoose, Passport, JWT, Bcrypt, Socket.IO

· Frontend: Handlebars, Bootstrap

· Base de Datos: MongoDB Atlas

· Desarrollo: Nodemon

· Autenticación: Passport + JWT

## 💻 Instalación

# Clonar el repositorio
git clone https://github.com/mat-alaniz/backend-II-dise-o-y-arquitectura-backend_matias_alaniz.git

# Entrar en la carpeta del proyecto
cd backend-II-dise-o-y-arquitectura-backend_matias_alaniz

# Instalar dependencias
npm install

# Configurar variables de entorno (.env)
PORT=8081
MONGO_URI=""
JWT_SECRET=""

# Iniciar servidor en desarrollo
 · npm start

 ## 📡 Endpoints

# Autenticación & Usuarios (/api/sessions/)

Método	  Endpoint	      Descripción

POST	  /register	      Registro de usuario con validación y hash de contraseña
POST	  /login	      Login de usuario y generación de token JWT
GET	      /current	      Devuelve datos del usuario autenticado (requiere JWT)

# Productos

Método	    Endpoint	            Descripción

GET	      /api/products	         Lista todos los productos
POST	  /api/products	         Crea un nuevo producto
DELETE	  /api/products/:id	     Elimina un producto

# Productos en Tiempo Real

Método	Endpoint	         Descripción

GET	    /realtimeproducts	 Vista que se actualiza en vivo con Socket.IO

# Carritos
 
Método	   Endpoint	                           Descripción

GET	    /api/carts/:cid	                Obtiene los productos de un carrito
POST	/api/carts	                    Crea un nuevo carrito
POST	/api/carts/:cid/product/:pid	Agrega un producto a un carrito


## Autor

Matias Jesus Alaniz

🔗 https://www.linkedin.com/in/matias-jesus-alaniz-552099343/

💻 https://github.com/mat-alaniz


