const { sendEmail } = require('../helpers/mailer');
const { generateOtp } = require('../helpers/otp');
const OtpRepository = require('../repository/mongoose/otp.repository');
const { MESSAGE_EMAIL } = require('../constants');
const Constans = require('../constants');
const { HttpStatusCode } = require('axios');
const resp = require('../functions/response');
const { formatterError, formatterSucess } = require('../helpers/formatter');
const CombosRepository = require('../repository/pg/combos.repository');


exports.getCombos = async (req, res) => {
    try {

        const [sedes, tipoDocumento] = await Promise.all([
            CombosRepository.getSedes(),
            CombosRepository.getTipoDocumento()
        ]);

        const response = formatterSucess(Constans.SUCCESS.OTP_VALID);
        response.combos = {
            sedes,
            tipoDocumento
        }
        return resp.success(res, response, 200);

    } catch (error) {
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'validOtp');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }

};