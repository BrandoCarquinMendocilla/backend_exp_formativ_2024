const { HttpStatusCode } = require('axios');
const resp = require('../functions/response');
const { signAccessToken } = require('../helpers/jwt');
const UserRepository = require('../repository/pg/user.repository');
const RoleRepository = require('../repository/pg/role.repository');
const PrestatarioRepository = require('../repository/pg/prestatario.repository');
const { formatterError, formatterSucess } = require('../helpers/formatter');
const Constans = require('../constants');
const axios = require('axios');
const TokenRepository = require('../repository/mongoose/token.repository');


exports.createUserPrestatario = async (req, res) => {
    try {

        const { name,
            apellido,
            direccion,
            typeRol = 3,
            telefono,
            correo,
            password,
            createdUser,
            recomendacion,
            documento,
            tipoDocumento } = req.body;

        const user = req.session.user;
        console.log('user',user)

        const sedeId = user.sede_id;
        const getRole = await RoleRepository.getRoleByTypeRole(user.role_id);
        console.log('getRole',getRole)
        if (!getRole.asignados.includes(3)) {
            const dataError = formatterError(Constans.VALIDATION.CREATE_USER_PERMISSIONS, Constans.TYPE_OPERATION, 'createUser');
            return resp.error(res, dataError, HttpStatusCode.Forbidden);
        }

        const getUser = await UserRepository.getUser(correo);
        if (getUser) {
            const dataError = formatterError(Constans.VALIDATION.USER_EXISTS, Constans.TYPE_OPERATION, 'createUser');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const saveUser = await UserRepository.saveUser(correo, typeRol, password, createdUser, sedeId);
        if (!saveUser) {
            const dataError = formatterError(Constans.ERROR.SAVE_USER, Constans.TYPE_OPERATION, 'createUser');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const saveJefePrestamista = await PrestatarioRepository.add(saveUser.id, name,
            apellido,
            direccion,
            telefono,
            documento,
            tipoDocumento, recomendacion)


        delete saveUser.password;

        const response = formatterSucess(Constans.SUCCESS.SAVE_USER(saveUser.correo));
        response.user = saveJefePrestamista;

        return resp.success(res, response, 201);

    } catch (error) {
        console.log(error);
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'createUser');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};


exports.updateUserPrestatario= async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            apellido,
            direccion,
            telefono,
            documento,
            tipoDocumento,
            recomendacion,
        } = req.body;

        const user = req.session.user;
        const getRole = await RoleRepository.getRoleByTypeRole(user.role_id);
        if (!getRole.asignados.includes(3)) {
            const dataError = formatterError(Constans.VALIDATION.CREATE_USER_PERMISSIONS, Constans.TYPE_OPERATION, 'createUser');
            return resp.error(res, dataError, HttpStatusCode.Forbidden);
        }

        const saveJefePrestamista = await PrestatarioRepository.update(
            name,
            apellido,
            direccion,
            telefono,
            documento,
            tipoDocumento,
            recomendacion,
            id
        )
        console.log(saveJefePrestamista)

        const response = formatterSucess(Constans.SUCCESS.LIST_USER);
        response.user = saveJefePrestamista;

        return resp.success(res, response, 200);

    } catch (error) {
        console.log(error);
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'createUser');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};

exports.getPrestatarioByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const getPrestamista = await PrestatarioRepository.getByUserId(id);
        const response = formatterSucess(Constans.SUCCESS.LIST_USER);
        response.user = getPrestamista ?? [];

        return resp.success(res, response, 200);

    } catch (error) {
        console.log(error);
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'createUser');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};