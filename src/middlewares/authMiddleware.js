//Verifica si el usuario tiene rol admin antes de permitir acceso.

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Acceso denegado: solo para administradores' });
};