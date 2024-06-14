import express, { Request, Response } from 'express';
import path from 'path';
import { db } from '../src/db';
import { QUERIES } from '../src/queries';
import { getCurrentWeek } from '../src/utils';

const app = express();

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json()); // Para parsear JSON en las peticiones POST

console.log(`[INIT] Static files served from: ${path.join(__dirname, '..', 'public')}`);
console.log(`[INIT] Index file path: ${path.join(__dirname, '..', 'public', 'index.html')}`);

// Middleware para logging de cada request
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Ruta para el endpoint raíz ('/')
app.get('/', (req: Request, res: Response) => {
  console.log('[ENDPOINT] GET /');
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/clases', async (req: Request, res: Response) => {
  console.log('[ENDPOINT] GET /clases');
  let { start, end } = req.query as { start?: string; end?: string };

  if (!start || !end) {
    const currentWeek = getCurrentWeek();
    start = currentWeek.start;
    end = currentWeek.end;
    console.log(`[INFO] Using current week: start=${start}, end=${end}`);
  } else {
    console.log(`[INFO] Query params: start=${start}, end=${end}`);
  }

  try {
    const rs = await db.execute({
      sql: QUERIES.GET_CLASSES,
      args: [start, end],
    });
    console.log('[SUCCESS] Classes retrieved successfully');
    res.json(rs.rows);
  } catch (err) {
    console.error('[ERROR] Error al obtener clases:', err);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/aulas', async (req: Request, res: Response) => {
  console.log('[ENDPOINT] GET /aulas');
  try {
    const rs = await db.execute({
      sql: QUERIES.GET_AULAS,
      args: [],
    });
    console.log('[SUCCESS] Aulas retrieved successfully');
    res.json(rs.rows);
  } catch (err) {
    console.error('[ERROR] Error al obtener aulas:', err);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/students', async (req: Request, res: Response) => {
  console.log('[ENDPOINT] GET /students');
  try {
    const rs = await db.execute({
      sql: QUERIES.GET_STUDENTS,
      args: [],
    });
    console.log('[SUCCESS] Students retrieved successfully');
    res.json(rs.rows);
  } catch (err) {
    console.error('[ERROR] Error al obtener alumnos:', err);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/add-student', async (req: Request, res: Response) => {
  console.log('[ENDPOINT] POST /add-student');
  const { name, phone, instrument } = req.body;
  console.log(`[INFO] Request body: name=${name}, phone=${phone}, instrument=${instrument}`);

  if (!name || !phone || !instrument) {
    console.warn('[WARNING] Missing required fields');
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son obligatorios',
    });
  }

  try {
    await db.execute({
      sql: QUERIES.ADD_STUDENT,
      args: [name, phone, instrument],
    });
    console.log('[SUCCESS] Student added successfully');
    res.json({ success: true });
  } catch (err) {
    console.error('[ERROR] Error al añadir alumno:', (err as Error).message);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

app.post('/add-class', async (req: Request, res: Response) => {
  console.log('[ENDPOINT] POST /add-class');
  const { student, classroom, datetime } = req.body;
  console.log(`[INFO] Request body: student=${student}, classroom=${classroom}, datetime=${datetime}`);

  try {
    await db.execute({
      sql: QUERIES.ADD_CLASS,
      args: [student, classroom, datetime],
    });
    console.log('[SUCCESS] Class added successfully');
    res.status(201).json({
      success: true,
      message: 'Clase añadida correctamente',
    });
  } catch (err) {
    console.error('[ERROR] Error al añadir la clase:', err);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

app.post('/update-class', async (req: Request, res: Response) => {
  console.log('[ENDPOINT] POST /update-class');
  const { idAlumno, idAula } = req.body;
  console.log(`[INFO] Request body: idAlumno=${idAlumno}, idAula=${idAula}`);

  try {
    await db.execute({
      sql: QUERIES.UPDATE_CLASS,
      args: [idAula, idAlumno],
    });
    console.log('[SUCCESS] Class updated successfully');
    res.json({ success: true });
  } catch (err) {
    console.error('[ERROR] Error al actualizar la clase:', (err as Error).message);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la clase',
    });
  }
});

app.get('/instruments', async (req: Request, res: Response) => {
  console.log('[ENDPOINT] GET /instruments');
  try {
    const rs = await db.execute({
      sql: QUERIES.GET_INSTRUMENTS,
      args: [],
    });
    console.log('[SUCCESS] Instruments retrieved successfully');
    res.json(rs.rows);
  } catch (err) {
    console.error('[ERROR] Error al obtener instrumentos:', (err as Error).message);
    res.status(500).send('Error interno del servidor');
  }
});

export default app;
