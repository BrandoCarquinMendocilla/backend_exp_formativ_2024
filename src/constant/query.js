const Query = {
    GET_ROLE_BY_TYPE_ROLE: typeRol => `SELECT * FROM public.rol Where id = ${typeRol}`,
    GET_USER_BY_EMAIL: `SELECT * FROM public.users WHERE correo = $1`,
    GET_USER_BY_EMAIL_AND_STATUS: status => `SELECT * FROM public.users WHERE correo = $1 AND estado = ${status}`,
    CREATE_USER: `INSERT INTO public.users VALUES (DEFAULT, $1 , $2 , DEFAULT, $3 , $4, TRUE, $5) RETURNING * ;`,
    BLOCK_USER: `UPDATE public.users
    SET estado = FALSE
    WHERE id = $1 AND correo = $2 RETURNING * ;`,
    FILET_USER_BY_ROLES: (roles) => `
    SELECT 
        u.id as "userId",
	    u.sede_id,
	    r.tipo_rol as "desRol",
        u.correo,
	    r.asignados,
        COALESCE(jp.nombre, p.nombre, po.nombre, 'No existe') AS nombre,
        COALESCE(jp.apellidos, p.apellidos, po.apellidos, 'No existe') AS apellidos,
    	COALESCE(jp.tipo_documento, p.tipo_documento, po.tipo_documento) AS tipoDocumento,
    	COALESCE(jp.documento, p.documento, po.documento, 'No existe') AS nroDocumento,
    	COALESCE(jp.direccion, p.direccion, po.direccion, 'No existe') AS direccion,
    	COALESCE(jp.telefono, p.telefono, po.telefono, 'No existe') AS telefono
    FROM 
        public.users u
    LEFT JOIN 
        public.jefe_prestamista jp ON u.role_id = 1 AND jp.user_id = u.id
    LEFT JOIN 
        public.prestamista p ON u.role_id = 2 AND p.user_id = u.id
    LEFT JOIN 
        public.prestatario po ON u.role_id = 3 AND po.user_id = u.id
    INNER JOIN 
    	public.rol r ON u.role_id = r.id
    WHERE 
        u.role_id IN ${roles}
        AND u.estado = TRUE 
    `,
    CHANGE_PASSWORD: `UPDATE public.users
    SET password = $1
    WHERE correo = $2 RETURNING * ;`,
    SAVE_PRESTAMO: `INSERT INTO public.prestamo
            (id,   importe, estado, prestatario_id,fecha_aprobacion, fecha_inicio, created_at, sede_id, cuotas, fecha_fin, pago_dia, monto_prestamo, prestamista_id, duracion )
    VALUES (DEFAULT , $1, $2, $3,  NULL , $4, DEFAULT, $5, $6, $7, $8, $9, NULL, $10 ) RETURNING nro_prestamo, id;
    `,
    GET_PLAZOS_BY_ID: id => `SELECT * FROM public.plazos Where id = ${id}`,
    GET_PRESTAMO_BY_NRO_PRESTAMO: `SELECT * FROM public.prestamo WHERE nro_prestamo = $1`,
    GET_PRESTAMO_BY_PRESTATARIO: `SELECT * FROM public.prestamo WHERE prestatario_id = $1`,
    GET_PRESTAMO_BY_SEDE: (parameter )=> `SELECT 
	p.* ,
	po.nombre,
	po.apellidos,
	COALESCE(COALESCE(NULLIF(po.nombre, '') || ' ' || NULLIF(po.apellidos, ''), NULL), 'no asignado') AS nombre_prestatario,
    COALESCE(COALESCE(NULLIF(pa.nombre, '') || ' ' || NULLIF(pa.apellidos, ''), NULL), 'no asignado') AS nombre_prestamista
    FROM public.prestamo p
    inner join public.prestatario po on p.prestatario_id = po.id
    left join public.prestamista pa on p.prestamista_id = pa.id
    where p.sede_id = $1
    and (COALESCE(CONCAT(po.nombre, ' ', po.apellidos), 'no asignado')) LIKE '%${parameter ?? ''}%' `,
    GET_PRESTATARIO_BY_ID: id => `SELECT * FROM public.prestatario WHERE user_id = ${id};`,
    GET_PRESTAMISTA_BY_ID: id => `SELECT * FROM public.prestamista WHERE user_id = ${id};`,
    LIST_CUOTAS: `SELECT * FROM public.cuotas where prestamo_id = $1`,
    SAVE_CUOTAS: `INSERT INTO public.cuotas(id, prestamo_id, monto, fecha_pago, numero_cuota, estado, morosidad)
    VALUES (DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING fecha_pago ;`,
    SAVE_JEFE_PRESTAMISTA: `
    INSERT INTO public.jefe_prestamista(
        id, nombre, apellidos, direccion, telefono, documento, estado, user_id, tipo_documento)
        VALUES (DEFAULT, $1 , $2, $3,$4, $5, TRUE ,$6 , $7) RETURNING *;
    `,
    SAVE_PRESTAMISTA: `
    INSERT INTO public.prestamista(
        id, nombre, apellidos, direccion, telefono, documento, user_id, estado, tipo_documento)
        VALUES (DEFAULT, $1 , $2, $3,$4, $5, $6, TRUE,  $7) RETURNING *;
    `,
    SAVE_PRESTATARIO: (tipoDocumento) =>  `
    INSERT INTO public.prestatario(
        id, nombre, apellidos, direccion, telefono, documento, recomendacion, user_id, estado, created_at, tipo_documento)
        VALUES (DEFAULT, $1 , $2, $3,$4, $5, $6, $7, TRUE, DEFAULT, ${tipoDocumento ?? 'NULL'}) RETURNING * ;
    `,
    GET_JEFE_PRESTAMISTA: `Select * from public.jefe_prestamista jp inner join public.users u  On jp.user_id = u.id WHERE jp.user_id = $1
    `,
    GET_PRESTAMISTA: `Select * from public.prestamista jp inner join public.users u  On jp.user_id = u.id WHERE jp.user_id = $1
    `,
    GET_PRESTATARIO: `Select * from public.prestatario jp inner join public.users u  On jp.user_id = u.id WHERE jp.user_id = $1
    `,
    UPDATE_JEFE_PRESTAMISTA: `UPDATE public.jefe_prestamista
    SET nombre = $1,
        apellidos = $2,
        direccion = $3,
        telefono = $4,
        documento = $5,
        tipo_documento = $6
    WHERE user_id = $7
    RETURNING *;
    `,
    UPDATE_PRESTAMISTA: `UPDATE public.prestamista
    SET nombre = $1,
        apellidos = $2,
        direccion = $3,
        telefono = $4,
        documento = $5,
        tipo_documento = $6
    WHERE user_id = $7
    RETURNING *;
    `,
    UPDATE_PRESTATARIO: `UPDATE public.prestatario
    SET nombre = $1,
        apellidos = $2,
        direccion = $3,
        telefono = $4,
        documento = $5,
        tipo_documento = $6,
        recomendacion = $7
    WHERE user_id = $8
    RETURNING *;
    `,
    GET_TIPO_DOCUMENTO: `SELECT * FROM public.tipo_documento;`,
    GET_SEDE: `	Select * from public.sede;`,
    VALIDATE_USER: `	Select * from public.sede;`
}

module.exports = Query