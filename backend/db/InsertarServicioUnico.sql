DELIMITER $$

CREATE PROCEDURE InsertarServicioUnico (
    IN p_Nombre VARCHAR(40),
    IN p_Descripcion VARCHAR(100),
    IN p_Estatus BIT
)
BEGIN
    -- Verificar si ya existe un registro con los mismos datos
    IF NOT EXISTS (
        SELECT 1
        FROM Servicio
        WHERE Nombre = p_Nombre
          AND Descripcion = p_Descripcion
    ) THEN
        INSERT INTO Servicio (Nombre, Descripcion, Estatus)
        VALUES (p_Nombre, p_Descripcion, p_Estatus);
    END IF;
END$$

DELIMITER ;