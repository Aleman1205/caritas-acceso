-- Asegúrate de que exista el beneficiario
INSERT INTO beneficiario (telefono, nombre, email)
VALUES (
        '+5218181234567',
        'Juan Pérez',
        'juan@example.com'
    ) ON CONFLICT (telefono) DO NOTHING;
-- Crea una transacción
INSERT INTO transaccion (id, fecha, tipo)
VALUES ('test_transporte', NOW(), 'reserva');
-- Crea la reserva activa
INSERT INTO reserva (
        idtransaccion,
        fechainicio,
        fechasalida,
        horacheckin,
        hombres,
        mujeres,
        idsede,
        idbeneficiario
    )
SELECT 'test_transporte',
    NOW() - INTERVAL '1 hour',
    NOW() + INTERVAL '1 day',
    '08:00',
    1,
    1,
    1,
    b.id
FROM beneficiario b
WHERE b.telefono = '+5218181234567'
LIMIT 1;