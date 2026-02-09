const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const fssync = require("fs");
const { v4: uuidv4 } = require("uuid");
const compression = require("compression");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Ruta home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ====== (Preparado para futuro: turnos) ======
// Archivo donde después vas a guardar turnos
const DATA_PATH = path.join(__dirname, "data");
const TURNOS_FILE = path.join(DATA_PATH, "turnos.json");

// Crear carpeta /data si no existe
if (!fssync.existsSync(DATA_PATH)) {
  fssync.mkdirSync(DATA_PATH);
}

// Crear turnos.json si no existe
if (!fssync.existsSync(TURNOS_FILE)) {
  fssync.writeFileSync(TURNOS_FILE, JSON.stringify([]));
}

// Endpoint para obtener turnos (para cuando armemos agenda.html)
app.get("/api/turnos", async (req, res) => {
  try {
    const data = await fs.readFile(TURNOS_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Error leyendo turnos" });
  }
});

// Endpoint para crear turno
app.post("/api/turnos", async (req, res) => {
  try {
    const { nombre, fecha, hora } = req.body;

    if (!nombre || !fecha || !hora) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const data = await fs.readFile(TURNOS_FILE, "utf-8");
    const turnos = JSON.parse(data);

    const nuevoTurno = {
      id: uuidv4(),
      nombre,
      fecha,
      hora,
      creado: new Date().toISOString()
    };

    turnos.push(nuevoTurno);
    await fs.writeFile(TURNOS_FILE, JSON.stringify(turnos, null, 2));

    res.json({ ok: true, turno: nuevoTurno });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error guardando turno" });
  }
});

// Levantar servidor
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
