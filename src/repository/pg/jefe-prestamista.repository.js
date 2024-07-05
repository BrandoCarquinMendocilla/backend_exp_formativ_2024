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
            const { rows } = await pool.query(Query.SAVE_JEFE_PRESTAMISTA,
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
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.GET_USER,
                Constans.TYPE_BD.POSTEGRESQL,
                'getUser');
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async getById(id) {
        try {
            const { rows } = await pool.query(Query.GET_JEFE_PRESTAMISTA,
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
        tipoDocumento, jpId) {
        try {
            console.log({name,
                apellido,
                direccion,
                telefono,
                documento,
                tipoDocumento, jpId})
            const { rows } = await pool.query(Query.UPDATE_JEFE_PRESTAMISTA, [
                name, apellido, direccion, telefono, documento, tipoDocumento, Number(jpId)
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