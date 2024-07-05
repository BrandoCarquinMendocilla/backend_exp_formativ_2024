const Constans = require("../constants")

module.exports = {
    formatterError(message, type, operation) {
        return {
            message,
            type,
            operation
        }
    },

    formatterSucess(message){
        return {
            message,
            type: Constans.TYPE_OPERATION
        }
    }
}