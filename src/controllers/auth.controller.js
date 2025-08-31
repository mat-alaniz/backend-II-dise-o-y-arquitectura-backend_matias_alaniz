import authService from '../services/auth.service.js';

//SOLICITAR RECUPERACIÓN DE CONTRASEÑA
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email es requerido'
      });
    }

    // 1. Generar token de recuperación
    const resetToken = await authService.generateResetToken(email);
    
    // 2. Enviar email con el token
    await authService.sendResetEmail(email, resetToken);

    res.status(200).json({
      status: 'success',
      message: 'Email de recuperación enviado correctamente'
    });

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// RESTABLECER CONTRASEÑA
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // 1. Validar token y restablecer contraseña
    await authService.resetPassword(token, newPassword);

    res.status(200).json({
      status: 'success',
      message: 'Contraseña restablecida correctamente'
    });

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// VALIDAR TOKEN (para el frontend)
export const validateToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Validar si el token es válido y no ha expirado
    await authService.validateResetToken(token);

    res.status(200).json({
      status: 'success',
      message: 'Token válido'
    });

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};