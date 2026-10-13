// Pruebas de integración de la API de CliniTech (sin conectar a la base de datos real)
process.env.JWT_SECRET = 'secreto_de_prueba';

// Se reemplaza la conexión a PostgreSQL por una falsa: estas pruebas no tocan datos reales
jest.mock('../config/database', () => ({ query: jest.fn(), connect: jest.fn() }));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const tokenTecnico = jwt.sign({ id_usuario: 1, rol: 'tecnico' }, process.env.JWT_SECRET);
const tokenCliente = jwt.sign({ id_usuario: 2, rol: 'cliente' }, process.env.JWT_SECRET);

describe('Disponibilidad', () => {
  test('GET /api/health responde 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

describe('Seguridad: autenticación y roles', () => {
  test('GET /api/reparaciones sin token responde 401', async () => {
    const res = await request(app).get('/api/reparaciones');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/reparaciones con token de cliente responde 403', async () => {
    const res = await request(app)
      .get('/api/reparaciones')
      .set('Authorization', `Bearer ${tokenCliente}`);
    expect(res.statusCode).toBe(403);
  });

  test('GET /api/auth/sesion sin token responde 401', async () => {
    const res = await request(app).get('/api/auth/sesion');
    expect(res.statusCode).toBe(401);
  });
});

describe('Validación de datos de entrada', () => {
  test('login con datos vacíos responde 400 y detalla los errores', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body.errores)).toBe(true);
  });

  test('login con intento de inyección SQL en el documento responde 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ documento: "' OR '1'='1", password: '123456' });
    expect(res.statusCode).toBe(400);
  });

  test('registro con rol inválido responde 400', async () => {
    const res = await request(app).post('/api/auth/registrar').send({
      nombre: 'Ana', apellido: 'Gómez', documento: '123456',
      correo: 'ana@correo.com', rol: 'administrador', password: '123456',
    });
    expect(res.statusCode).toBe(400);
  });

  test('crear reparación sin datos responde 400', async () => {
    const res = await request(app)
      .post('/api/reparaciones')
      .set('Authorization', `Bearer ${tokenTecnico}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test('actualizar una reparación con un estado inválido responde 400', async () => {
    const res = await request(app)
      .put('/api/reparaciones/1/estado')
      .set('Authorization', `Bearer ${tokenTecnico}`)
      .send({ estado: 'inventado' });
    expect(res.statusCode).toBe(400);
  });
});