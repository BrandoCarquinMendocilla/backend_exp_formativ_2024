const Constans = {
    ENVENT_MAILER: {
        CHANGE_PASSWORD_JEFE_PRESTAMISTA: `Cambio de Contraseña Jefe de Prestamista`,
        CHANGE_PASSWORD_PRESTAMISTA: `Cambio de Contraseña Prestamista`,
        CHANGE_PASSWORD_PRESTATARIO: `Cambio de Contraseña Prestatario`,
        DELETE_JEFE_PRESTAMISTA: `Eliminar Jefe de Prestamista`,
        DELETE_PRESTAMISTA: `Eliminar Prestamista`,
        DELETE_PRESTATARIO: `Eliminar Prestatario`,
    },
    TYPE_BD: {
        POSTEGRESQL: 'PG',
        MONGODB: 'MONGO'
    },
    TYPE_OPERATION: 'operation',
    ENUM_ROLE: [
        PRESTAMISTA = 2,
        JEFE_PRESTAMISTA = 1,
        PRESTATARIO = 3,
        ADMIN = 4,
        INVERSIONISTA = 5
    ],
    MESSAGE_EMAIL: {
        SEND_OTP: otp => `Estimado usuario, se le envia un codigo OTP por su seguridad: ${otp}, no olvide que solo puede utilizarse una vez.`
    },
    ERROR: {
        GET_USER: `Estimado usuario, se presento un error, al realizar la consulta del usuario.`,
        GET_USER_BY_STATUS_ACTIVE: `Estimado usuario, su usuario se encuentra bloqueado o no existe.`,
        GET_ROLE: `Estimado usuario, se presento un error al consultar los roles.`,
        SAVE_USER: `Estimado usuario, se presento un error al guardar el usuario`,
        INTERNAL: `Estimado usuario, se presento un error vuelva a intentarlo en unos minutos.`,
        BLOCK_USER: `Estimado usuario, se presento un error al bloquear el usuario`,
        FILTER_ROLES: `Estimado usuario, se presento un error al consulta los usurios por rol`,
        CHANGE_PASSWORD: `Estimado usuario, se presento un error al cambiar de contraseña`,
        SAVE_PRESTAMISTA: `Estimado usuario, se presento un error al guardar el prestamista`,
        GET_PRESTAMISTA: `Estimado usuario, se presento un error al obtener un prestamista disponible`,
        SAVE_PRESTAMO: `Estimado usuario, se presento un error al solicitar su prestamo`,
        REFOUND_PRESTAMO_APROBADO: `Estimado usuario, no puede anular un prestamo que ya fue aprobado. comunicate con el encargo del area.`,
        REFOUND_PRESTAMO: `Estimado usuario, el prestamo ya se encuentra anulado.`,
        PRESTAMO_PAGADO: `Estimado usuario, el prestamo ya se encuentra pagado.`
    },
    VALIDATION: {
        USER_EXISTS: `Estimado usuario, ya existe un usuario con este correo.`,
        USER_NOT_EXISTS: `Estimado usuario, no existe un usuario con este correo.`,
        USER_BLOCKED: `Estimado usuario, el usuario se encuentra bloqueado.`,
        CREATE_USER_PERMISSIONS: `Estimado usuario, no tiene permiso para registrar este tipo de usuarios.`,
        OTP_INVALID: `Estimado usuario, el otp ingresado es incorrecto.`

    },
    SUCCESS: {
        SAVE_USER: usuario => `Estimado usuario, se creo correctamente el usuario: ${usuario}`,
        LOGIN: `Usuario autenticado correctamente.`,
        SEND_MAIL: `Estimado usuario, se envio un codigo OTP asu correo por su seguridad,`,
        BLOCK_USER: usuario => `Estimado usuario, se bloqueo correctamente el usuario: ${usuario}`,
        LIST_USER: `Lista de usuarios, obtenida correctamente.`,
        OTP_VALID: `Codigo OTP validado correctamente`,
        CHANGE_PASSWORD: `Contraseña cambiada correctamente`,
        SAVE_PRESTAMO: nro_prestamo => `Estimado usuario, se creo correctamente su solicitud de prestamo: ${nro_prestamo}`,
        SAVE_CHANGE_STATUS_PRESTAMO: (nro_prestamo, estado) => `Estimado usuario, se actualizo correctamente su prestamo: ${nro_prestamo} a ${estado}.`,
    }
};

module.exports = Constans;