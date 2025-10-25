DELIMITER $$
-- Posible inicio de sesión por medio del uso de la tabla Usuario Sede.
CREATE PROCEDURE Usuario_InicioSesion (
    IN username VARCHAR(300),
    IN id_password INT
)

BEGIN
    -- Declaramos una variable status (int) para validar ó no el login. 
    -- Por default, el valor de esta variable será 0 en un inicio y se mantendrá así si el login no es válido. 
	DECLARE status INT DEFAULT 0;
    -- Verificamos que el username y el id_password (IdTipoUsuario) existan en la tabla Usuario. 
  IF EXISTS (SELECT 1 FROM Usuario WHERE Email=username AND IdTipoUsuario=id_password) THEN 
    -- Si se valida la solicitud, entonces se le asigna el valor 1 al estatuto. 
      SET status=1;
	END IF;
  
  SELECT status AS login_valido;
END$$

DELIMITER ;


