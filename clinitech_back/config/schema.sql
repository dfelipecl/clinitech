-- ============================================
-- CliniTech - Esquema PostgreSQL
-- ============================================

-- Tipos ENUM personalizados
CREATE TYPE rol_usuario        AS ENUM ('tecnico', 'cliente');
CREATE TYPE tipo_documento     AS ENUM ('recepcion', 'entrega', 'garantia');
CREATE TYPE estado_tecnico     AS ENUM ('activo', 'inactivo');
CREATE TYPE estado_notificacion AS ENUM ('leida', 'no_leida');
CREATE TYPE estado_reparacion  AS ENUM ('recibido', 'diagnostico', 'en_reparacion', 'listo', 'entregado');

-- Tabla: usuario
-- Base de todos los actores del sistema (técnicos y clientes)
CREATE TABLE usuario (
  id_usuario    SERIAL PRIMARY KEY,
  nombre        VARCHAR(50)  NOT NULL,
  apellido      VARCHAR(50)  NOT NULL,
  documento     VARCHAR(20)  NOT NULL UNIQUE,
  correo        VARCHAR(80)  NOT NULL UNIQUE,
  telefono      VARCHAR(20),
  rol           rol_usuario  NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

-- Tabla: tecnico
-- Extiende usuario con datos propios del rol técnico
CREATE TABLE tecnico (
  id_tecnico   SERIAL PRIMARY KEY,
  id_usuario   INT           NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  especialidad VARCHAR(100)  NOT NULL,
  estado       estado_tecnico NOT NULL DEFAULT 'activo'
);

-- Tabla: cliente
-- Extiende usuario con datos propios del rol cliente
CREATE TABLE cliente (
  id_cliente SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla: equipo
-- Equipos de cómputo registrados por los clientes
CREATE TABLE equipo (
  id_equipo    SERIAL PRIMARY KEY,
  marca        VARCHAR(50) NOT NULL,
  modelo       VARCHAR(50) NOT NULL,
  numero_serie VARCHAR(50) NOT NULL UNIQUE,
  id_cliente   INT         NOT NULL REFERENCES cliente(id_cliente)
);

-- Tabla: reparacion
-- Registro de diagnósticos, procedimientos y estado de cada reparación
CREATE TABLE reparacion (
  id_reparacion SERIAL PRIMARY KEY,
  diagnostico   TEXT               NOT NULL,
  procedimiento TEXT               NOT NULL,
  estado        estado_reparacion  NOT NULL DEFAULT 'recibido',
  costo_total   NUMERIC(10, 2)     NOT NULL DEFAULT 0,
  fecha_inicio  DATE               NOT NULL DEFAULT CURRENT_DATE,
  fecha_fin     DATE,
  id_tecnico    INT                NOT NULL REFERENCES tecnico(id_tecnico),
  id_equipo     INT                NOT NULL REFERENCES equipo(id_equipo)
);

-- Tabla: documento
-- Documentos de recepción, entrega y garantía asociados a reparaciones
CREATE TABLE documento (
  id_documento            SERIAL PRIMARY KEY,
  tipo_documento          tipo_documento NOT NULL,
  fecha_recepcion         DATE,
  fecha_entrega           DATE,
  motivo                  TEXT,
  estado_recepcion        VARCHAR(50),
  estado_entrega          VARCHAR(50),
  especificacion_garantia TEXT,
  firma_cliente           VARCHAR(255),
  firma_tecnico           VARCHAR(255),
  id_tecnico              INT NOT NULL REFERENCES tecnico(id_tecnico),
  id_equipo               INT NOT NULL REFERENCES equipo(id_equipo),
  -- FK presente en el diagrama ER pero ausente en el SQL original de MySQL
  id_reparacion           INT REFERENCES reparacion(id_reparacion)
);

-- Tabla: mensaje
-- Comunicación interna entre clientes y técnicos
CREATE TABLE mensaje (
  id_mensaje      SERIAL PRIMARY KEY,
  contenido       TEXT      NOT NULL,
  fecha_envio     TIMESTAMP NOT NULL DEFAULT NOW(),
  id_remitente    INT       NOT NULL REFERENCES usuario(id_usuario),
  id_destinatario INT       NOT NULL REFERENCES usuario(id_usuario),
  id_equipo       INT       REFERENCES equipo(id_equipo),
  archivo_adjunto VARCHAR(255)
);

-- Tabla: notificacion
-- Eventos automáticos generados por el sistema
CREATE TABLE notificacion (
  id_notificacion SERIAL PRIMARY KEY,
  tipo            VARCHAR(50)         NOT NULL,
  mensaje         TEXT                NOT NULL,
  fecha           TIMESTAMP           NOT NULL DEFAULT NOW(),
  estado          estado_notificacion NOT NULL DEFAULT 'no_leida',
  id_usuario      INT                 NOT NULL REFERENCES usuario(id_usuario)
);
