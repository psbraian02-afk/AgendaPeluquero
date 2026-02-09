const res = await fetch("/api/turnos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nombre, fecha, hora })
});

const data = await res.json();

if (res.ok) {
  msg.textContent = "✅ Turno reservado con éxito";
  msg.style.color = "#9cff9c";
  form.reset();
} else {
  if (data.error === "Horario ya ocupado") {
    msg.textContent = "❌ Ese horario ya está ocupado, elegí otro";
  } else {
    msg.textContent = "❌ Error al reservar turno";
  }
  msg.style.color = "#ff9c9c";
}
