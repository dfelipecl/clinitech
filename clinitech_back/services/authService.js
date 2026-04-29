/**
 * SERVICIO: Auth
 * Lógica de negocio para autenticación y registro de usuarios
 */

const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Tecnico = require('../models/Tecnico');
const Cliente = require('../models/Cliente');

const AuthService = {

  /**
   * Autentica un usuario por documento y contraseña.
   * Retorna el token JWT y los datos públicos del usuario si las credenciales son válidas.
   */
  async login(documento, password) {
    // 1. Verificar que el usuario exista
    const usuario = await Usuario.buscarPorDocumento(documento);
    if (!usuario) {
      const error = new Error('Credenciales inválidas');
      error.estado = 401;
      throw error;
    }

    // 2. Verificar la contraseña con bcrypt
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      const error = new Error('Credenciales inválidas');
      error.estado = 401;
      throw error;
    }

    // 3. Obtener el id del perfil según el rol (id_tecnico o id_cliente)
    let idPerfil = null;
    if (usuario.rol === 'tecnico') {
      const tecnico = await Tecnico.buscarPorUsuario(usuario.id_usuario);
      idPerfil = tecnico?.id_tecnico;
    } else {
      const cliente = await Cliente.buscarPorUsuario(usuario.id_usuario);
      idPerfil = cliente?.id_cliente;
    }

    // 4. Generar el token JWT con payload mínimo (sin datos sensibles)
    const payload = {
      id_usuario: usuario.id_usuario,
      id_perfil:  idPerfil,
      rol:        usuario.rol,
      documento:  usuario.documento,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });

    // 5. Retornar token y datos públicos del usuario
    return {
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        id_perfil:  idPerfil,
        nombre:     usuario.nombre,
        apellido:   usuario.apellido,
        documento:  usuario.documento,
        correo:     usuario.correo,
        telefono:   usuario.telefono,
        rol:        usuario.rol,
      },
    };
  },

  /**
   * Registra un nuevo usuario y crea su perfil según el rol.
   * Verifica unicidad de documento y correo antes de proceder.
   */
  async registrar({ nombre, apellido, documento, correo, telefono, rol, password }) {
    // 1. Verificar unicidad del documento
    const documentoExistente = await Usuario.buscarPorDocumento(documento);
    if (documentoExistente) {
      const error = new Error('El documento ya está registrado');
      error.estado = 409;
      throw error;
    }

    // 2. Verificar unicidad del correo
    const correoExistente = await Usuario.buscarPorCorreo(correo);
    if (correoExistente) {
      const error = new Error('El correo ya está registrado');
      error.estado = 409;
      throw error;
    }

    // 3. Hashear la contraseña con 10 rondas de salt
    const password_hash = await bcrypt.hash(password, 10);

    // 4. Crear el usuario base
    const nuevoUsuario = await Usuario.crear({
      nombre, apellido, documento, correo, telefono, rol, password_hash,
    });

    // 5. Crear el perfil correspondiente al rol
    let perfil = null;
    if (rol === 'tecnico') {
      perfil = await Tecnico.crear({ id_usuario: nuevoUsuario.id_usuario });
    } else {
      perfil = await Cliente.crear({ id_usuario: nuevoUsuario.id_usuario });
    }

    return { usuario: nuevoUsuario, perfil };
  },
};

module.exports = AuthService;
