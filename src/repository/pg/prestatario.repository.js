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
        tipoDocumento,
        recomendacion
    ) {
        try {
            const { rows } = await pool.query(Query.SAVE_PRESTATARIO(tipoDocumento),
                [
                    name,
                    apellido,
                    direccion,
                    telefono,
                    documento,
                    recomendacion,
                    userId]);
            if (rows.length === 0) {
                return undefined;
            };
            return rows[0];
        } catch (error) {
            console.log(error)
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.GET_USER,
                Constans.TYPE_BD.POSTEGRESQL,
                'getUser');
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async getPrestatarioById(id) {
        try {
            const { rows } = await pool.query(Query.GET_PRESTATARIO_BY_ID(id));
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
            const { rows } = await pool.query(Query.GET_PRESTATARIO,
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
        tipoDocumento,
        recomendacion,
        pId) {
        try {
            const { rows } = await pool.query(Query.UPDATE_PRESTATARIO, [
                name, apellido, direccion, telefono, documento, tipoDocumento, recomendacion, Number(pId)
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