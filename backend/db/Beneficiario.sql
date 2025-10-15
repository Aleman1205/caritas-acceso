CREATE TABLE IF NOT EXISTS Beneficiario (
  Telefono VARCHAR(25) NOT NULL,
  IdTransaccion VARCHAR(200) NOT NULL,
  Nombre VARCHAR(70),
  Apellido VARCHAR(50),
  Email VARCHAR(300),
  PRIMARY KEY (Telefono, IdTransaccion)
);