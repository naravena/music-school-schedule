# Music School Schedule

Este proyecto es una aplicación web para gestionar el horario de clases de una academia de música.

## Requisitos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)
- TypeScript

## Instalación

1. Clona este repositorio en tu máquina local:

    ```bash
    git clone https://github.com/tu-usuario/music-school-schedule.git
    cd music-school-schedule
    ```

2. Instala las dependencias del proyecto:

    ```bash
    npm install
    ```

3. Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables de entorno:

    ```env
    TURSO_DATABASE_URL=tu_database_url
    TURSO_AUTH_TOKEN=tu_auth_token
    PORT=3000 # Puedes cambiar el puerto si lo deseas
    ```

## Configuración de TypeScript

Este proyecto utiliza TypeScript. Asegúrate de tener `tsc` instalado globalmente:

```bash
npm install -g typescript
```

## Scripts de npm

### Compilar el proyecto

Para compilar el proyecto TypeScript a JavaScript, utiliza el siguiente comando:

```bash
npm run build
```

### Ejecutar el proyecto en desarrollo

Para iniciar el servidor en modo de desarrollo, utiliza el siguiente comando:

```bash
npm run dev
```

### Ejecutar el proyecto en producción

Para iniciar el servidor en modo de producción, utiliza el siguiente comando:

```bash
npm start
```

## Estructura del Proyecto

```
music-school-schedule/
├── node_modules/
├── public/
│   ├── index.html
│   ├── schedule.js
│   ├── styles.css
├── src/
│   ├── db.ts
│   ├── index.ts
│   ├── queries.ts
│   └── utils.ts
├── .env
├── package.json
├── tsconfig.json
└── ...
```

- `public/`: Contiene los archivos estáticos como HTML, CSS y JS.
- `src/`: Contiene los archivos TypeScript del servidor.
- `.env`: Archivo para las variables de entorno.
- `package.json`: Archivo de configuración de npm.
- `tsconfig.json`: Archivo de configuración de TypeScript.

## Endpoints

### GET `/`

Sirve la página principal del horario.

### GET `/clases`

Obtiene las clases dentro de un rango de fechas. Parámetros de consulta opcionales `start` y `end` (en formato `YYYY-MM-DD`).

### GET `/aulas`

Obtiene todas las aulas disponibles.

### GET `/students`

Obtiene todos los alumnos registrados.

### POST `/add-student`

Añade un nuevo alumno. El cuerpo de la solicitud debe contener `name`, `phone` e `instrument`.

### POST `/add-class`

Añade una nueva clase. El cuerpo de la solicitud debe contener `student`, `classroom` y `datetime`.

### POST `/update-class`

Actualiza la información de una clase existente. El cuerpo de la solicitud debe contener `idAlumno` e `idAula`.

### GET `/instruments`

Obtiene todos los instrumentos disponibles.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
```