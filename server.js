const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// "Base de datos" simple en JSON
const DB_PATH = path.join(__dirname, "turnos.json");

function leerTurnos() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
    return [];
  }
  const raw = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(raw);
}

function guardarTurnos(turnos) {
  fs.writeFileSync(DB_PATH, JSON.stringify(turnos, null, 2));
}

// 👉 Obtener turnos ocupados
app.get("/api/turnos", (req, res) => {
  try {
    const turnos = leerTurnos();
    res.json(turnos);
  } catch (e) {
    console.error("Error leyendo turnos:", e);
    res.status(500).json({ error: "No se pudieron leer los turnos" });
  }
});

// 👉 Guardar turno (bloquea duplicados)
app.post("/api/turnos", (req, res) => {
  try {
    const { year, mes, dia, servicios } = req.body;

    if (!year || !mes || !dia) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const key = `${year}-${mes}-${dia}`;
    const turnos = leerTurnos();

    const yaExiste = turnos.find(t => t.key === key);
    if (yaExiste) {
      return res.status(409).json({ error: "Turno ya reservado" });
    }

    const nuevoTurno = {
      key,
      year,
      mes,
      dia,
      servicios: servicios || [],
      createdAt: new Date().toISOString()
    };

    turnos.push(nuevoTurno);
    guardarTurnos(turnos);

    res.json({ ok: true, turno: nuevoTurno });
  } catch (e) {
    console.error("Error guardando turno:", e);
    res.status(500).json({ error: "No se pudo guardar el turno" });
  }
});

// 👉 Fallback para SPA / rutas directas
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 👉 Arranque del server (Railway usa process.env.PORT)
app.listen(PORT, () => {
  console.log("Servidor listo en puerto:", PORT);
});
