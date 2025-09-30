DELIMITER $$

CREATE PROCEDURE InicioSesion (
    IN Email VARCHAR(300),
    IN IdSede INT
)

-- EDITARR
-- Creas un create procedure en el que se ejecute la compra del servicio. 
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

