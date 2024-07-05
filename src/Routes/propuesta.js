const { HttpStatusCode } = require('axios');
const Constans = require('../constants');
const resp = require('../functions/response');
const { formatterError, formatterSucess } = require('../helpers/formatter');
const PropuestaRepository = require('../repository/mongoose/propuesta.repository');


module.exports = {
    async getPropuesta(req, res) {
        console.log("Entro")
        try {
            const propuesta = await PropuestaRepository.getPropuesta();
            const duraciones = propuesta.duracion;
            const montos = propuesta.montos;
            const tabla = {};
            for (const duracion of duraciones) {
                tabla[`${duracion}`] = calcularValores(duracion, montos, propuesta.tasa);
            }

            const response = formatterSucess(Constans.SUCCESS.LIST_USER);
            response.tabla = tabla;

            return resp.success(res, response, 200);
        } catch (error) {
            console.log(error);
            const dataError = formatterError(Constans.ERROR.INTERNAL, Constans.TYPE_OPERATION, 'createUser');
            return resp.error(res, dataError, HttpStatusCode.InternalServerError);
        }
    }
}


const calcularValores = (duracion, montos, tasa) => {
    const resultados = [];
    const diasMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const porcentaje = tasa/diasMes; // La tasa ya representa el porcentaje mensual
    console.log("diasMes: ", diasMes)

    for (const monto of montos) {
        const interesSimple = porcentaje * monto *  duracion;
        console.log("Tasa diaraia: ", porcentaje)
        console.log("monto: ", monto)
        console.log('duracion', duracion)
        const nuevoMonto = monto + interesSimple;
        resultados.push(nuevoMonto.toFixed(2));
    }

    return resultados;
}