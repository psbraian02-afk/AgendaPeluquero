document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("listaTurnos");
  const btnVolver = document.getElementById("btnVolver");

  btnVolver.addEventListener("click", () => {
    window.location.href = "/";
  });

  try {
    const res = await fetch("/api/turnos");
    const turnos = await res.json();

    if (!turnos.length) {
      lista.innerHTML = "<p>No hay turnos reservados todavía.</p>";
      return;
    }

    lista.innerHTML = "";

    turnos.forEach(t => {
      const div = document.createElement("div");
      div.className = "turno";

      div.innerHTML = `
        <div class="turno-info">
          <strong>${t.nombre}</strong><br>
          <span class="turno-fecha">${t.fecha} – ${t.hora}</span>
        </div>
      `;

      lista.appendChild(div);
    });
  } catch (err) {
    lista.innerHTML = "<p>Error cargando los turnos.</p>";
  }
});
