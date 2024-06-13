export const QUERIES = {
    GET_CLASSES: `
      SELECT Alumno.id_alumno, Alumno.nombre, Alumno.telefono, Aula.desc_aula, strftime('%Y-%m-%d %H:%M:%S', Clase.fecha) AS fecha
      FROM Clase
      JOIN Alumno ON Clase.id_alumno = Alumno.id_alumno
      JOIN Aula ON Clase.id_aula = Aula.id_aula
      WHERE Clase.fecha BETWEEN ? AND ?
    `,
    GET_AULAS: "SELECT * FROM Aula ORDER BY desc_aula ASC",
    GET_STUDENTS: "SELECT * FROM Alumno ORDER BY nombre ASC",
    ADD_STUDENT: "INSERT INTO Alumno (nombre, telefono) VALUES (?, ?)",
    ADD_CLASS: "INSERT INTO Clase (id_alumno, id_aula, fecha) VALUES (?, ?, ?)",
    UPDATE_CLASS: "UPDATE Clase SET id_aula = ? WHERE id_alumno = ?",
    GET_INSTRUMENTS: "SELECT id_instrumento, desc_instrumento FROM Instrumentos"
  };