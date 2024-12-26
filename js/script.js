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
    const ly1col = document.querySelectorAll('.ly1col');
    const numDivs = ly1col.length;
    const imgsPorDiv = Math.ceil(imagenesRandom.length / numDivs);

    ly1col.forEach((div, index) => {
        const inicio = index * imgsPorDiv;
        const fin = inicio + imgsPorDiv;
        const imgsEsteDiv = imagenesRandom.slice(inicio, fin);

        imgsEsteDiv.forEach(imagen => {
            const imgElement = document.createElement('img');
            imgElement.src = imagen;
            if (Math.random() > 0.3) { // 30% chance de aplicar el margen
                const randomMargin = `${10 + Math.random() * (26-10)}rem`; // Entre 10 y 20rem
                imgElement.style.marginBottom = randomMargin;
            }
            div.appendChild(imgElement);
        });
    });

    $(window).on('scroll', function () {
    const scrollTop = $(this).scrollTop(); // Obtener la posición actual del scroll

    $('.ly1col').each(function () {
        const $elemento = $(this); // El elemento actual
        let velocidad = 1; // Velocidad por defecto (fast)

        // Determinar la velocidad según la clase
        if ($elemento.hasClass('mid')) {
            velocidad = 0.7; // Velocidad al 70%
        } else if ($elemento.hasClass('slow')) {
            velocidad = 0.4; // Velocidad al 40%
        }

        // Calcular el desplazamiento y aplicar la transformación
        const desplazamiento = scrollTop * velocidad;
        $elemento.css('transform', `translateY(${desplazamiento}px)`);
    });
});


});