// ==============================================================================
// Archivo: controllers/authController.js
// Descripción: Controlador para la autenticación de usuarios y generación de JWT.
// ==============================================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

/**
 * Autentica un residente/administrador y emite un token JWT firmado.
 * 
 * @route POST /api/auth/login
 * @access Público
 */
const login = async (req, res) => {
  const { correo, password } = req.body;

  // 1. Validación de parámetros de entrada
  if (!correo || !password) {
    return res.status(400).json({
      success: false,
      error: 'Debe proporcionar correo electrónico y contraseña.'
    });
  }

  try {
    // 2. Consulta del usuario en la tabla 'Residentes' de Supabase
    const { data: residente, error } = await supabase
      .from('Residentes')
      .select('id_residente, nombre, correo, password, rol')
      .eq('correo', correo.trim().toLowerCase())
      .single();

    if (error || !residente) {
      // Mensaje genérico para evitar enumeración de usuarios
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas. Verifique su correo y contraseña.'
      });
    }

    // 3. Comparación de la contraseña en texto plano contra el hash almacenado
    const isPasswordValid = await bcrypt.compare(password, residente.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas. Verifique su correo y contraseña.'
      });
    }

    // 4. Construcción del Payload del JWT (datos de identidad y rol)
    const payload = {
      id_residente: residente.id_residente,
      nombre: residente.nombre,
      correo: residente.correo,
      rol: residente.rol
    };

    // 5. Firma y emisión del token con expiración configurada
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });

    // 6. Respuesta satisfactoria (excluyendo el hash de la contraseña)
    return res.status(200).json({
      success: true,
      message: 'Autenticación exitosa en el Sistema Valle Hermoso.',
      token,
      usuario: {
        id_residente: residente.id_residente,
        nombre: residente.nombre,
        correo: residente.correo,
        rol: residente.rol
      }
    });

  } catch (err) {
    console.error('[AUTH CONTROLLER ERROR - LOGIN]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor durante el proceso de autenticación.'
    });
  }
};

/**
 * Registra un nuevo residente con contraseña encriptada.
 * 
 * @route POST /api/auth/register
 * @access Público (o restringido a Administrador en producción)
 */
const register = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({
      success: false,
      error: 'Nombre, correo y contraseña son campos obligatorios.'
    });
  }

  try {
    // 1. Encriptación de contraseña mediante bcrypt (factor de costo = 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Inserción del nuevo residente en Supabase
    const { data, error } = await supabase
      .from('Residentes')
      .insert([
        {
          nombre: nombre.trim(),
          correo: correo.trim().toLowerCase(),
          password: hashedPassword,
          rol: rol || 'Residente'
        }
      ])
      .select('id_residente, nombre, correo, rol')
      .single();

    if (error) {
      if (error.code === '23505') { // Violación de unicidad en PostgreSQL
        return res.status(409).json({
          success: false,
          error: 'El correo electrónico ya se encuentra registrado.'
        });
      }
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: 'Residente registrado exitosamente.',
      data
    });

  } catch (err) {
    console.error('[AUTH CONTROLLER ERROR - REGISTER]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error al registrar el residente.'
    });
  }
};

module.exports = {
  login,
  register
};
