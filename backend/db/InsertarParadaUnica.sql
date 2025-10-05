DELIMITER $$

CREATE PROCEDURE InsertarParadaUnica (
    IN p_Nombre VARCHAR(40),
    IN p_Descripcion VARCHAR(100),
    IN p_Ubicacion VARCHAR(400),
    IN p_Estatus BIT
)
BEGIN
    -- Verificar si ya existe un registro con los mismos datos
    IF NOT EXISTS (
        SELECT 1 
        FROM Parada
        WHERE Nombre = p_Nombre
          AND Descripcion = p_Descripcion
          AND Ubicacion = p_Ubicacion
          
    ) THEN
        INSERT INTO Parada (Nombre, Descripcion, Ubicacion, Estatus)
        VALUES (p_Nombre, p_Descripcion, p_Ubicacion, p_Estatus);
    END IF;
END$$

DELIMITER ;