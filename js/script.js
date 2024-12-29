$(document).ready(function () {

    // arrays tatuadores y array de todo
    const tatuadores = ["acid", "alex.aramburu", "elvira", "galgo", "infrababy", "nando", "nona", "santa.gemz", "zepa"];
    const rutaBase = "./media/";

    const arraysTatuadores = tatuadores.map(tatuador => {
        const numImagenes = 10; 
        return Array.from({ length: numImagenes }, (_, i) => `${rutaBase}${tatuador}/imagen${i + 1}.jpg`);
    });

    const todas = arraysTatuadores.flat();

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    const imagenesRandom = shuffle([...todas]);


    // PARA LAYOUT 1
    $('#ly1').click(function() {
        $('#layout1').show();
        $('#layout2').hide();
        $('#layout3').hide();
    })
    // crear imagenes en las columnas para meter todas



    gsap.registerPlugin(ScrollTrigger);
    // Distribuir imágenes en columnas con márgenes dinámicos
    const ly1col = document.querySelectorAll('.ly1col');
    const numDivs = ly1col.length;
    const imgsPorDiv = Math.ceil(imagenesRandom.length / numDivs); // Distribuir las imágenes en columnas

    // Calcular la cantidad de imágenes necesarias para cada columna basada en su velocidad
    function calcularNumeroDeImagenesPorColumna(velocidad, imgsPorDiv) {
        return Math.ceil(imgsPorDiv * (1 / velocidad)); // Menos imágenes para las columnas lentas
    }

    // Distribuir imágenes y asignarles márgenes aleatorios
    ly1col.forEach((div, index) => {
        const velocidad = (div.classList.contains('fast')) ? 1.6 : 
                        (div.classList.contains('mid')) ? 1.3 : 1; // Ajustamos la velocidad según la clase

        const numImágenesColumna = calcularNumeroDeImagenesPorColumna(velocidad, imgsPorDiv);
        const imgsEsteDiv = imagenesRandom.slice(index * imgsPorDiv, index * imgsPorDiv + numImágenesColumna);

        // Añadir imágenes con márgenes aleatorios
        imgsEsteDiv.forEach(imagen => {
            const imgElement = document.createElement('img');
            imgElement.src = imagen;

            // Márgenes aleatorios entre 10 y 26 rem
            const margenRandom = 10 + Math.random() * 16; // Margen entre 10 y 26 rem
            imgElement.style.marginBottom = `${margenRandom}rem`;

            div.appendChild(imgElement);
        });
    });

    // Crear animación parallax con GSAP
    ly1col.forEach(columna => {
        let velocidad = 1;

        // Determinar la velocidad según la clase
        if (columna.classList.contains('mid')) {
            velocidad = 1.3; // Más lenta
        } else if (columna.classList.contains('fast')) {
            velocidad = 1.6; // Aún más lenta
        } else {
            velocidad = 1; // Rápida (por defecto)
        }

        // Configurar efecto parallax
        gsap.to(columna, {
            y: (index) => {
            // Obtén la altura total de la columna
            const alturaColumna = columna.scrollHeight;
            // Calcular el desplazamiento basado en la velocidad y el tamaño de la columna
            return alturaColumna * (1 - velocidad); // Este valor ajustará el desplazamiento según la velocidad
        },
            ease: "none", // Sin easing para un movimiento constante
            scrollTrigger: {
                trigger: columna, // Elemento disparador
                start: "top bottom", // Inicia cuando la parte superior de la columna entra en pantalla
                end: "bottom top", // Termina cuando la parte inferior de la columna sale de pantalla
                scrub: true, // Sincroniza el movimiento con el scroll
            },
        });
    });


    // LAYOUT 2
    $('#ly2').click(function() {
        $('#layout2').show();
        $('#layout1').hide();
        $('#layout3').hide();
    })

    let currentIndex = 0;
    $('#ly2img').attr('src', imagenesRandom[currentIndex]);
    $('#ly2img').on('click', function(e) {
        const imageWidth = $(this).width();
        const clickPosition = e.pageX - $(this).offset().left;

        const infodivs = $('.infodivs').toArray();
        const newOrder = [...infodivs];
        
        if (clickPosition < imageWidth * 0.3) {
            currentIndex = (currentIndex - 1 + imagenesRandom.length) % imagenesRandom.length;
        } else if (clickPosition > imageWidth * 0.7) {
            currentIndex = (currentIndex + 1) % imagenesRandom.length;
        } else {
            return;
        }

        do {
            newOrder.sort(() => Math.random() - 0.5);
        } while (newOrder.some((div, index) => div === infodivs[index]));
        
        newOrder.forEach(div => $(div).parent().append(div));
        $(this).attr('src', imagenesRandom[currentIndex]);
    });

    $(document).mousemove(function(event) {
        var anchoPantalla = $(window).width();
        var posicionX = event.pageX;

        if (posicionX < anchoPantalla * 0.3) {
            $('#layout2').css('cursor', 'url(media/prev.png), auto');
        } else if (posicionX >= anchoPantalla * 0.3 && posicionX <= anchoPantalla * 0.7) {
            $('#layout2').css('cursor', 'url(media/ink.png), auto');
        } else {
            $('#layout2').css('cursor', 'url(media/next.png), auto');
        }
    });


});