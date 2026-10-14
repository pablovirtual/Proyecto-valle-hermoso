// ==============================================================================
// Archivo: controllers/pagosController.js
// Descripción: Controlador para operaciones CRUD de la entidad Pagos (MVC).
// ==============================================================================

const supabase = require('../config/db');

/**
 * Obtiene todos los pagos registrados.
 * Permite filtrar por id_cuota.
 * @route GET /api/pagos
 * @access Protegido (JWT)
 */
const getAllPagos = async (req, res) => {
  try {
    const { id_cuota } = req.query;

    let query = supabase
      .from('Pagos')
      .select(`
        id_pago,
        id_cuota,
        monto,
        fecha,
        Cuotas (
          id_residente,
          monto,
          estado
        )
      `)
      .order('fecha', { ascending: false });

    if (id_cuota) {
      query = query.eq('id_cuota', id_cuota);
    }

    const { data: pagos, error } = await query;
    if (error) throw error;

    return res.status(200).json({
      success: true,
      total: pagos.length,
      data: pagos
    });
  } catch (err) {
    console.error('[PAGOS CONTROLLER - GET ALL]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error al consultar el listado de pagos.'
    });
  }
};

/**
 * Obtiene un pago específico por su ID.
 * @route GET /api/pagos/:id
 * @access Protegido (JWT)
 */
const getPagoById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: pago, error } = await supabase
      .from('Pagos')
      .select(`
        id_pago,
        id_cuota,
        monto,
        fecha,
        Cuotas (
          id_residente,
          monto,
          estado
        )
      `)
      .eq('id_pago', id)
      .single();

    if (error || !pago) {
      return res.status(404).json({
        success: false,
        error: `No se encontró ningún pago con el identificador ${id}.`
      });
    }

    return res.status(200).json({
      success: true,
      data: pago
    });
  } catch (err) {
    console.error('[PAGOS CONTROLLER - GET BY ID]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error al consultar el registro del pago.'
    });
  }
};

/**
 * Registra un nuevo pago para una cuota.
 * Al crear el pago, actualiza automáticamente el estado de la cuota a 'Pagado'.
 * @route POST /api/pagos
 * @access Protegido (JWT)
 */
const createPago = async (req, res) => {
  const { id_cuota, monto } = req.body;

  if (!id_cuota || !monto) {
    return res.status(400).json({
      success: false,
      error: 'Los campos id_cuota y monto son obligatorios.'
    });
  }

  try {
    // 1. Verificar que la cuota existe y no está ya pagada
    const { data: cuota, error: cuotaError } = await supabase
      .from('Cuotas')
      .select('id_cuota, monto, estado')
      .eq('id_cuota', id_cuota)
      .single();

    if (cuotaError || !cuota) {
      return res.status(404).json({
        success: false,
        error: `No se encontró la cuota con ID ${id_cuota}.`
      });
    }

    if (cuota.estado === 'Pagado') {
      return res.status(409).json({
        success: false,
        error: `La cuota con ID ${id_cuota} ya se encuentra liquidada.`
      });
    }

    // 2. Registrar el pago en la tabla Pagos
    const { data: nuevoPago, error: pagoError } = await supabase
      .from('pagos')
      .insert([{
        id_cuota: parseInt(id_cuota, 10),
        monto: parseFloat(monto)
      }])
      .select()
      .single();

    if (pagoError) throw pagoError;

    // 3. Actualizar el estado de la cuota a 'Pagado'
    const { error: updateError } = await supabase
      .from('cuotas')
      .update({ estado: 'Pagado' })
      .eq('id_cuota', id_cuota);

    if (updateError) {
      console.error('[PAGOS CONTROLLER - UPDATE CUOTA]:', updateError.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Pago registrado exitosamente. Estado de cuota actualizado a Pagado.',
      data: nuevoPago,
      registradoPor: {
        usuario_id: req.user.id_residente,
        rol: req.user.rol
      }
    });
  } catch (err) {
    console.error('[PAGOS CONTROLLER - CREATE]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error al registrar el pago.'
    });
  }
};

/**
 * Elimina un pago y revierte el estado de la cuota a 'Pendiente'.
 * @route DELETE /api/pagos/:id
 * @access Protegido (JWT)
 */
const deletePago = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Obtener el pago para saber qué cuota afecta
    const { data: pago, error: fetchError } = await supabase
      .from('Pagos')
      .select('id_pago, id_cuota')
      .eq('id_pago', id)
      .single();

    if (fetchError || !pago) {
      return res.status(404).json({
        success: false,
        error: `No se encontró el pago con ID ${id}.`
      });
    }

    // 2. Eliminar el pago
    const { error: deleteError } = await supabase
      .from('pagos')
      .delete()
      .eq('id_pago', id);

    if (deleteError) throw deleteError;

    // 3. Revertir el estado de la cuota a 'Pendiente'
    await supabase
      .from('cuotas')
      .update({ estado: 'Pendiente' })
      .eq('id_cuota', pago.id_cuota);

    return res.status(200).json({
      success: true,
      message: `Pago con ID ${id} eliminado. Estado de cuota revertido a Pendiente.`
    });
  } catch (err) {
    console.error('[PAGOS CONTROLLER - DELETE]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error al intentar eliminar el pago.'
    });
  }
};

/**
 * Obtiene el resumen de pagos de un residente (historial completo).
 * @route GET /api/pagos/residente/:id_residente
 * @access Protegido (JWT)
 */
const getPagosByResidente = async (req, res) => {
  const { id_residente } = req.params;

  try {
    // Obtener todas las cuotas del residente
    const { data: cuotas, error: cuotasError } = await supabase
      .from('Cuotas')
      .select('id_cuota')
      .eq('id_residente', id_residente);

    if (cuotasError) throw cuotasError;

    if (!cuotas || cuotas.length === 0) {
      return res.status(200).json({ success: true, total: 0, data: [] });
    }

    const idsCuotas = cuotas.map(c => c.id_cuota);

    const { data: pagos, error: pagosError } = await supabase
      .from('Pagos')
      .select(`
        id_pago,
        id_cuota,
        monto,
        fecha,
        Cuotas (
          id_residente,
          monto,
          estado
        )
      `)
      .in('id_cuota', idsCuotas)
      .order('fecha', { ascending: false });

    if (pagosError) throw pagosError;

    return res.status(200).json({
      success: true,
      total: pagos.length,
      data: pagos
    });
  } catch (err) {
    console.error('[PAGOS CONTROLLER - BY RESIDENTE]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error al consultar el historial de pagos del residente.'
    });
  }
};

module.exports = {
  getAllPagos,
  getPagoById,
  createPago,
  deletePago,
  getPagosByResidente
};
