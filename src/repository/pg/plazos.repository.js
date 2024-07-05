const { HttpStatusCode } = require("axios");
const Query = require("../../constant/query");
const Constans = require("../../constants");
const response = require('../../functions/response');
const { formatterError } = require("../../helpers/formatter");
const pool = require('../../../common/pg');

module.exports = {
    async getPlazoById(id) {
        try {
            const { rows } = await pool.query(Query.GET_PLAZOS_BY_ID(id));
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
}