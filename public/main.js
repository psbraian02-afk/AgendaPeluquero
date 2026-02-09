document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll("[data-link]");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const pagina = btn.getAttribute("data-link");
      window.location.href = pagina;
    });
  });
});
