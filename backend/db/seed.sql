INSERT INTO Servicio (Nombre, Descripcion, Estatus)
VALUES
('Gimnasio', 'Acceso a las instalaciones de gimnasio', b'1'),
('Natacion', 'Clases y acceso a la alberca', b'1'),
('Yoga', 'Sesiones de yoga en grupo', b'1'),
('Spinning', 'Clases de ciclismo bajo techo', b'0');

INSERT INTO Sede (Nombre, Ubicacion, Ciudad, HoraInicio, HoraFinal, Descripcion)
VALUES
('Sede Centro', 'Av. Reforma #100', 'CDMX', '06:00:00', '22:00:00', 'Sede principal en el centro'),
('Sede Norte', 'Calle Norte #250', 'Monterrey', '07:00:00', '21:00:00', 'Ubicada en la zona norte'),
('Sede Sur', 'Av. Sur #50', 'Guadalajara', '08:00:00', '20:00:00', 'Sede al sur de la ciudad');

INSERT INTO SedeServicio (IdSede, IdServicio, Descripcion, Capacidad, Precio, HoraInicio, HoraFinal)
VALUES
(1, 1, 'Acceso completo al gimnasio de la sede centro', 200, 499.99, '06:00:00', '22:00:00'),
(1, 2, 'Clases de natación en alberca olímpica', 50, 299.50, '07:00:00', '20:00:00'),
(2, 3, 'Sesiones de yoga matutinas', 40, 199.00, '08:00:00', '10:00:00'),
(3, 4, 'Spinning en grupo con instructor', 30, 150.00, '18:00:00', '19:00:00');