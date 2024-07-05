const { HttpStatusCode } = require('axios');
const resp = require('../functions/response');
const { signAccessToken } = require('../helpers/jwt');
const UserRepository = require('../repository/pg/user.repository');
const RoleRepository = require('../repository/pg/role.repository');
const PrestamistaRepository = require('../repository/pg/prestamista.repository');
const PrestamistaRepositoryMongo = require('../repository/mongoose/prestamista.repository');

const { formatterError, formatterSucess } = require('../helpers/formatter');
const Constans = require('../constants');
const axios = require('axios');
const TokenRepository = require('../repository/mongoose/token.repository');


exports.createUserPrestamista = async (req, res) => {
    try {

        const { name,
            apellido,
            direccion,
            typeRol = 2,
            telefono,
            correo,
            password,
            createdUser,
            documento,
            tipoDocumento } = req.body;

        const user = req.session.user;
        console.log('user',user)

        const sedeId = user.sede_id;
        const getRole = await RoleRepository.getRoleByTypeRole(user.role_id);
        console.log('getRole',getRole)
        if (!getRole.asignados.includes(2)) {
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

        const saveJefePrestamista = await PrestamistaRepository.add(saveUser.id, name,
            apellido,
            direccion,
            telefono,
            documento,
            tipoDocumento,)
        await PrestamistaRepositoryMongo.savePrestamista(correo, sedeId);
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


exports.updateUserPrestamista = async (req, res) => {
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
        if (!getRole.asignados.includes(2)) {
            const dataError = formatterError(Constans.VALIDATION.CREATE_USER_PERMISSIONS, Constans.TYPE_OPERATION, 'createUser');
            return resp.error(res, dataError, HttpStatusCode.Forbidden);
        }

        const saveJefePrestamista = await PrestamistaRepository.update(
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

        return resp.success(res, response, 200);

    } catch (error) {
        console.log(error);
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'createUser');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};

exports.getPrestamistaById = async (req, res) => {
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


exports.getPrestamistaByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const getPrestamista = await PrestamistaRepository.getByUserId(id);
        const response = formatterSucess(Constans.SUCCESS.LIST_USER);
        response.user = getPrestamista ?? [];

        return resp.success(res, response, 200);

    } catch (error) {
        console.log(error);
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'createUser');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};