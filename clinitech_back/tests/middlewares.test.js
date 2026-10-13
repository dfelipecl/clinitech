// Pruebas unitarias de los middlewares de CliniTech
const jwt = require('jsonwebtoken');
const { verificarToken, soloTecnico } = require('../middlewares/auth');
const { manejarError } = require('../middlewares/errorHandler');

process.env.JWT_SECRET = 'secreto_de_prueba';

// Respuesta falsa de Express para poder revisar status() y json()
const crearRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('verificarToken', () => {
  test('responde 401 cuando no se envía el token', () => {
    const req = { headers: {} };
    const res = crearRes();
    const next = jest.fn();
    verificarToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('responde 401 cuando el token es inválido', () => {
    const req = { headers: { authorization: 'Bearer token_falso' } };
    const res = crearRes();
    const next = jest.fn();
    verificarToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('continúa y guarda el usuario cuando el token es válido', () => {
    const token = jwt.sign({ id_usuario: 1, rol: 'tecnico' }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = crearRes();
    const next = jest.fn();
    verificarToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.usuario.rol).toBe('tecnico');
  });
});

describe('soloTecnico', () => {
  test('responde 403 cuando el rol es cliente', () => {
    const req = { usuario: { rol: 'cliente' } };
    const res = crearRes();
    const next = jest.fn();
    soloTecnico(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('permite el paso cuando el rol es tecnico', () => {
    const req = { usuario: { rol: 'tecnico' } };
    const res = crearRes();
    const next = jest.fn();
    soloTecnico(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('manejarError', () => {
  beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  test('responde 409 ante una clave duplicada de PostgreSQL (23505)', () => {
    const res = crearRes();
    manejarError({ code: '23505', message: 'duplicado' }, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test('usa el código HTTP propio del error de negocio', () => {
    const res = crearRes();
    manejarError({ estado: 404, message: 'No encontrado' }, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('responde 500 ante un error inesperado', () => {
    const res = crearRes();
    manejarError(new Error('fallo'), {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
  });
});