const carrusel = document.getElementById('carrusel');
  const up = document.getElementById('up');
  const down = document.getElementById('down');
  const scrollAmount = carrusel.clientHeight;

  down.addEventListener('click', () => {
    carrusel.scrollBy({ top: scrollAmount, behavior: 'smooth' });
  });

  up.addEventListener('click', () => {
    carrusel.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
  });
