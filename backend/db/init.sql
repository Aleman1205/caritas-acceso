-- MYSQL 
CREATE TABLE `TipoUsuario` (
  `Id` INT PRIMARY KEY,
  `Descripcion` NVARCHAR(100)
);

CREATE TABLE `Usuario` (
  `Email` NVARCHAR(300) PRIMARY KEY,
  `Telefono` VARCHAR(25),
  `Nombre` NVARCHAR(70),
  `Apellido` NVARCHAR(50),
  `FotoUrl` varbinary(MAX),
  `FechaNacimiento` DATE,
  `IdTipoUsuario` INT
);

CREATE TABLE `Sede` (
  `Id` INT PRIMARY KEY,
  `Ubicacion` NVARCHAR(400),
  `Descripcion` NVARCHAR(100)
);

CREATE TABLE `UsuarioSede` (
  `Email` NVARCHAR(300),
  `IdSede` INT,
  PRIMARY KEY (`Email`, `IdSede`)
);

CREATE TABLE `Servicio` (
  `Id` INT PRIMARY KEY,
  `Descripcion` NVARCHAR(100),
  `Estatus` BIT
);

CREATE TABLE `SedeServicio` (
  `IdSede` INT,
  `IdServicio` INT,
  `Descripcion` NVARCHAR(100),
  `Capacidad` INT,
  `Precio` INT,
  PRIMARY KEY (`IdSede`, `IdServicio`)
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
  `Nombre` NVARCHAR(70),
  `Apellido` NVARCHAR(50),
  `Email` NVARCHAR(300),
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