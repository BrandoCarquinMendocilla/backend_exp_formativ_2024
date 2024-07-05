module.exports = {
    obtenerFechas(fechaInicio, fechaFin, cuotas) {
        const fechas = [];
        let fecha = new Date(fechaInicio);
    
        // Verificar si la fecha es un sábado o domingo y ajustarla si es necesario
        while (fecha.getDay() === 0 || fecha.getDay() === 6) {
            fecha.setDate(fecha.getDate() + 1); // Sumar un día
        }
    
        // Iterar para generar las cuotas
        for (let i = 0; i < cuotas; i++) {
            // Verificar si la fecha supera la fecha de fin
            if (fecha > fechaFin) {
                break; // Salir del bucle si supera la fecha de fin
            }
    
            // Asegurarse de que la fecha no sea sábado ni domingo
            while (fecha.getDay() === 0 || fecha.getDay() === 6) {
                fecha.setDate(fecha.getDate() + 1); // Sumar un día
            }
    
            // Agregar la fecha al array de fechas
            fechas.push(new Date(fecha).toISOString().slice(0, 10));
    
            // Sumar un día para el próximo pago
            fecha.setDate(fecha.getDate() + 1);
        }
    
        return fechas;
    }

}