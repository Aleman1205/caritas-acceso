-- MYSQL 
CREATE TABLE `TipoUsuario` (
  `Id` INT AUTO_INCREMENT PRIMARY KEY,
  `Descripcion` VARCHAR(100)
);

CREATE TABLE `Usuario` (
  `Email` VARCHAR(300) PRIMARY KEY,
  `Telefono` VARCHAR(25),
  `Nombre` VARCHAR(70),
  `Apellido` VARCHAR(50),
  `FotoUrl` LONGBLOB,
  `FechaNacimiento` DATE,
  `IdTipoUsuario` INT
);

CREATE TABLE `Sede` (
  `Id` INT AUTO_INCREMENT PRIMARY KEY,
  `Nombre` VARCHAR(100),
  `Ubicacion` VARCHAR(400),
  `Ciudad` VARCHAR(100),
  `HoraInicio` TIME NOT NULL,
  `HoraFinal` TIME NOT NULL,
  `Descripcion` VARCHAR(100)
);

CREATE TABLE `UsuarioSede` (
  `Email` VARCHAR(300),
  `IdSede` INT,
  PRIMARY KEY (`Email`, `IdSede`)
);

CREATE TABLE `Servicio` (
  `Id` INT AUTO_INCREMENT PRIMARY KEY,
  `Nombre` VARCHAR(40),
  `Descripcion` VARCHAR(100),
  `Estatus` BIT
);

CREATE TABLE `SedeServicio` (
  `Id` INT AUTO_INCREMENT PRIMARY KEY,
  `Descripcion` VARCHAR(100),
  `Capacidad` DECIMAL(4,0),
  `Precio` DECIMAL(6,2),
  `HoraInicio` TIME,
  `HoraFinal` TIME,
  `Estatus` BIT,
  `IdSede` INT,
  `IdServicio` INT
);

CREATE TABLE `Ruta` (
  `IdSedeServicio` INT,
  `Orden` INT,
  `Hora` TIME,
  `IdParada` INT,
  PRIMARY KEY (`IdSedeServicio`, `Orden`)
);

CREATE TABLE `Parada` (
  `Id` INT AUTO_INCREMENT PRIMARY KEY,
  `Nombre` VARCHAR(40),
  `Descripcion` VARCHAR(100),
  `Ubicacion` VARCHAR(400),
  `Estatus` BIT
);

CREATE TABLE `Transaccion` (
  `Id` VARCHAR(200) PRIMARY KEY,
  `Fecha` datetime
);

CREATE TABLE `Reserva` (
  `IdTransaccion` VARCHAR(200) PRIMARY KEY,
  `FechaInicio` DATETIME,
  `FechaSalida` DATETIME,
  `NumeroPersonas` TINYINT,
  `IdSede` INT
);

CREATE TABLE `Compra` (
  `IdTransaccion` VARCHAR(200) PRIMARY KEY,
  `Total` DECIMAL(6,2),
  `Fecha` datetime,
  `IdSede` INT,
  `IdServicio` INT
);

CREATE TABLE `Beneficiario` (
  `Telefono` VARCHAR(25),
  `IdTransaccion` VARCHAR(200),
  `Nombre` VARCHAR(70),
  `Apellido` VARCHAR(50),
  `Email` VARCHAR(300),
  PRIMARY KEY (`Telefono`, `IdTransaccion`)
);

ALTER TABLE `Usuario` ADD FOREIGN KEY (`IdTipoUsuario`) REFERENCES `TipoUsuario` (`Id`);

ALTER TABLE `UsuarioSede` ADD FOREIGN KEY (`Email`) REFERENCES `Usuario` (`Email`);

ALTER TABLE `UsuarioSede` ADD FOREIGN KEY (`IdSede`) REFERENCES `Sede` (`Id`);

ALTER TABLE `SedeServicio` ADD FOREIGN KEY (`IdSede`) REFERENCES `Sede` (`Id`);

ALTER TABLE `SedeServicio` ADD FOREIGN KEY (`IdServicio`) REFERENCES `Servicio` (`Id`);

ALTER TABLE `Transaccion` ADD FOREIGN KEY (`Id`) REFERENCES `Reserva` (`IdTransaccion`);

ALTER TABLE `Reserva` ADD FOREIGN KEY (`IdSede`) REFERENCES `Sede` (`Id`);

ALTER TABLE `Transaccion` ADD FOREIGN KEY (`Id`) REFERENCES `Compra` (`IdTransaccion`);

ALTER TABLE `Compra` ADD FOREIGN KEY (`IdSede`) REFERENCES `SedeServicio` (`IdSede`);

ALTER TABLE `Compra` ADD FOREIGN KEY (`IdServicio`) REFERENCES `SedeServicio` (`IdServicio`);

ALTER TABLE `Beneficiario` ADD FOREIGN KEY (`IdTransaccion`) REFERENCES `Transaccion` (`Id`);

ALTER TABLE `Ruta` ADD FOREIGN KEY (`IdSedeServicio`) REFERENCES `SedeServicio` (`Id`);

ALTER TABLE `Ruta` ADD FOREIGN KEY (`IdParada`) REFERENCES `Parada` (`Id`);
