DELIMITER $$
-- Posible inicio de sesión por medio del uso de la tabla Usuario Sede.
CREATE PROCEDURE Usuario_InicioSesion (
    IN email VARCHAR(300),
    IN telefono VARCHAR(25),
    IN nombre VARCHAR(70),
    IN apellido VARCHAR(50),
    IN fotoURL VARBINARY,
    IN FechaNacimiento DATE,
    IN ID_TIPOUSUARIO INT
)

-- EDITARR
-- Creas un create procedure en el que se ejecute la compra del servicio. 
BEGIN
    -- Condicionales. 
   
END$$

DELIMITER ;

