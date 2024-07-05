const otpGenerator = require('otp-generator');

exports.generateOtp = () => {
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    return otp;
}