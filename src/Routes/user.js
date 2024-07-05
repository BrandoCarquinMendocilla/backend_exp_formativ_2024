const { HttpStatusCode } = require('axios');
const resp = require('../functions/response');
const { signAccessToken } = require('../helpers/jwt');
const UserRepository = require('../repository/pg/user.repository');
const RoleRepository = require('../repository/pg/role.repository');
const PrestamistaRepository = require('../repository/mongoose/prestamista.repository');
const PrestatarioRepository = require('../repository/pg/prestatario.repository');
const PagesRepository = require('../repository/mongoose/pages.repository');
const { formatterError, formatterSucess } = require('../helpers/formatter');
const Constans = require('../constants');
const axios = require('axios');
const TokenRepository = require('../repository/mongoose/token.repository');
const OtpRepository = require('../repository/mongoose/otp.repository');
const uuid = require('uuid')

exports.createUser = async (req, res) => {
    try {
        const { name,
            apellido,
            direccion,
            telefono,
            documento,
            tipoDocumento,
            correo,
            password,
            createdUser,
            recomendacion,
            sedeId, } = req.body;

        const getUser = await UserRepository.getUser(correo);
        const typeRol = 3
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
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'createUser');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};

exports.loginUser = async (req, res) => {
    try {
        let { email, password, isGmail, ...profile } = req.body;

        if (isGmail) {
            email = profile.emails[0].value
        }

        const user = await UserRepository.getUser(email);
        if (!user) {
            const dataError = formatterError(Constans.VALIDATION.USER_NOT_EXISTS, Constans.TYPE_OPERATION, 'loginUser');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        if (user.estado !== true) {
            return resp.error(res, { message: "El usuario se encuentra bloqueado" }, 401);
        }


        if (user.password !== password && !isGmail) {
            return resp.error(res, { message: "usuario/contraseña incorrecto" }, 401);
        }
        delete user.password;
        const accessToken = await signAccessToken(user);
        const token = { accessToken }



        const response = formatterSucess(Constans.SUCCESS.LOGIN);
        response.user = user;
        response.token = token;

        req.session.token = token.accessToken;
        return resp.success(res, response, 200);
    } catch (error) {
        console.log(error)
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'loginUser');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};

exports.googleLoginUser = async (req, res) => {
    try {
        let { email, nombre, apellido } = req.body;
        console.log("Crea Usuario: ", req.body)
        if (email) {
            let user = await UserRepository.getUser(email);
            if (!user) {
                //Guarda el usuario
                console.log("Guarda usuario")
                user = await UserRepository.saveUser(email, 3, uuid.v4(), 'GMAIL', 1);
                await PrestatarioRepository.add(user.id, nombre,
                    apellido,
                    '',
                    '',
                    '',
                    null, '')
            }

            delete user.password;
            const accessToken = await signAccessToken(user);
            const token = { accessToken }

            const response = formatterSucess(Constans.SUCCESS.LOGIN);
            response.user = user;
            response.token = token;

            req.session.token = token.accessToken;
            return resp.success(res, response, 200);
        }
        return resp.error(res, { errorMessage: 'Estimado socio, por favor vuelva a intentarlo en unos minutos.' }, 401);

    } catch (error) {
        console.log(error)
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'loginUser');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};


exports.logOut = async (req, res) => {
    try {
        const user = req.session.user; // Obtiene el usuario de la sesión
        await TokenRepository.deleteToken(user.correo); // Elimina el token asociado al usuario
        req.session.destroy((err) => {
            if (err) {
                console.error("Error al destruir sesión:", err);
                return res.status(500).json({ msg: "No se pudo cerrar sesión" });
            }
            res.status(200).json({ msg: "Sesión cerrada exitosamente" });
        });
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        res.status(500).json({ msg: "Ocurrió un error al cerrar sesión" });
    }
}

exports.blockUser = async (req, res) => {
    try {
        const user = req.session.user;
        const { email, userId, otp, event } = req.body;
        const getBlockUser = await UserRepository.getUser(email);

        const getRole = await RoleRepository.getRoleByTypeRole(user.role_id);
        console.log(getRole.asignados)
        console.log(user.role_id)
        console.log(getBlockUser)

        if (!getRole.asignados.includes(getBlockUser.role_id)) {
            const dataError = formatterError(Constans.VALIDATION.CREATE_USER_PERMISSIONS, Constans.TYPE_OPERATION, 'createUser');
            return resp.error(res, dataError, HttpStatusCode.Forbidden);
        }

        const blockUser = await UserRepository.blockUser(userId, email);
        if (!blockUser) {
            const dataError = formatterError(Constans.ERROR.BLOCK_USER, Constans.TYPE_OPERATION, 'blockUser');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }
        await PrestamistaRepository.savePrestamista(email, user.sedeId, "ANULADO");
        await OtpRepository.deleteOtp(email, otp, event);
        const respo = formatterSucess(Constans.SUCCESS.BLOCK_USER(blockUser.correo));
        return resp.success(res, respo, 200);
    } catch (error) {
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'blockUser');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};

exports.validateUserEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const getUser = await UserRepository.getUserByStatus(email);
        const respo = formatterSucess(Constans.SUCCESS.LIST_USER);
        respo.status = !getUser ? false : true;
        switch (getUser.role_id) {
            case 1:
                respo.event = 'CHANGE_PASSWORD_JEFE_PRESTAMISTA';
                break;
            case 3:
                respo.event = 'CHANGE_PASSWORD_PRESTATARIO';
                break;
            case 2:
                respo.event = 'CHANGE_PASSWORD_PRESTAMISTA';
                break;

            default:
                break;
        }
        return resp.success(res, respo, 200);
    } catch (error) {
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'blockUser');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};

exports.listUsers = async (req, res) => {
    try {
        const user = req.session.user;
        console.log('get User', user);
        const getRole = await RoleRepository.getRoleByTypeRole(user.role_id);
        console.log('get Role', getRole)
        const sede = (user.role_id === 5) || (user.role_id === 4) ? null : user.sede_id;

        const getUserByRoles = await UserRepository.listUsersByRoles(getRole.asignados, sede);
        const response = formatterSucess(Constans.SUCCESS.LIST_USER);

        if (!getUserByRoles) {
            response.users = getUserByRoles;
        } else {
            response.users = getUserByRoles;

        }

        return resp.success(res, response, 200);
    } catch (error) {
        console.log(error);
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'listUsers');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};

exports.validateUser = async (req, res) => {
    try {
        const { telefono, documento, correo, userId = null } = req.body;
        const getValidate = await UserRepository.validateUser(telefono, documento, correo, userId);

        const response = formatterSucess(Constans.SUCCESS.LIST_USER);
        response.validate = getValidate

        return resp.success(res, response, 200);

    } catch (error) {
        console.log(error);
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'listUsers');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
};


exports.getUser = async (req, res) => {
    try {
        const user = req.session.user;
        const pages = await PagesRepository.getPagesByRole(user.role_id)
        const response = formatterSucess(Constans.SUCCESS.LIST_USER);
        response.user = user;
        response.token = req.session.token;
        response.pages = pages;
        return resp.success(res, response, 200);
    } catch (error) {
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'listUsers');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { email, event, otp, password, userCorreo } = req.body;
        try {
            const validOtp = await axios.post(`http://localhost:3000/v1/valid/otp`, {
                email: userCorreo,
                event,
                otp
            });
            if (validOtp.status === 200) {
                const getUser = await UserRepository.getUserByStatus(email);
                if (!getUser) {
                    const dataError = formatterError(Constans.ERROR.GET_USER_BY_STATUS_ACTIVE, Constans.TYPE_OPERATION, 'changePassword');
                    return resp.error(res, dataError, HttpStatusCode.BadRequest);
                }
                const changePassword = await UserRepository.changePassword(email, password);
                if (!changePassword) {
                    const dataError = formatterError(Constans.ERROR.CHANGE_PASSWORD, Constans.TYPE_OPERATION, 'changePassword');
                    return resp.error(res, dataError, HttpStatusCode.BadRequest);
                }
            }

        } catch (error) {
            console.error("Error al crear el usuario:", error.message);
            return resp.error(res, { message: "Error interno del servidor" });

        }

        await OtpRepository.deleteOtp(userCorreo, otp, event);
        const response = formatterSucess(Constans.SUCCESS.CHANGE_PASSWORD);
        return resp.success(res, response, 200);
    } catch (error) {
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'listUsers');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }
}