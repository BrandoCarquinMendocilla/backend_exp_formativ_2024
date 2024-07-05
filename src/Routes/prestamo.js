const UserRepository = require('../repository/pg/user.repository');
const PrestamistaLibreRepository = require('../repository/mongoose/prestamista.repository');
const PrestamoRepository = require('../repository/pg/prestamo.respository');
const PlazosRepository = require('../repository/pg/plazos.repository');
const RoleRepository = require('../repository/pg/role.repository');
const PrestamistaRepository = require('../repository/pg/prestamista.repository');
const CuotasRepository = require('../repository/pg/cuotas.repository');
const PrestatarioRepository = require('../repository/pg/prestatario.repository');
const resp = require('../functions/response');
const { formatterError, formatterSucess } = require('../helpers/formatter');
const { HttpStatusCode } = require('axios');
const Constans = require('../constants');
const { obtenerFechas } = require('../helpers/util');



exports.savePrestamo = async (req, res) => {
    try {
        console.log("state:", req.session)
        const user = req.session.user;
        const { pagoPorDia, monto, cuotas, fechaInicio, fechaFin, montoPrestamo, duracion } = req.body;

        if (user.role_id !== 3) {
            const dataError = formatterError(Constans.VALIDATION.CREATE_USER_PERMISSIONS, Constans.TYPE_OPERATION, 'savePrestamo');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const getUser = await UserRepository.getUserByStatus(user.correo);
        if (!getUser) {
            const dataError = formatterError(Constans.ERROR.GET_USER_BY_STATUS_ACTIVE, Constans.TYPE_OPERATION, 'savePrestamo');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const prestatario = await PrestatarioRepository.getPrestatarioById(user.id);
        console.log(prestatario)
        const prestamo = await PrestamoRepository.savePrestamo(
            monto,
            'PENDIENTE',
            prestatario.id,
            fechaInicio,
            user.sede_id,
            cuotas,
            fechaFin,
            pagoPorDia,
            montoPrestamo,
            duracion
        )

        if (!prestamo) {
            const dataError = formatterError(Constans.ERROR.SAVE_PRESTAMO, Constans.TYPE_OPERATION, 'savePrestamo');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const response = formatterSucess(Constans.SUCCESS.SAVE_PRESTAMO(prestamo.nro_prestamo));
        return resp.success(res, response, 200);
    } catch (error) {
        console.log("Error: ", error)
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'savePrestamo');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
}


exports.changeStatusPrestamo = async (req, res) => {
    try {
        const user = req.session.user;
        const { nroPrestamo } = req.params
        const { estado, prestatarioId } = req.body;

        const getPrestamista = await UserRepository.getUserByStatus(user.correo);
        const prestamista = await PrestamistaRepository.getPrestamistaById(getPrestamista.id);

        const getPrestamo = await PrestamoRepository.getPrestamoByNroPrestamo(nroPrestamo);

        if (getPrestamo.estado === 'RECHAZADO') {
            const dataError = formatterError(Constans.ERROR.REFOUND_PRESTAMO, Constans.TYPE_OPERATION, 'changeStatusPrestamo');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        if (getPrestamo.estado === 'PAGADO') {
            const dataError = formatterError(Constans.ERROR.PRESTAMO_PAGADO, Constans.TYPE_OPERATION, 'changeStatusPrestamo');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        if (getPrestamo.estado === 'APROBADO' && estado === 'RECHAZADO') {
            const dataError = formatterError(Constans.ERROR.REFOUND_PRESTAMO_APROBADO, Constans.TYPE_OPERATION, 'changeStatusPrestamo');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const prestamo = await PrestamoRepository.changeStatusPrestamo(
            estado,
            prestamista.id,
            prestatarioId,
            getPrestamo.id,
            nroPrestamo,
            user.sede_id,
            estado === 'APROBADO'
        )

        if (estado === 'APROBADO') {
            const fechaInicio = getPrestamo.fecha_inicio;
            const fechaFin = getPrestamo.fecha_fin;
            const monto = getPrestamo.pago_dia;

            const calculateDates = obtenerFechas(fechaInicio, fechaFin, getPrestamo.cuotas);
            const fechasPago = [];
            for (const [index, value] of calculateDates.entries()) {
                const cuotas = await CuotasRepository.saveCuotas(getPrestamo.id, monto, value, index + 1);
                console.log("cuotas: ", cuotas);
                fechasPago.push({ fechaPago: cuotas.fecha_pago });
            }

            const response = formatterSucess(Constans.SUCCESS.SAVE_CHANGE_STATUS_PRESTAMO(prestamo.nro_prestamo, estado));
            response.fechaPago = fechasPago;
            return resp.success(res, response, 200);
        }

        const response = formatterSucess(Constans.SUCCESS.SAVE_CHANGE_STATUS_PRESTAMO(prestamo.nro_prestamo, estado));
        return resp.success(res, response, 200);
    } catch (error) {
        console.log("Error: ", error)
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'savePrestamo');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
}


exports.getPrestamoPrestatario = async (req, res) => {
    try {
        console.log("state:", req.session)
        const user = req.session.user;

        if (user.role_id !== 3) {
            const dataError = formatterError(Constans.VALIDATION.CREATE_USER_PERMISSIONS, Constans.TYPE_OPERATION, 'getPrestamoPrestamista');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const getUser = await UserRepository.getUserByStatus(user.correo);
        if (!getUser) {
            const dataError = formatterError(Constans.ERROR.GET_USER_BY_STATUS_ACTIVE, Constans.TYPE_OPERATION, 'getPrestamoPrestamista');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const prestatario = await PrestatarioRepository.getPrestatarioById(user.id);

        const prestamo = await PrestamoRepository.getPrestamoByPrestatario(prestatario.id)

        if (!prestamo) {
            const dataError = formatterError(Constans.ERROR.SAVE_PRESTAMO, Constans.TYPE_OPERATION, 'getPrestamoPrestamista');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const response = formatterSucess(Constans.SUCCESS.LIST_USER);
        response.prestamo = prestamo
        return resp.success(res, response, 200);
    } catch (error) {
        console.log("Error: ", error)
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'getPrestamoPrestamista');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
}


exports.listPrestamos = async (req, res) => {
    try {
        console.log("state:", req.session)
        const user = req.session.user;
        const {fechaInicio, fechaFin, nombreCompleto} = req.query;
        console.log(req.query)

        if (user.role_id !== 2) {
            const dataError = formatterError(Constans.VALIDATION.CREATE_USER_PERMISSIONS, Constans.TYPE_OPERATION, 'listPrestamos');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }
        console.log("Paso por aqui")

        const prestamo = await PrestamoRepository.getPrestamoBySede(user.sede_id, fechaInicio, fechaFin, nombreCompleto)
        console.log("Cargo prestamo", prestamo)

        if (!prestamo) {
            const dataError = formatterError(Constans.ERROR.SAVE_PRESTAMO, Constans.TYPE_OPERATION, 'listPrestamos');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const response = formatterSucess(Constans.SUCCESS.LIST_USER);
        response.prestamo = prestamo
        return resp.success(res, response, 200);
    } catch (error) {
        console.log("Error: ", error)
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'listPrestamos');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
}


exports.listCuotas = async (req, res) => {
    try {
        console.log("state:", req.session)
        const {prestamoId} = req.query;
        console.log(req.query)

        const prestamo = await CuotasRepository.listCuotas(Number(prestamoId))
        console.log("Cargo prestamo", prestamo)

        if (!prestamo) {
            const dataError = formatterError(Constans.ERROR.SAVE_PRESTAMO, Constans.TYPE_OPERATION, 'listPrestamos');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const response = formatterSucess(Constans.SUCCESS.LIST_USER);
        response.cuotas = prestamo
        return resp.success(res, response, 200);
    } catch (error) {
        console.log("Error: ", error)
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'listPrestamos');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
}