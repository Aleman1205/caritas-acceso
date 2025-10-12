-- En proceso de adaptación a la funcionalidad para agregar usuarios de la plataforma. 

DELIMITER $$

CREATE PROCEDURE AgregarUsuario (
    IN email VARCHAR(300),
    IN telefono VARCHAR(25),
    IN nombre VARCHAR(70),
    IN apellido VARCHAR(50),
    IN fotourl LONGBLOB,
    IN fechaNacimiento DATE,
    IN idTipoUsuario INT
)

  -- Creas un create procedure en el que sea agregue un usuario y que también cheque si dicho usuario, ya existe. 
  
BEGIN
    -- Verificar que no exista otro usuario con los mismos datos.
    IF NOT EXISTS (SELECT 1 FROM Usuario WHERE Nombre = nombre AND Apellido=apellido AND IdTipoUsuario=idTipoUsuario AND Email=email) THEN
        -- Verificar que el id en la tabla tipo de usuario exista 
        IF EXISTS (SELECT 1 FROM TipoUsuario WHERE Id = idTipoUsuario) THEN
            INSERT INTO USUARIO (
                Email, Telefono, Nombre, Apellido, FotoUrl, FechaNacimiento, IdTipoUsuario
            )
            VALUES (
                email, telefono, nombre, apellido, fotourl, fechaNacimiento, idTipoUsuario
            );
            SELECT 'Usuario creado correctamente' AS mensaje, 1 AS codigo;
        ELSE
            SELECT 'Tipo de usuario no existe' AS mensaje, 0 AS codigo;
        END IF;
    ELSE
        SELECT 'Email ya registrado' AS mensaje, 0 AS codigo;
    END IF;
END$$

DELIMITER ;
