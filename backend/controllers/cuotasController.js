// ==============================================================================
// Archivo: controllers/cuotasController.js
// Descripción: Controlador para operaciones CRUD de la entidad Cuotas (MVC).
// ==============================================================================

const supabase = require('../config/db');

/**
 * Obtiene todas las cuotas registradas.
 * Permite filtrar por id_residente o estado a través de query params.
 * 
 * @route GET /api/cuotas
 * @access Público / Consulta general
 */
const getAllCuotas = async (req, res) => {
  try {
    const { id_residente, estado } = req.query;

    let query = supabase
      .from('Cuotas')
      .select(`
        id_cuota,
        id_residente,
        monto,
        estado,
        Residentes (
          nombre,
          correo
        )
      `)
      .order('id_cuota', { ascending: true });

    if (id_residente) {
      query = query.eq('id_residente', id_residente);
    }

    if (estado) {
      query = query.eq('estado', estado);
    }

    const { data: cuotas, error } = await query;

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      total: cuotas.length,
      data: cuotas
    });
  } catch (err) {
    console.error('[CUOTAS CONTROLLER - GET ALL]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error al consultar el listado de cuotas.'
    });
  }
};

/**
 * Obtiene una cuota específica mediante su ID.
 * 
 * @route GET /api/cuotas/:id
 * @access Público
 */
const getCuotaById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: cuota, error } = await supabase
      .from('Cuotas')
      .select(`
        id_cuota,
        id_residente,
        monto,
        estado,
        Residentes (
          nombre,
          correo
        )
      `)
      .eq('id_cuota', id)
      .single();

    if (error || !cuota) {
      return res.status(404).json({
        success: false,
        error: `No se encontró ninguna cuota con el identificador ${id}.`
      });
    }

    return res.status(200).json({
      success: true,
      data: cuota
    });
  } catch (err) {
    console.error('[CUOTAS CONTROLLER - GET BY ID]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error al consultar el registro de la cuota.'
    });
  }
};

/**
 * Crea una nueva cuota para un residente.
 * 
 * @route POST /api/cuotas
 * @access Protegido (Requiere Token JWT)
 */
const createCuota = async (req, res) => {
  const { id_residente, monto, estado } = req.body;

  // Validación básica
  if (!id_residente || monto === undefined || monto === null) {
    return res.status(400).json({
      success: false,
      error: 'Los campos id_residente y monto son obligatorios.'
    });
  }

  try {
    const { data: nuevaCuota, error } = await supabase
      .from('Cuotas')
      .insert([
        {
          id_residente: parseInt(id_residente, 10),
          monto: parseFloat(monto),
          estado: estado || 'Pendiente'
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: 'Cuota emitida y registrada exitosamente.',
      data: nuevaCuota,
      creadoPor: {
        usuario_id: req.user.id_residente,
        rol: req.user.rol
      }
    });
  } catch (err) {
    console.error('[CUOTAS CONTROLLER - CREATE]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error al emitir la nueva cuota.'
    });
  }
};

/**
 * Actualiza el monto o estado de una cuota existente.
 * 
 * @route PUT /api/cuotas/:id
 * @access Protegido (Requiere Token JWT)
 */
const updateCuota = async (req, res) => {
  const { id } = req.params;
  const { monto, estado } = req.body;

  if (monto === undefined && !estado) {
    return res.status(400).json({
      success: false,
      error: 'Debe enviar al menos un campo para actualizar (monto o estado).'
    });
  }

  try {
    const updateData = {};
    if (monto !== undefined) updateData.monto = parseFloat(monto);
    if (estado) updateData.estado = estado;

    const { data: cuotaActualizada, error } = await supabase
      .from('Cuotas')
      .update(updateData)
      .eq('id_cuota', id)
      .select()
      .single();

    if (error || !cuotaActualizada) {
      return res.status(404).json({
        success: false,
        error: `No se encontró la cuota con ID ${id} para actualizar.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cuota actualizada correctamente.',
      data: cuotaActualizada
    });
  } catch (err) {
    console.error('[CUOTAS CONTROLLER - UPDATE]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error al actualizar los datos de la cuota.'
    });
  }
};

/**
 * Elimina una cuota del sistema.
 * 
 * @route DELETE /api/cuotas/:id
 * @access Protegido (Requiere Token JWT)
 */
const deleteCuota = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('Cuotas')
      .delete()
      .eq('id_cuota', id)
      .select();

    if (error || !data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No se encontró la cuota con ID ${id} o ya ha sido eliminada.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Cuota con ID ${id} eliminada satisfactoriamente.`
    });
  } catch (err) {
    console.error('[CUOTAS CONTROLLER - DELETE]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error al intentar eliminar la cuota.'
    });
  }
};

module.exports = {
  getAllCuotas,
  getCuotaById,
  createCuota,
  updateCuota,
  deleteCuota
};
