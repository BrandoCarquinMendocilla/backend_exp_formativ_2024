const { sendEmail } = require('../helpers/mailer');
const { generateOtp } = require('../helpers/otp');
const OtpRepository = require('../repository/mongoose/otp.repository');
const { MESSAGE_EMAIL } = require('../constants');
const Constans = require('../constants');
const { HttpStatusCode } = require('axios');
const resp = require('../functions/response');
const { formatterError, formatterSucess } = require('../helpers/formatter');
const UserRepository = require('../repository/pg/user.repository');

exports.sendMailOtp = async (req, res) => {
    try {
        const { email, event } = req.body;
        const getUser = await UserRepository.getUserByStatus(email);
        if (!getUser) {
            const dataError = formatterError(Constans.ERROR.GET_USER_BY_STATUS_ACTIVE, Constans.TYPE_OPERATION, 'sendMailer');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        } else {
            const asunto = Constans.ENVENT_MAILER[event]
            const otp = generateOtp();
            await OtpRepository.saveOtp(event, otp, email);
            const message = MESSAGE_EMAIL.SEND_OTP(otp);
            await sendEmail(email, asunto, message);

            const response = formatterSucess(Constans.SUCCESS.SEND_MAIL);
            return resp.success(res, response, 200);
        }

    } catch (error) {
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'sendMailOtp');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }

};

exports.validOtp = async (req, res) => {
    try {
        const { email, otp, event } = req.body;
        const validOtp = await OtpRepository.getOtp(email, otp, event);

        if (!validOtp) {
            const dataError = formatterError(Constans.VALIDATION.OTP_INVALID, Constans.TYPE_OPERATION, 'validOtp');
            return resp.error(res, dataError, HttpStatusCode.BadRequest);
        }

        const response = formatterSucess(Constans.SUCCESS.OTP_VALID);
        return resp.success(res, response, 200);

    } catch (error) {
        const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'validOtp');
        return resp.error(res, dataError, HttpStatusCode.InternalServerError);
    }

};