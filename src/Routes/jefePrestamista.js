const { HttpStatusCode } = require('axios');
const resp = require('../functions/response');
const { signAccessToken } = require('../helpers/jwt');
const UserRepository = require('../repository/pg/user.repository');
const RoleRepository = require('../repository/pg/role.repository');
const PrestamistaRepository = require('../repository/mongoose/prestamista.repository');
const JefePrestamistaRepository = require('../repository/pg/jefe-prestamista.repository');
const { formatterError, formatterSucess } = require('../helpers/formatter');
const Constans = require('../constants');
const axios = require('axios');
const TokenRepository = require('../repository/mongoose/token.repository');


exports.createUserJefePrestamista = async (req, res) => {
    try {
        const { name,
            apellido,
            direccion,
            typeRol = 1,
            telefono,
            correo,
            sedeId,
            password,
            createdUser,
            documento,
            tipoDocumento } = req.body;

        const user = req.session.user;
        const getRole = await RoleRepository.getRoleByTypeRole(user.role_id);
        if (!getRole.asignados.includes(1)) {
            const dataError = formatterError(Constans.VALIDATION.CREATE_USER_PERMISSIONS, Constans.TYPE_OPERATION, 'createUser');
            return resp.error(res, dataError, HttpStatusCode.Forbidden);
        }

        const getUser = await UserRepository.getUser(correo);
        if (getUser) {
            const dataError = formatterError(Constans.VALIDATION.USER_EXISTS, Constans.TYPE_OPERATION, 'createUser');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const saveUser = await UserRepository.saveUser(correo, typeRol, password, createdUser, sedeId);
        console.log("saveUser", saveUser)
        if (!saveUser) {
            const dataError = formatterError(Constans.ERROR.SAVE_USER, Constans.TYPE_OPERATION, 'createUser');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const saveJefePrestamista = await JefePrestamistaRepository.add(saveUser.id, name,
            apellido,
            direccion,
            telefono,
            documento,
            tipoDocumento,)


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


exports.updateUserJefePrestamista = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            apellido,
            direccion,
            telefono,
            documento,
            tipoDocumento
        } = req.body;

        const user = req.session.user;
        const getRole = await RoleRepository.getRoleByTypeRole(user.role_id);
        if (!getRole.asignados.includes(1)) {
            const dataError = formatterError(Constans.VALIDATION.CREATE_USER_PERMISSIONS, Constans.TYPE_OPERATION, 'createUser');
            return resp.error(res, dataError, HttpStatusCode.Forbidden);
        }

        const saveJefePrestamista = await JefePrestamistaRepository.update(
            name,
            apellido,
            direccion,
            telefono,
            documento,
            tipoDocumento,
            id
        )
        console.log(saveJefePrestamista)

        const response = formatterSucess(Constans.SUCCESS.LIST_USER);
        response.user = saveJefePrestamista;

        return resp.success(res, response, 201);

    } catch (error) {
        console.log(error);
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'createUser');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};

exports.getJefePrestamistaById = async (req, res) => {
    try {
        const { id } = req.params;
        const saveJefePrestamista = await JefePrestamistaRepository.getById(id);
        const response = formatterSucess(Constans.SUCCESS.LIST_USER);
        response.user = saveJefePrestamista ?? [];

        return resp.success(res, response, 201);

    } catch (error) {
        console.log(error);
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'createUser');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};