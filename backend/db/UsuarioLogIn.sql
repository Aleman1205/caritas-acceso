DELIMITER $$
-- Posible inicio de sesión por medio del uso de la tabla Usuario Sede.
CREATE PROCEDURE Usuario_InicioSesion (
    IN username VARCHAR(300),
    IN id_password INT
)

BEGIN
    -- Declaramos una variable status (int) para validar ó no el login. 
	DECLARE status int;
    -- Verificamos que el username y el id_password (IdTipoUsuario) existan en la tabla Usuario. 
    IF EXISTS (SELECT 1 FROM Usuario WHERE Email=username AND IdTipoUsuario=id_password) THEN 
      -- Si se valida la solicitud, entonces se le asigna el valor 1 al estatuto. 
        Set @status=1;
		ELSE
      -- Si no se valida la solicitud, entonces se le asigna el valor 0 al estatuto. 
		  SET @status=0;
	END IF;
  SELECT @status;
END$$

DELIMITER ;


