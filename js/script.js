$(document).ready(function () {

    // arrays tatuadores y array de todo
    const tatuadores = ["acid", "alex.aramburu", "elvira", "galgo", "infrababy", "nando", "nona", "santa.gemz", "zepa"];
    const rutaBase = "./media/";

    const arraysTatuadores = tatuadores.map(tatuador => {
        const numImagenes = 10; 
        return Array.from({ length: numImagenes }, (_, i) => `${rutaBase}${tatuador}/imagen${i + 1}.jpg`);
    });

    const todas = arraysTatuadores.flat();



    // PARA LAYOUT 1
    // crear imagenes en las columnas para meter todas

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    const imagenesRandom = shuffle([...todas]);

  // Distribuir imágenes en columnas con márgenes dinámicos
  const ly1col = document.querySelectorAll('.ly1col');
  const numDivs = ly1col.length;
  const imgsPorDiv = Math.ceil(imagenesRandom.length / numDivs);

  ly1col.forEach((div, index) => {
      const inicio = index * imgsPorDiv;
      const fin = inicio + imgsPorDiv;
      const imgsEsteDiv = imagenesRandom.slice(inicio, fin);

      // Determinar velocidad de la columna
      let velocidad = 1; // Velocidad por defecto
      if (div.classList.contains('mid')) {
          velocidad = 0.7;
      } else if (div.classList.contains('slow')) {
          velocidad = 0.4;
      }

      // Añadir imágenes con márgenes dinámicos
      imgsEsteDiv.forEach(imagen => {
          const imgElement = document.createElement('img');
          imgElement.src = imagen;

          // Márgenes dinámicos según la velocidad
          const margenBase = velocidad * 10; // Base del margen
          const margenRandom = margenBase + Math.random() * 10; // Margen aleatorio adicional
          imgElement.style.marginBottom = `${margenRandom}rem`;

          div.appendChild(imgElement);
      });
  });

  // Calcular altura máxima de las columnas
  function calcularAlturaMaxima() {
      let alturaMaxima = 0;

      $('.ly1col').each(function () {
          const alturaColumna = $(this).outerHeight(true); // Altura total de la columna
          if (alturaColumna > alturaMaxima) {
              alturaMaxima = alturaColumna;
          }
      });

      // Ajustar la altura del contenedor principal para reflejar la altura máxima
      $('#layout1').css('height', `${alturaMaxima}px`);
      $('.ly1col').css('height', `${alturaMaxima}px`);

      return alturaMaxima;
  }

  const alturaMaxima = calcularAlturaMaxima();

  // Efecto parallax con altura fija y desplazamiento predefinido
    $(window).on('scroll', function () {
        const scrollTop = $(this).scrollTop(); // Posición actual del scroll
        const maxScroll = $(document).height() - $(window).height(); // Máximo desplazamiento del scroll

        $('.ly1col').each(function () {
            const $elemento = $(this); // Elemento actual
            let velocidad = 1; // Velocidad por defecto

            // Determinar la velocidad según la clase
            if ($elemento.hasClass('mid')) {
                velocidad = 0.7; // Velocidad media
            } else if ($elemento.hasClass('slow')) {
                velocidad = 0.4; // Velocidad lenta
            }

            // Calcular el desplazamiento relativo
            const desplazamiento = (scrollTop / maxScroll) * (alturaMaxima * (1 - velocidad));

            // Aplicar transformación visual
            $elemento.css('transform', `translateY(${desplazamiento}px)`);
        });
    });
});