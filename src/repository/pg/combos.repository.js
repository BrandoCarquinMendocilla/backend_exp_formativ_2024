const { HttpStatusCode } = require("axios");
const Query = require("../../constant/query");
const Constans = require("../../constants");
const response = require('../../functions/response');
const { formatterError } = require("../../helpers/formatter");
const pool = require('../../../common/pg');


module.exports = {
    async getSedes() {
        try {
            const { rows } = await pool.query(Query.GET_SEDE);
            if (rows.length === 0) {
                return undefined;
            };
            return rows;
        } catch (error) {
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.GET_USER,
                Constans.TYPE_BD.POSTEGRESQL,
                'getUser');
                console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async getTipoDocumento() {
        try {
            const { rows } = await pool.query(Query.GET_TIPO_DOCUMENTO);
            if (rows.length === 0) {
                return undefined;
            };
            return rows;
        } catch (error) {
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.GET_USER,
                Constans.TYPE_BD.POSTEGRESQL,
                'getUser');
                console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },
}