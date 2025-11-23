async function cargarNoticias() {
  const contenedor = document.getElementById('noticias');
  contenedor.innerHTML = "<p>Cargando...</p>";

  //api de la noticias
  const apiKey = process.env.NEWS_API_KEY;
  const urlNews = `https://newsdata.io/api/1/latest?apikey=${apiKey}&q=espn`;

  const res = await fetch(urlNews);
  const data = await res.json();
  const noticia = data.results && data.results.length > 0 ? data.results[0] : null;

  //resultado de varios deportes (NFL, NBA, Liga MX, LaLiga)
  const ligas = [
    "football/nfl",
    "basketball/nba",
    "soccer/mex.1",
    "soccer/mex.2",
    "soccer/esp.1",
    "soccer/esp.2"
  ];

  //funcion para limitar el texto de la noticia
  function recortarTexto(texto, maxLength) {
  if (!texto) return ""; //si el texto está vacío o indefinido
  return texto.length > maxLength 
    ? texto.substring(0, maxLength).trim() + "..." 
    : texto;
}

  //api para ver los resultados de los partidos de espn
  const baseESPN = "https://site.api.espn.com/apis/site/v2/sports/";

  const peticiones = ligas.map(async liga => {
    const res = await fetch(`${baseESPN}${liga}/scoreboard`);
    const data = await res.json();
    //se encarga de mostrar las noticias que quieras
    //y tambien de mostrar los marcadores, resultados, juegos, partidos.
    return (data.events || []).slice(0, 1).map(e => ({
      liga: e.competitions?.[0]?.competitors?.[0]?.team?.displayName?.includes("FC") ? "Fútbol" : liga.split('/')[1].toUpperCase(),
      nombre: e.name,
      estado: e.status?.type?.shortDetail,
      equipo1: e.competitions?.[0]?.competitors?.[0]?.team?.displayName,
      equipo2: e.competitions?.[0]?.competitors?.[1]?.team?.displayName,
      marcador1: e.competitions?.[0]?.competitors?.[0]?.score,
      marcador2: e.competitions?.[0]?.competitors?.[1]?.score
    }));
  });

  const resultados = (await Promise.all(peticiones)).flat();

  //noticia principal
  let html = "";

  if (noticia) {
    html += `
      <article style="max-width:90%; margin:20px auto; padding:15px; background:#fff; border-radius:20px; box-shadow:0 0 15px #ffffff33;">
        ${noticia.image_url ? `<img src="${noticia.image_url}" alt="Imagen noticia" style="width:100%; height:400px; object-fit:cover; border-radius:20px; margin-bottom:10px;">` : ''}
        <h3 style="font-size: 23px; font-family: Arial; color: #000; margin-bottom: 10px;">${noticia.title}</h3>
        <p style="font-size: 17px; font-family: Arial; color: #333;">${recortarTexto(noticia.description, 100)}</p> //numero de caracteres que permites
        <button class="btn-vermas" onclick="window.open('${noticia.link}', '_blank')">Leer más</button>
      </article>
    `;
  } else {
    html += '<p style="text-align: center;">No hay noticias disponibles ahora mismo...</p>';
  }

  //resultados de partidos
  if (resultados.length > 0) {
    html += `
      <div style="max-width:40%; font-size: 15px; margin:10px auto; background:#11111199; padding:15px; border-radius:15px; color:#fff;">
        <h4 style="margin-bottom:10px;">Resultados recientes.</h4>
        ${resultados.map(r => `
          <div style="display:flex; justify-content:space-between; background:#222; padding:8px; border-radius:10px; margin-bottom:5px;">
            <span>${r.equipo1} ${r.marcador1} - ${r.marcador2} ${r.equipo2}</span>
            <span style="color:#ccc;">${r.estado}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  contenedor.innerHTML = html;
}

cargarNoticias();

