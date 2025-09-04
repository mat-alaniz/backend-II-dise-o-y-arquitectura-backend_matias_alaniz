// LOS MIDDLEWARES DE AUTORIZACIÓN

//MIDDLEWARE PARA VERIFICAR ROL DE ADMIN
export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        status: "error", 
        message: "No tienes permisos para acceder a este recurso" 
      });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        status: "error", 
        message: "No tienes permisos para acceder a este recurso" 
      });
    }
    next(); // usuario es el admin puede continuar
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: "error", 
      message: "No tienes permisos para acceder a este recurso" 
    });
  }
};

//MIDDLEWARE PARA VERIFICAR QUE ES USUARIO (NO ADMIN)
export const requireUser = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        status: "error", 
        message: "No tienes permisos para acceder a este recurso" 
      });
    }
    if (req.user.role !== "user") {
      return res.status(403).json({ 
        status: "error", 
        message: "No tienes permisos para acceder a este recurso" 
      });
    }
    next(); // usuario es un usuario normal puede continuar
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: "error", 
      message: "Error interno del servidor" 
    });
  }
};

//MIDDLEWARE PARA VERIFICAR PROPIEDAD DEL CARRITO
export const requireCartOwner = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuario no autenticado'
      });
    }

    const { cid } = req.params;
     

    if (req.user.role === "admin") {
      return next();
    }

    //Verificar si el usuario tiene carrito primero
    if (!req.user.cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no tiene carrito asignado'
      });
    }

    //Verificar que el carrito pertenece al usuario
    if (req.user.cart.toString() !== cid) {
      return res.status(403).json({
        status: 'error',
        message: 'Solo puedes modificar tu propio carrito'
      });
    }

    next(); // Usuario es dueño del carrito, continuar

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error en autorización'
    });
  }
};
//MIDDLEWARE Para flexibilidad con múltiples roles
export const requireRoles = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          status: "error", 
          message: "No autorizado" 
        });
      }
      
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          status: "error", 
          message: `Se requieren los siguientes roles: ${roles.join(', ')}` 
        });
      }
      
      next();
    } catch (error) {
      console.error("Error en requireRoles:", error);
      res.status(500).json({ 
        status: "error", 
        message: "Error interno del servidor" 
      });
    }
  };
};