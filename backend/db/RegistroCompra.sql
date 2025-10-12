DELIMITER $$

CREATE PROCEDURE CompraDeServicio (
    IN p_IdTransaccion VARCHAR(200),
    IN p_Total DECIMAL(6,2),
    IN p_Fecha DATETIME, 
    IN p_IdSede INT, 
    IN p_IdServicio INT
)

 -- EDITAR
-- Creas un create procedure en el que se ejecute la compra del servicio. 
BEGIN
    -- Verificar que existan los IDs de la sede y el servicio en la tabla SedeServicio. 
    IF EXISTS (SELECT 1 FROM SedeServicio WHERE IdSede = p_IdSede AND IdServicio = p_IdServicio) THEN
        IF NOT EXISTS (SELECT 1 FROM Compra WHERE IdTransaccion = p_IdTransaccion) THEN
                INSERT INTO COMPRA (IdTransaccion, Total, Fecha, IdSede, IdServicio
                )
                VALUES (
                      p_IdTransaccion, p_Total, p_Fecha, p_IdSede, p_IdServicio
                );
                SELECT 'Compra registrada correctamente' AS mensaje, 1 AS codigo;
        ELSE
            SELECT 'Compra ya existe' AS mensaje, 0 AS codigo;
        END IF;
    ELSE
        SELECT 'Sede o servicio no válido' AS mensaje, 0 AS codigo;
    END IF; 
END$$

DELIMITER ;
