const { HttpStatusCode } = require("axios");
const Query = require("../../constant/query");
const Constans = require("../../constants");
const response = require('../../functions/response');
const { formatterError } = require("../../helpers/formatter");
const pool = require('../../../common/pg');


module.exports = {
    async getUser(email) {
        try {
            const { rows } = await pool.query(Query.GET_USER_BY_EMAIL, [email]);
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

    async getUserByStatus(email, status = true) {
        try {
            const { rows } = await pool.query(Query.GET_USER_BY_EMAIL_AND_STATUS(status), [email]);
            if (rows.length === 0) {
                return undefined;
            };
            return rows[0];
        } catch (error) {
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.GET_USER_BY_STATUS,
                Constans.TYPE_BD.POSTEGRESQL,
                'getUserByStatus');
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async saveUser(email, typeRol, password, description, sedeId) {
        try {
            const { rows } = await pool.query(Query.CREATE_USER, [email, typeRol, password, description, sedeId]);
            if (rows.length === 0) {
                return undefined;
            };
            return rows[0];
        } catch (error) {
            console.error(error)
            const dataErrror = formatterError(Constans.ERROR.GET_USER_BY_STATUS_ACTIVE,
                Constans.TYPE_BD.POSTEGRESQL,
                'saveUser');
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async blockUser(userId, email) {
        try {
            const { rows } = await pool.query(Query.BLOCK_USER, [userId, email]);
            if (rows.length === 0) {
                return undefined;
            };
            console.log(rows);
            return rows[0];
        } catch (error) {
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.BLOCK_USER,
                Constans.TYPE_BD.POSTEGRESQL,
                'blockUser');
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async listUsersByRoles(roles, sede) {
        try {
            const filterRoles = '(' + roles.join(',') + ')';
            let query = Query.FILET_USER_BY_ROLES(filterRoles)
            if (sede) {
                query += `AND u.sede_id = ${sede}`
            }

            const { rows } = await pool.query(query);
            if (rows.length === 0) {
                return [];
            };
            return rows;
        } catch (error) {
            const dataErrror = formatterError(Constans.ERROR.FILTER_ROLES,
                Constans.TYPE_BD.POSTEGRESQL,
                'blockUser');
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async changePassword(email, password) {
        try {
            console.log(password)
            console.log(email)
            const { rows } = await pool.query(Query.CHANGE_PASSWORD, [password, email]);
            if (rows.length === 0) {
                return undefined;
            };
            return rows[0];
        } catch (error) {
            console.log("error", error);
            const dataErrror = formatterError(Constans.ERROR.CHANGE_PASSWORD,
                Constans.TYPE_BD.POSTEGRESQL,
                'blockUser');
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },

    async validateUser(telefono, documento, correo, userId) {
        try {

            let query = `SELECT 
            CASE 
                WHEN EXISTS (SELECT 1 FROM public.jefe_prestamista WHERE documento = $1 ${userId ? 'AND user_id <> $4' : ''})
                  OR EXISTS (SELECT 1 FROM public.prestamista WHERE documento = $1 ${userId ? 'AND user_id <> $4' : ''})
                  OR EXISTS (SELECT 1 FROM public.prestatario WHERE documento = $1 ${userId ? 'AND user_id <> $4' : ''})
                THEN true
                ELSE false
            END AS documento,
            CASE 
                WHEN EXISTS (SELECT 1 FROM public.jefe_prestamista WHERE telefono = $2 ${userId ? 'AND user_id <> $4' : ''})
                  OR EXISTS (SELECT 1 FROM public.prestamista WHERE telefono = $2 ${userId ? 'AND user_id <> $4' : ''})
                  OR EXISTS (SELECT 1 FROM public.prestatario WHERE telefono = $2 ${userId ? 'AND user_id <> $4' : ''})
                THEN true
                ELSE false
            END AS telefono,
            CASE 
                WHEN EXISTS (SELECT 1 FROM public.users WHERE correo = $3 ${userId ? 'AND id <> $4' : ''})
                THEN true
                ELSE false
            END AS correo`;

            let parameters = [documento, telefono, correo]

            if (userId) {
                parameters = [documento, telefono, correo, userId]

            }

            console.log(query);
            console.log(parameters);

            const { rows } = await pool.query(query, parameters);
            if (rows.length === 0) {
                return undefined;
            };
            return rows[0];
        } catch (error) {
            console.log(error);
            console.error(JSON.stringify(dataErrror), HttpStatusCode.NotFound)
            const dataErrror = formatterError(Constans.ERROR.GET_USER_BY_STATUS,
                Constans.TYPE_BD.POSTEGRESQL,
                'getUserByStatus');
            return response.error(res, dataErrror, HttpStatusCode.NotFound);
        }
    },


}