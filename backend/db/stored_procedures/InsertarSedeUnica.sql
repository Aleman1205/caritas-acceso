DELIMITER $$

CREATE PROCEDURE InsertarSedeUnica (
    IN p_Nombre VARCHAR(100),
    IN p_Ubicacion VARCHAR(400),
    IN p_Ciudad VARCHAR(100),
    IN p_HoraInicio TIME,
    IN p_HoraFinal TIME,
    IN p_Descripcion VARCHAR(100)
)
BEGIN
    -- Verificar si ya existe un registro con los mismos datos
    IF NOT EXISTS (
        SELECT 1 
        FROM Sede
        WHERE Nombre = p_Nombre
          AND Ubicacion = p_Ubicacion
          AND Ciudad = p_Ciudad
          AND HoraInicio = p_HoraInicio
          AND HoraFinal = p_HoraFinal
          AND Descripcion = p_Descripcion
    ) THEN
        INSERT INTO Sede (Nombre, Ubicacion, Ciudad, HoraInicio, HoraFinal, Descripcion)
        VALUES (p_Nombre, p_Ubicacion, p_Ciudad, p_HoraInicio, p_HoraFinal, p_Descripcion);
    END IF;
END$$

DELIMITER ;