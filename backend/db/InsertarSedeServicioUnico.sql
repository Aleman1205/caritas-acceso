DELIMITER $$

CREATE PROCEDURE InsertarSedeServicioUnico (
    IN p_IdSede INT,
    IN p_IdServicio INT,
    IN p_Descripcion VARCHAR(100),
    IN p_Capacidad DECIMAL(4,0),
    IN p_Precio DECIMAL(6,2),
    IN p_HoraInicio TIME,
    IN p_HoraFinal TIME
)
BEGIN
    -- Verificar que exista la sede
    IF EXISTS (SELECT 1 FROM Sede WHERE Id = p_IdSede) THEN
        -- Verificar que exista el servicio
        IF EXISTS (SELECT 1 FROM Servicio WHERE Id = p_IdServicio) THEN
            -- Verificar que no exista ya la relación
            IF NOT EXISTS (
                SELECT 1
                FROM SedeServicio
                WHERE IdSede = p_IdSede
                  AND IdServicio = p_IdServicio
            ) THEN
                INSERT INTO SedeServicio (
                    IdSede, IdServicio, Descripcion, Capacidad, Precio, HoraInicio, HoraFinal
                )
                VALUES (
                    p_IdSede, p_IdServicio, p_Descripcion, p_Capacidad, p_Precio, p_HoraInicio, p_HoraFinal
                );
            END IF;
        END IF;
    END IF;
END$$

DELIMITER ;