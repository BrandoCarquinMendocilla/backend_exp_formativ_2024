
const { HttpStatusCode } = require("axios");
const Query = require("../../constant/query");
const Constans = require("../../constants");
const response = require('../../functions/response');
const { formatterError } = require("../../helpers/formatter");
const pool = require('../../../common/pg');


module.exports = {
    async savePrestamo(
        monto,
        estado,
        prestatarioId,
        fechaInicio,
        sedeId,
        cuotas,
        fechaFin,
        pagoPorDia,
        montoPrestamo,
        duracion
    ) {
        try {
            const parameters = [
                monto,
                estado,
                prestatarioId,
                fechaInicio,
                sedeId,
                cuotas,
                fechaFin,
                pagoPorDia,
                montoPrestamo,
                duracion
            ];
            console.log("Parameters:", parameters);
            const { rows } = await pool.query(Query.SAVE_PRESTAMO, parameters);
            if (rows.length === 0) {
                return undefined;
            };
            return rows[0];
        } catch (error) {
            console.log(error);
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.GET_ROLE,
                Constans.TYPE_BD.POSTEGRESQL,
                'getRoleByTypeRole');
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async changeStatusPrestamo(
        estado,
        prestamistaId,
        prestatarioId,
        idPrestamo,
        nroPrestamo,
        sedeId,
        prestamoAprobado = false
    ) {
        try {
            let query = `UPDATE public.prestamo
            SET estado = $1, prestamista_id = $2 `
            const parameters = [
                estado,
                prestamistaId,
                prestatarioId,
                idPrestamo,
                nroPrestamo,
                sedeId
            ];

            if (prestamoAprobado) {
                query += `, fecha_aprobacion = NOW()  `
            }

            query += ` WHERE
            prestatario_id = $3
            AND id = $4
            AND nro_prestamo = $5 
            AND sede_id = $6 RETURNING id, nro_prestamo `;

            console.log(parameters)

            const { rows } = await pool.query(query, parameters);
            console.log(rows)

            if (rows.length === 0) {
                return undefined;
            };
            return rows[0];
        } catch (error) {
            console.log(error);
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.GET_ROLE,
                Constans.TYPE_BD.POSTEGRESQL,
                'getRoleByTypeRole');
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async getPrestamoByNroPrestamo(nroPrestamo) {
        try {
            const { rows } = await pool.query(Query.GET_PRESTAMO_BY_NRO_PRESTAMO, [nroPrestamo]);
            if (rows.length === 0) {
                return undefined;
            };
            return rows[0];
        } catch (error) {
            console.log(error);
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.GET_ROLE,
                Constans.TYPE_BD.POSTEGRESQL,
                'getRoleByTypeRole');
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async getPrestamoByPrestatario(prestatario) {
        try {
            const { rows } = await pool.query(Query.GET_PRESTAMO_BY_PRESTATARIO, [prestatario]);
            if (rows.length === 0) {
                return [];
            };
            return rows;
        } catch (error) {
            console.log(error);
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.GET_ROLE,
                Constans.TYPE_BD.POSTEGRESQL,
                'getRoleByTypeRole');
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async getPrestamoBySede(sede, fechaInicio, fechaFin, nombreCompleto) {
        try {
            let query = Query.GET_PRESTAMO_BY_SEDE(nombreCompleto);
            if(fechaInicio && fechaFin){
                query += `AND p.created_at BETWEEN '${fechaInicio}' AND '${fechaFin}' `
            }
            const { rows } = await pool.query(query, [sede]);
            if (rows.length === 0) {
                return [];
            };
            return rows;
        } catch (error) {
            console.log(error);
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.GET_ROLE,
                Constans.TYPE_BD.POSTEGRESQL,
                'getRoleByTypeRole');
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    }
}