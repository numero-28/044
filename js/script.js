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
        $('#layout4').hide();  
        $('#info-imgs').css('opacity','0');  
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
            const subcarpeta = imagen.split('/')[2]; 
            imgElement.setAttribute('data-tat', subcarpeta);

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


    $('#layout1 .ly1col img').on('mouseenter', function() {
        $('#info-imgs').css('opacity', '1'); 
        const subcarpeta = $(this).attr('data-tat');    
        $('#infotat').text(subcarpeta);
        
        const infodivs = $('.infodivs').toArray();
        const newOrder = [...infodivs];
        do {
            newOrder.sort(() => Math.random() - 0.5);
        } while (newOrder.some((div, index) => div === infodivs[index]));
        newOrder.forEach(div => $(div).parent().append(div));
    });

    $('#layout1 .ly1col img').on('mouseleave', function() {
        $('#info-imgs').css('opacity', '0');
    });



    // LAYOUT 2
    $('#ly2').click(function() {
        $('#layout2').show();
        $('#layout1').hide();
        $('#layout3').hide();
        $('#layout4').hide();  
        $('#info-imgs').css('opacity', '1');  

        $('#infotat').empty();
        const subcarpeta = $('#ly2img').attr('data-tat');
        $('#infotat').text(subcarpeta);
    })

    let currentIndex = 0;
    $('#ly2img').attr('src', imagenesRandom[currentIndex]);
    $('#ly2img').attr('data-tat', imagenesRandom[currentIndex].split('/')[2]);
    $('#infotat').text(imagenesRandom[currentIndex].split('/')[2]);

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
        const nuevaImagen = imagenesRandom[currentIndex];
        const subcarpeta = nuevaImagen.split('/')[2]; 

        $(this).attr('src', nuevaImagen);
        $(this).attr('data-tat', subcarpeta);

        $('#infotat').text(subcarpeta);
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



    // LAYOUT 3
    $('#ly3').click(function() {
        $('#layout3').show();
        $('#layout1').hide();
        $('#layout2').hide();
        $('#layout4').hide();  
        $('#info-imgs').css('opacity', '0');  
    })

    const numImagenes = 10;
    const indices = tatuadores.reduce((acc, tatuador) => {
        acc[tatuador] = 0;
        return acc;
    }, {});

    $('.tatuador').hover(
        function () {
            currentTatuador = $(this).data('tat');
            const index = indices[currentTatuador];
            const imagen = `${rutaBase}${currentTatuador}/imagen${index + 1}.jpg`; 
            $('#ly3img').attr('src', imagen).show();
        },
        function () {
            const index = indices[currentTatuador];
            indices[currentTatuador] = (index + 1) % numImagenes; 
            $('#ly3img').hide(); 
        }
    );


    // LAYOUT 4 

    // GALERÍA 
    $(function () {
    const container = $('#phototatscroll'), bigPhoto = $('#phototat img');
    const photos = $('#phototatscroll img');
    container.append(photos.clone()).scrollTop(0);

    container.on('scroll', function () {
        const scrollTop = container.scrollTop(), photoHeight = photos.first().outerHeight();
        const visibleIndex = Math.floor((scrollTop + container.height() / 2) / photoHeight) % photos.length;
        bigPhoto.attr('src', photos.eq(visibleIndex).attr('src'));

        if (scrollTop + container.height() >= container[0].scrollHeight) container.scrollTop(0);
        else if (scrollTop <= -1) container.scrollTop(container[0].scrollHeight - container.height());
        });
    });

// MODAL 

    const openModal = document.getElementById('openModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModal = document.getElementById('closeModal');
    

   // Abrir el modal con efecto de giro
    openModal.addEventListener('click', () => {
    modalOverlay.style.display = 'flex'; // Mostrar el modal
    setTimeout(() => {
        modalOverlay.classList.add('show'); // Aplicamos la clase 'show' para iniciar la animación
    }, 50); // Le damos un pequeño retraso para asegurar que el modal se muestra antes de que empiece la animación
    });
  
  // Cerrar el modal
    closeModal.addEventListener('click', () => {
    modalOverlay.classList.remove('show'); // Remover la clase 'show' para el efecto de cierre
    setTimeout(() => {
        modalOverlay.style.display = 'none'; // Ocultar el modal después de la animación
    }, 600); // Esperamos que termine la animación antes de esconder el modal
    });
  
  // Cerrar el modal al hacer clic fuera de él
    modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('show'); // Remover la clase 'show' para el efecto de cierre
        setTimeout(() => {
            modalOverlay.style.display = 'none'; // Ocultar el modal después de la animación
        }, 600); // Esperamos que termine la animación antes de esconder el modal
     }
    });
  
  // ARRAYS 
  const tatuador = [
    {
      id: "acid", name: "ACID AMBAR", cities: "CURRENTLY : <br>MADRID [ 09/01/25 - 27/03/25 ]  <br> SOON : <br>VALENCIA [ 01/04/25 - 07/04/25 ]", style: "[ STYLE ] NEW TRIBAL", handle: "@acid.ambar", email: "acid.ambar.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/acid/", logo: "media/044logo.svg"
    },
    {
      id: "nando", name: "NANDO DIABLO", cities: "CURRENTLY : <br>MADRID [ TILL 27/04/25 ]  <br> SOON : <br> PARIS BERLIN LONDON AMSTERDAM SWITZERLAND NY LA MEXICO", style: "[ STYLE ] NEW TRIBAL / BLACKWORK", handle: "@nando.diablo_", email: "nando.diablo.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/nando/", logo: "media/044logo.svg"
    },
    {
      id: "infrababy", name: "INFRABABY", cities: "CURRENTLY : <br>MADRID [ TILL 22/05/25 ]  <br> SOON : <br>LONDON", style: "[ STYLE ] TYPOGRAPHY / SURREALISM", handle: "@infrababy", email: "infrababy.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/infrababy/", logo: "media/044logo.svg"
    },
    {
      id: "nona", name: "NONA", cities: "CURRENTLY : <br>MADRID", style: "[ STYLE ] TRADITIONAL / ART NOUVEAU", handle: "@nona.tatt", email: "nona.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/nona/", logo: "media/044logo.svg"
    },
    {
      id: "santa.gemz", name: "SANTA GEMZZ", cities: "CURRENTLY : <br>MADRID <br> SOON : <br> BARCELONA", style: "[ STYLE ] TOOTH GEMS", handle: "@santagemzzz", email: "santagemzzz.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/santa.gemz/", logo: "media/044logo.svg"
    },
    {
      id: "zepa", name: "ZEPA", cities: "CURRENTLY : <br>MADRID <br> SOON : <br> NY [15/01/25 - 22/01/25]", style: "[ STYLE ] FINE LINE / LETTERING / TRADITIONAL", handle: "@zepa.ttt", email: "zepa.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/zepa/", logo: "media/044logo.svg"
    },
    {
      id: "alex.aramburu", name: "ALEX ARAMBURU", cities: "CURRENTLY : <br>MADRID", style: "[ STYLE ] ABSTRACT / LINE", handle: "@alex.a.aramburu", email: "aramburu.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/alex.aramburu/", logo: "media/044logo.svg"
    },
    {
      id: "elvira", name: "ELVIRA", cities: "CURRENTLY : <br>MADRID", style: "[ STYLE ] FINE LINE / REALISM", handle: "@elvirambarbara", email: "elvira.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/elvira/", logo: "media/044logo.svg"
    },
    {
      id: "galgo", name: "GALGO CANALLA", cities: "CURRENTLY : <br>MADRID", style: "[ STYLE ] NEO TRIBAL / ORNAMENTAL", handle: "@galgo.canalla", email: "galgo.canalla.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/galgo/", logo: "media/044logo.svg"
    }
  ];
  

});