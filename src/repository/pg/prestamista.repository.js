const { HttpStatusCode } = require("axios");
const Query = require("../../constant/query");
const Constans = require("../../constants");
const response = require('../../functions/response');
const { formatterError } = require("../../helpers/formatter");
const pool = require('../../../common/pg');


module.exports = {

    async add(userId, name,
        apellido,
        direccion,
        telefono,
        documento,
        tipoDocumento) {
        try {
            const { rows } = await pool.query(Query.SAVE_PRESTAMISTA,
                [
                    name,
                    apellido,
                    direccion,
                    telefono,
                    documento,
                    userId,
                    tipoDocumento]);
            if (rows.length === 0) {
                return undefined;
            };
            return rows[0];
        } catch (error) {
            console.log(errror)
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.GET_USER,
                Constans.TYPE_BD.POSTEGRESQL,
                'getUser');
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async getPrestamistaById(id) {
        try {
            const { rows } = await pool.query(Query.GET_PRESTAMISTA_BY_ID(id));
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

    async getByUserId(id) {
        try {
            const { rows } = await pool.query(Query.GET_PRESTAMISTA,
                [id]);
            if (rows.length === 0) {
                return undefined;
            };
            return rows[0];
        } catch (error) {
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.GET_USER,
                Constans.TYPE_BD.POSTEGRESQL,
                'getUser');
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async update( name,
        apellido,
        direccion,
        telefono,
        documento,
        tipoDocumento, pId) {
        try {
            const { rows } = await pool.query(Query.UPDATE_PRESTAMISTA, [
                name, apellido, direccion, telefono, documento, tipoDocumento, Number(pId)
            ]);
                    console.log("Rows", rows)
            if (rows.length === 0) {
                return undefined;
            };
            return rows[0];
        } catch (error) {
            console.log(error);
            const dataErrror = formatterError(Constans.ERROR.GET_USER,
                Constans.TYPE_BD.POSTEGRESQL,
                'getUser');
                console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },


}