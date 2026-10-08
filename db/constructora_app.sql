-- PostgreSQL script for Supabase
START TRANSACTION;

--
-- Base de datos: constructora_app
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla inventario
--

CREATE TABLE inventario (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 0,
  ubicacion_id BIGINT DEFAULT NULL,
  created_by BIGINT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Volcado de datos para la tabla inventario
--

INSERT INTO inventario (id, nombre, cantidad, ubicacion_id, created_by, created_at, updated_at) VALUES
(53, 'Andamio 1-1/2', 54, 24, NULL, '2025-10-30 23:20:48', '2025-11-03 18:12:44'),
(54, 'Andamio 2-1/2', 25, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(55, 'Tijera para andamio (chica)', 25, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(56, 'Tijera para andamio (grande)', 12, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(57, 'Contenedor', 10, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(58, 'Revolvedora', 4, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(59, 'Carrucha', 3, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(60, 'Aspiradora RIDGID anaranjada', 1, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(61, 'Palas', 36, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(62, 'Talacho', 21, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(63, 'Barra anaranjada', 4, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(64, 'Cizallas grandes', 2, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(65, 'Pizones', 3, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(66, 'Rastrillos', 3, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(67, 'Grifa 1 Pulgada', 1, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(68, 'Bomba de agua azul', 1, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(69, 'Tiroleras', 2, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(70, 'Botas (pares)', 40, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(71, 'Compresor azul', 1, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(72, 'Tanque de oxigeno', 1, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(73, 'Carretilla polipasto', 2, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(74, 'Destornillador Maquita', 1, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(75, 'Taladro rojo alambrico', 1, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(76, 'Hidrolavadora', 1, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(77, 'Generador blanco atlas copco', 1, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(78, 'Cargador de bateria', 1, 24, NULL, '2025-10-30 23:20:48', '2025-10-30 23:20:48'),
(79, 'Arnes con cuerda de vida', 5, 25, NULL, '2025-10-30 23:25:36', '2025-10-30 23:25:36'),
(80, 'Palas', 7, 25, NULL, '2025-10-30 23:25:36', '2025-10-30 23:25:36'),
(81, 'Talacho', 4, 25, NULL, '2025-10-30 23:25:36', '2025-10-30 23:25:36'),
(82, 'Planta soldadora amarilla SD-250', 1, 25, NULL, '2025-10-30 23:25:36', '2025-10-30 23:25:36'),
(83, 'Tanque de oxigeno', 3, 25, NULL, '2025-10-30 23:25:36', '2025-10-30 23:25:36'),
(84, 'Taladro naranja', 1, 25, NULL, '2025-10-30 23:25:36', '2025-10-30 23:25:36'),
(85, 'Vibrador amarillo (chico)', 1, 25, NULL, '2025-10-30 23:25:36', '2025-10-30 23:25:36'),
(86, 'Regla vibradora c/motor', 1, 25, NULL, '2025-10-30 23:25:36', '2025-10-30 23:25:36'),
(87, 'Cortadora de vitropiso', 1, 25, NULL, '2025-10-30 23:25:36', '2025-10-30 23:25:36'),
(88, 'Cortadora de cemento (grande)', 1, 25, NULL, '2025-10-30 23:25:36', '2025-10-30 23:25:36'),
(89, 'Polipasto', 1, 25, NULL, '2025-10-30 23:25:36', '2025-10-30 23:25:36'),
(90, 'Cabezeras', 29, 25, NULL, '2025-10-30 23:25:36', '2025-10-30 23:25:36'),
(91, 'Catres', 14, 25, NULL, '2025-10-30 23:25:36', '2025-10-30 23:25:36'),
(92, 'Sillas', 4, 26, NULL, '2025-10-30 23:27:43', '2025-10-30 23:27:43'),
(93, 'Silla oficina', 1, 26, NULL, '2025-10-30 23:27:43', '2025-10-30 23:27:43'),
(94, 'Bote de basura', 1, 26, NULL, '2025-10-30 23:27:43', '2025-10-30 23:27:43'),
(95, 'Base de metal', 8, 26, NULL, '2025-10-30 23:27:43', '2025-10-30 23:27:43'),
(96, 'Base madera', 1, 26, NULL, '2025-10-30 23:27:43', '2025-10-30 23:27:43'),
(97, 'Colchon individual', 18, 26, NULL, '2025-10-30 23:27:43', '2025-10-30 23:27:43'),
(98, 'Pizarron blanco', 1, 26, NULL, '2025-10-30 23:27:43', '2025-10-30 23:27:43'),
(99, 'Cabecera', 30, 26, NULL, '2025-10-30 23:27:43', '2025-10-30 23:27:43'),
(100, 'Catres', 14, 26, NULL, '2025-10-30 23:27:43', '2025-10-30 23:27:43'),
(101, 'Archivero', 1, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(102, 'Silla oficina', 4, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(103, 'Ventiladores', 3, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(104, 'Dispensador de agua', 1, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(105, 'Diablito', 1, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(106, 'Chalecos', 2, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(107, 'Escuadra metalica p/cantera', 1, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(108, 'Colchones', 17, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(109, 'Escoba', 1, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(110, 'Diablito amarillo', 1, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(111, 'Bases metal', 15, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(112, 'Pizarron blanco', 1, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(113, 'Catres', 7, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(114, 'Filtro para cafe', 1, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(115, 'Control mini split', 1, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(116, 'Pinzas de tierra', 1, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(117, 'Carpeta verde', 5, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(118, 'Arnes', 4, 27, NULL, '2025-10-30 23:30:34', '2025-10-30 23:30:34'),
(119, 'Refrigerador', 1, 28, NULL, '2025-10-30 23:31:26', '2025-10-30 23:31:26'),
(120, 'Llanta Goodyear 22.5', 1, 28, NULL, '2025-10-30 23:31:26', '2025-10-30 23:31:26'),
(121, 'Parrilla', 1, 28, NULL, '2025-10-30 23:31:26', '2025-10-30 23:31:26'),
(122, 'Cabecera', 20, 28, NULL, '2025-10-30 23:31:26', '2025-10-30 23:31:26'),
(123, 'Colchones', 18, 28, NULL, '2025-10-30 23:31:26', '2025-10-30 23:31:26'),
(124, 'Cargador de bateria negro', 1, 29, NULL, '2025-10-30 23:32:09', '2025-10-30 23:32:09'),
(125, 'Talacho', 3, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(127, 'Planta de luz grande', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(128, 'Cortadora de concreto amarilla', 5, 32, NULL, '2025-10-30 23:33:41', '2025-11-07 21:06:23'),
(130, 'Microondas Galans', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(131, 'Mini refrigerador DACE', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(132, 'Microondas mabe', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(133, 'Sillas oficina', 6, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(134, 'Cerrucho electrico', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(135, 'Pichirilo', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(136, 'Bolsa de trapos', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(137, 'Hule lona gris', 3, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(138, 'Cardas cepillo de alambre', 5, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(139, 'Clavo 4\"', 3, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(140, 'Clavo 2-1/2\"', 2, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(141, 'Soldadura', 7, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(142, 'Llave truper 38mm', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(143, 'Extension', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(144, 'Vibradores completos', 3, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(145, 'Guillotina', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(146, 'Palas', 3, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(147, 'Rastrillos', 4, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(148, 'Picos', 2, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(149, 'Disco corte de metal A30R-BF', 9, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(150, 'Hielera', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(151, 'Disco corte metal 7 3305', 9, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(152, 'Disco corte metal 7 730', 2, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(153, 'Disco 2019 Inox', 4, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(154, 'Disco corte metal 2007', 22, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(155, 'Clavo concreto 3\"', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(156, 'Abicor Binzel', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(157, 'Cascos de seguridad', 9, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(158, 'Mangas de carnaza', 4, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(159, 'Mandil carnaza', 4, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(160, 'Cepillo metal', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(161, 'Aditivo p/ concreto', 2, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(162, 'Primario herrero gris', 3, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(163, 'Primario estructural', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(164, 'Varilla luz tierra', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(165, 'Broca concreto 8-1/2', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(166, 'Broca madera 1/2', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(167, 'Broca 7/16 madera', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(168, 'Grasa welco', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(169, 'Punta refaccion', 10, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(170, 'Lazos', 4, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(171, 'Rondana 1\"', 150, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(172, 'Botas hule', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(173, 'Masking azul 2\"', 2, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(174, 'Cinta doble cara negra', 1, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(175, 'Balas amarillas cartucho industrial', 1780, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(176, 'Disco lija 2718 4-1/2', 2, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(177, 'Clavo c/arandela p/concreto', 700, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(178, 'Molde p/soldadura exometrica', 2, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(179, 'Lentes transparente', 12, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(180, 'Cristal p/careta sombra 2\"', 17, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(181, 'Cristal p/careta transparente 2\"', 10, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(182, 'Grifas', 4, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(183, 'Tuercas 1/2', 50, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(184, 'Colchones', 4, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(185, 'Tornillos grandes', 7, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(186, 'Barbiquejos', 19, 30, NULL, '2025-10-30 23:33:41', '2025-10-30 23:33:41'),
(187, 'Colchon individual', 21, 31, NULL, '2025-10-31 20:45:40', '2025-10-31 20:45:40'),
(188, 'Cabecera individual', 22, 31, NULL, '2025-10-31 20:45:40', '2025-10-31 20:45:40'),
(189, 'Base individual', 12, 31, NULL, '2025-10-31 20:45:40', '2025-10-31 20:45:40'),
(190, 'Arnes', 34, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(191, 'Secador de manos', 3, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(192, 'Endurecedor para concreto estampado', 12, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(193, 'Tiras led', 2, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(194, 'Porta papel', 4, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(195, 'Guillotina', 1, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(196, 'Asiento WC', 4, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(197, 'Cierra puertas MOD.CT1800', 6, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(198, 'Cierra puertas MOD.1604', 5, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(199, 'Guarda cabos para cables 5/16', 1, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(200, 'Manerales microalambre', 2, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(201, 'Tapa para registro', 1, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(202, 'Lineas de vida', 16, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(203, 'Bandolas', 3, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(204, 'Pija cabeza hexagonal punta de broca 6\"', 1, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(205, 'Llantas completas RIN 16', 2, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(206, 'Tijeras para andamio', 4, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(207, 'Garrucha', 1, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(208, 'Cople tipo americano 1\"', 6, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(209, 'Careta', 1, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(210, 'Papelera de pedal', 1, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(211, 'Botas de hule', 16, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(212, 'Carretillas para porton', 5, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(213, 'Puntas faraday', 10, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(214, 'Extintores', 3, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(215, 'Tramo de PVC 4\"', 1, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(216, 'Caja cuadrada de PVC costal', 1, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(217, 'Cajas de carpetas tamano oficio', 2, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(218, 'Impresora HP F/S', 1, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(219, 'Escaleras metalicas', 2, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(220, 'Revolvedoras', 2, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(221, 'Contenedores de agua 1000 litros', 4, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(222, 'Cama individual (colchon y base)', 9, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(223, 'Cilindros de agua termos', 3, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(224, 'Llantas completas', 2, 32, NULL, '2025-10-31 20:48:03', '2025-10-31 20:48:03'),
(230, 'Contenedor', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(231, 'Generador de Marca Wisperwatt, Modelo: Dca-70SSJU No serie: 7301736', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(232, 'Vibradores electricos', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(233, 'Inversor lincon', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(234, 'Vibradores a gasolina', 5, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(235, 'Bailarinas', 4, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(236, 'Generador  de marca lincon', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(237, 'Retroexcavadora', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(238, 'tupo pead corrugado 3\"', 5, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(239, 'Talado de Banco Silverline', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(240, 'Pulidoras de 7\" Makita', 7, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(241, 'Pulidoras de 4\" Makita', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(242, 'Cortadoras de banco de 14\"  Makita', 3, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(243, 'Sierra para madera Makita', 5, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(244, 'Taladros Makita', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(245, 'Rotomartillos chicos Makita', 3, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(246, 'Rotomartillos chicos Bosch', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(247, 'Rotomartillos de estuche Makita', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(248, 'Rompedor de concreto bosc', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(249, 'Tarrajas de 1\" truper', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(250, 'Tarrajas de 2\" truper', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(251, 'Pistolas para pintar', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(252, 'Gram-bel', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(253, 'Caladora bosch', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(254, 'Caladora milwukeee', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(255, 'tarraja urrea 2\"', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(256, 'Soldadora marca axtech ultra', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(257, 'Equipo de oxicorte completo con diablo', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(258, 'Medio rollo de cable del 200', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(259, 'Sopla hojas truper', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(260, 'Bomba de agua truper', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(261, 'Soldadora marca axtech ultra completa con tanque de mezcla', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(262, 'Soldadora infra  MI 2-300cd', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(263, 'Cables para soldadoras', 3, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(264, 'Extenciones', 5, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(265, 'Polipasto de 3ton', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(266, 'Caretas', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(267, 'Antorcha que sirve', 5, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(268, 'Juego de mangera con manometrrros para oxicorte', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(269, 'Juego de mangera para oxicorte', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(270, 'Niveleta truper 36\"', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(271, 'Niveleta 47\"', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(272, 'Arneces completos', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(273, 'Tanque de mezcla', 4, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(274, 'Tanque de oxigeno', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(275, 'Compresor de aire byp 30 galones 220v', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(276, 'Boquillas para oxicorte', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(277, 'Cortadora de loseta', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(278, 'Compresor a gasolina', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(279, 'Mangera para bomba', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(280, 'Soldadora  marca axtech no sirven', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(281, 'Batidor rubi', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(282, 'Fresador milwoki', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(283, 'Caretas nuevas', 3, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(284, 'licuatitte de 4\"', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(285, 'licuatitte de 3\"', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(286, 'Tubo verde de de 2\"', 23, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(287, 'Tubo verde de de 3\"', 15, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(288, 'licuatitte de 2\"', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(289, 'Palas', 8, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(290, 'Picos', 5, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(291, 'Arneces', 5, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(292, 'Lineas de vida 3', 3, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(293, 'Tapas para sanitario', 7, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(294, 'Barreta de linia', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(295, 'Marro de 20 lib', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(296, 'Antorchas', 5, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(297, 'Muela', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(298, 'Bomba de agua munich1/2hp', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(299, 'Tubo de 4\" corrugado', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(300, 'licuatitte de 1\"', 5, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(301, 'Tripes', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(302, 'Mangera para gas', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(303, 'Caja pata termomagneticos', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(304, 'Valvula de paso 2\"', 3, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(305, 'Valvula de paso 3\"', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(306, 'Valvula de paso 1', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(307, 'Pistola de calor milwoukee', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(308, 'Llantas para andamio', 2, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(309, 'Codo tee 4\"', 15, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(310, 'Codo yes 4\"', 15, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(311, 'Codos 90? 4\"', 15, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(312, 'Rollos de malla', 3, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57'),
(313, 'Maguey rallado', 1, 32, NULL, '2025-11-11 15:52:57', '2025-11-11 15:52:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla mantenimientos
--

CREATE TABLE mantenimientos (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  vehiculo_id BIGINT NOT NULL,
  fecha DATE NOT NULL,
  servicio VARCHAR(160) NOT NULL,
  kilometraje INTEGER NOT NULL,
  lugar VARCHAR(160) NOT NULL,
  importe NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  notas TEXT NOT NULL,
  created_by BIGINT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION set_maintenance_uuid()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.id IS NULL OR NEW.id = '' THEN
    NEW.id = gen_random_uuid()::text;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER bi_maintenance_uuid
BEFORE INSERT ON mantenimientos
FOR EACH ROW EXECUTE FUNCTION set_maintenance_uuid();

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla movimientos
--

CREATE TABLE movimientos (
  id BIGSERIAL PRIMARY KEY,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('create', 'update', 'delete')),
  entidad VARCHAR(40) NOT NULL,
  entidad_id VARCHAR(64) DEFAULT NULL,
  nombre_entidad VARCHAR(200) DEFAULT NULL,
  descripcion VARCHAR(280) NOT NULL,
  fecha_hora TIMESTAMP(3) NOT NULL,
  usuario_id BIGINT DEFAULT NULL,
  nombre_actor VARCHAR(120) DEFAULT NULL,
  correo_actor VARCHAR(160) DEFAULT NULL,
  rol_actor VARCHAR(40) DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla ubicaciones
--

CREATE TABLE ubicaciones (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  created_by BIGINT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Volcado de datos para la tabla ubicaciones
--

INSERT INTO ubicaciones (id, nombre, created_by, created_at) VALUES
(24, 'Rancho', NULL, '2025-10-30 22:24:52'),
(25, 'Contenedor verde (rancho)', NULL, '2025-10-30 22:54:12'),
(26, 'Oficina móvil Reynosa', NULL, '2025-10-30 22:54:34'),
(27, 'Oficina blanca Toluca', NULL, '2025-10-30 22:54:56'),
(28, 'Autobus amarillo (11-DUA-54)', NULL, '2025-10-30 22:55:04'),
(29, 'Autobus amarillo (17-DUA-49)', NULL, '2025-10-30 22:55:12'),
(30, 'Oficina blanca Tayoltita', NULL, '2025-10-30 22:55:35'),
(31, 'Autobus Amarillo (15-DVA-23)', NULL, '2025-10-30 23:54:24'),
(32, 'Durango', NULL, '2025-10-31 20:43:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla usuarios
--

CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  apellido VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL,
  password_hash VARCHAR(512) NOT NULL,
  rol VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (rol IN ('admin', 'user')),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Volcado de datos para la tabla usuarios
--

INSERT INTO usuarios (id, nombre, apellido, email, password_hash, rol, activo, created_at, updated_at) VALUES
(15, 'Administrador', 'General', 'Administrador@brunandfer.com', '$2b$12$VvcCbcvwv9cxYVR96Ho3qeEb8wZNcW7opS6m29lKnfCWXHRfxZOui', 'admin', TRUE, '2026-04-25 00:50:50', '2026-04-25 00:59:48'),
(19, 'Sandra', 'Piedra', 'Sandra.piedra@gmail.com', '$2b$12$FwLShliXQLYPM.S3tzqojuujD111qCgZUG.gvN9iQMAvUTRSO9DUK', 'admin', TRUE, '2026-04-25 17:00:58', '2026-04-25 17:00:58'),
(22, 'Maria', 'santillan', 'maria1@gmail.com', '$2b$12$03U0QkzdpV5qpDEvLiQcZ.NkuhfS0G.avmtOApIyJl4edb2zmC8ny', 'user', TRUE, '2026-05-22 01:02:23', '2026-05-22 01:02:23'),
(24, 'Edgar Jair', 'García Santillán', 'jair_1999@live.com.mx', '$2b$12$sDjli4F6PZhSLzRD3Eutt.NlJIcJGiPNs/.jsaTbqdrkszo1QPwzq', 'user', TRUE, '2026-05-23 01:08:01', '2026-05-23 01:08:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla vehiculos
--

CREATE TABLE vehiculos (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  placa VARCHAR(40) NOT NULL,
  marca VARCHAR(80) NOT NULL,
  motor VARCHAR(80) NOT NULL,
  modelo VARCHAR(16) NOT NULL,
  numero_serie VARCHAR(64) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'mantenimiento', 'baja')),
  kilometraje INTEGER NOT NULL DEFAULT 0,
  created_by BIGINT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Volcado de datos para la tabla vehiculos
--

INSERT INTO vehiculos (id, nombre, placa, marca, motor, modelo, numero_serie, estado, kilometraje, created_by, created_at, updated_at) VALUES
(70, 'RAM CREW CAB', 'FN-5127-B', 'N/A', 'N/A', '2012', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2026-04-23 17:11:59'),
(71, 'RAM', 'FU-4928-A', 'N/A', 'N/A', '2005', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(72, 'RAM 4000', 'FU-7705-A', 'N/A', 'N/A', '2011', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(73, 'RANGER FORD', 'FU-7707-A', 'N/A', 'N/A', '1998', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(74, 'CHEVROLET PICK UP', 'FU-7706-A', 'N/A', 'N/A', '1993', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(75, 'TOYOTA HILUX', 'FK-9118-A', 'N/A', 'N/A', '2007', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(76, 'TOYOTA HILUX', 'FK-9140-A', 'N/A', 'N/A', '2008', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(77, 'REMOLQUE PJ TRAILERS', '1F032131', 'N/A', 'N/A', '2008', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(78, 'REMOLQUE OFICINA', '1FDB127', 'N/A', 'N/A', '2014', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(79, 'REMOLQUE NEGRO', '3FC530A', 'N/A', 'N/A', '2008', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(80, 'REMOLQUE ROJO', '3FC395A', 'N/A', 'N/A', '2013', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(81, 'CAMION INTERNACIONAL', 'FS-1522-A', 'N/A', 'N/A', '2004', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(82, 'GRUA FREIGHTLINER', 'FT-2548-A', 'N/A', 'N/A', '2001', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(83, 'SUPER DUTY FORD F350 XL', 'FR-2500-B', 'N/A', 'N/A', '2012', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(84, 'REMOLQUE BODEGA', '7FB244A', 'N/A', 'N/A', '2005', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(85, 'RAM CREW CAB LARAMIE', 'FM-9031-B', 'N/A', 'N/A', '2018', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(86, 'RETROEXCAVADORA', '580M', 'N/A', 'N/A', 'N/A', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(87, 'AUTOBUS', '11DVA54', 'N/A', 'N/A', '2008', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(88, 'GENERADOR', '4045DF270', 'N/A', 'N/A', 'N/A', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(89, 'AUTOBUS GRANDE', 'NA-001', 'N/A', 'N/A', 'N/A', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(90, 'CAMION FLETES', 'FV-0546', 'N/A', 'N/A', 'N/A', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(91, 'AUTOBUS XL', 'NA-002', 'N/A', 'N/A', 'N/A', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(92, 'RAM 1500 MILD HYBRID', 'FM-1527-C', 'N/A', 'N/A', '2022', 'N/A', 'activo', 0, NULL, '2025-11-11 18:25:53', '2025-11-11 18:25:53'),
(93, 'REMOLQUE', 'NEGRO-2', 'N/A', 'N/A', '2022', 'N/A', 'activo', 2345, NULL, '2025-11-11 18:25:53', '2026-04-25 18:33:59');

-- --------------------------------------------------------

-- Estructura para la vista v_vehiculo_ultimo_mantenimiento
--
CREATE VIEW v_vehiculo_ultimo_mantenimiento AS
SELECT
  m.vehiculo_id,
  v.nombre,
  MAX(m.fecha) AS ultima_fecha,
  (
    SELECT m2.kilometraje
    FROM mantenimientos m2
    WHERE m2.vehiculo_id = m.vehiculo_id
    ORDER BY m2.fecha DESC, m2.id DESC
    LIMIT 1
  ) AS km_ultimo
FROM mantenimientos m
JOIN vehiculos v ON v.id = m.vehiculo_id
GROUP BY m.vehiculo_id, v.nombre;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla inventario
--
CREATE UNIQUE INDEX uq_inventory_nombre_location ON inventario (nombre, ubicacion_id);
CREATE INDEX idx_inventory_nombre ON inventario (nombre);
CREATE INDEX idx_inventory_location ON inventario (ubicacion_id);
CREATE INDEX idx_inventory_created_by ON inventario (created_by);

--
-- Indices de la tabla mantenimientos
--
CREATE INDEX idx_mnt_fecha ON mantenimientos (fecha);
CREATE INDEX idx_mnt_vehicle ON mantenimientos (vehiculo_id);
CREATE INDEX idx_maintenance_vehicle_date ON mantenimientos (vehiculo_id, fecha);
CREATE INDEX idx_maintenance_created_by ON mantenimientos (created_by);

--
-- Indices de la tabla movimientos
--
CREATE INDEX idx_mov_ts ON movimientos (fecha_hora);
CREATE INDEX idx_mov_entity ON movimientos (entidad, entidad_id);
CREATE INDEX idx_movements_user ON movimientos (usuario_id);

--
-- Indices de la tabla ubicaciones
--
CREATE UNIQUE INDEX uq_locations_name ON ubicaciones (nombre);
CREATE INDEX idx_locations_created_by ON ubicaciones (created_by);

--
-- Indices de la tabla usuarios
--
CREATE UNIQUE INDEX uq_users_email ON usuarios (email);

--
-- Indices de la tabla vehiculos
--
CREATE UNIQUE INDEX uq_vehicles_placa ON vehiculos (placa);
CREATE INDEX idx_vehicles_estado ON vehiculos (estado);
CREATE INDEX idx_vehicles_created_by ON vehiculos (created_by);

--
-- Preserve the next values from the original auto-increment counters.
SELECT setval(pg_get_serial_sequence('inventario', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM inventario), 1), 329), true);
SELECT setval(pg_get_serial_sequence('movimientos', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM movimientos), 1), 854), true);
SELECT setval(pg_get_serial_sequence('ubicaciones', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM ubicaciones), 1), 46), true);
SELECT setval(pg_get_serial_sequence('usuarios', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM usuarios), 1), 24), true);
SELECT setval(pg_get_serial_sequence('vehiculos', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM vehiculos), 1), 150), true);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla inventario
--
ALTER TABLE inventario
  ADD CONSTRAINT fk_inventory_created_by FOREIGN KEY (created_by) REFERENCES usuarios (id) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT fk_inventory_location FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones (id) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla mantenimientos
--
ALTER TABLE mantenimientos
  ADD CONSTRAINT fk_mnt_created_by FOREIGN KEY (created_by) REFERENCES usuarios (id) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT fk_mnt_vehicle FOREIGN KEY (vehiculo_id) REFERENCES vehiculos (id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla movimientos
--
ALTER TABLE movimientos
  ADD CONSTRAINT fk_mov_user FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla ubicaciones
--
ALTER TABLE ubicaciones
  ADD CONSTRAINT fk_locations_created_by FOREIGN KEY (created_by) REFERENCES usuarios (id) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla vehiculos
--
ALTER TABLE vehiculos
  ADD CONSTRAINT fk_vehicles_created_by FOREIGN KEY (created_by) REFERENCES usuarios (id) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_inventario_updated_at
BEFORE UPDATE ON inventario
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_mantenimientos_updated_at
BEFORE UPDATE ON mantenimientos
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_vehiculos_updated_at
BEFORE UPDATE ON vehiculos
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
COMMIT;
