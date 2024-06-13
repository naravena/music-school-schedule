import express, { Request, Response } from 'express';
import path from 'path';
import { db } from './db';
import { QUERIES } from './queries';
import { getCurrentWeek } from './utils';

const app = express();

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.json()); // Para parsear JSON en las peticiones POST

console.log(path.join(__dirname, '..', 'public', 'index.html'))
// Ruta para el endpoint raíz ('/')
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/clases', async (req: Request, res: Response) => {
  let { start, end } = req.query as { start?: string; end?: string };

  if (!start || !end) {
    const currentWeek = getCurrentWeek();
    start = currentWeek.start;
    end = currentWeek.end;
  }

  try {
    const rs = await db.execute({
      sql: QUERIES.GET_CLASSES,
      args: [start, end],
    });

    res.json(rs.rows);
  } catch (err) {
    console.error('Error al obtener clases:', err);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/aulas', async (req: Request, res: Response) => {
  try {
    const rs = await db.execute({
      sql: QUERIES.GET_AULAS,
      args: [],
    });

    res.json(rs.rows);
  } catch (err) {
    console.error('Error al obtener aulas:', err);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/students', async (req: Request, res: Response) => {
  try {
    const rs = await db.execute({
      sql: QUERIES.GET_STUDENTS,
      args: [],
    });

    res.json(rs.rows);
  } catch (err) {
    console.error('Error al obtener alumnos:', err);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/add-student', async (req: Request, res: Response) => {
  const { name, phone, instrument } = req.body;

  if (!name || !phone || !instrument) {
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

    res.json({ success: true });
  } catch (err) {
    console.error('Error al añadir alumno:', (err as Error).message);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

app.post('/add-class', async (req: Request, res: Response) => {
  const { student, classroom, datetime } = req.body;

  try {
    await db.execute({
      sql: QUERIES.ADD_CLASS,
      args: [student, classroom, datetime],
    });

    res.status(201).json({
      success: true,
      message: 'Clase añadida correctamente',
    });
  } catch (err) {
    console.error('Error al añadir la clase:', err);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

app.post('/update-class', async (req: Request, res: Response) => {
  const { idAlumno, idAula } = req.body;

  try {
    await db.execute({
      sql: QUERIES.UPDATE_CLASS,
      args: [idAula, idAlumno],
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Error al actualizar la clase:', (err as Error).message);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la clase',
    });
  }
});

app.get('/instruments', async (req: Request, res: Response) => {
  try {
    const rs = await db.execute({
      sql: QUERIES.GET_INSTRUMENTS,
      args: [],
    });

    res.json(rs.rows);
  } catch (err) {
    console.error('Error al obtener instrumentos:', (err as Error).message);
    res.status(500).send('Error interno del servidor');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo http://localhost:${PORT}`);
});

export default app;