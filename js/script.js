$(document).ready(function () {

    // arrays tatuadores y array de todo
    const tatuadores = ["acid.ambar", "alex.a.aramburu", "elvirambarbara", "galgocanalla", "infrababy", "nando.diablo_", "nona.tatt", "santagemzz", "zepa.ttt"];
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

    ly1col.forEach((div, index) => {
        const velocidad = (div.classList.contains('fast')) ? 1.6 :
                          (div.classList.contains('mid')) ? 1.3 : 1; // Ajustamos la velocidad según la clase
    
        const imgsEsteDiv = imagenesRandom.slice(index * imgsPorDiv, (index + 1) * imgsPorDiv);
    
        imgsEsteDiv.forEach((imagen, imgIndex) => {
            const imgElement = document.createElement('img');
            imgElement.src = imagen;
    
            // Extraemos la subcarpeta para el atributo `data-tat`
            const subcarpeta = imagen.split('/')[2];
            imgElement.setAttribute('data-tat', subcarpeta);
    
            // Márgenes dinámicos en función de la velocidad
            const margenBase = 10; // Mínimo margen (en rem)
            const margenVariable = 16 / velocidad; // Márgenes reducidos para columnas rápidas
            const margenRandom = (imgIndex === 0) ? 0 : margenBase + Math.random() * margenVariable;
    
            imgElement.style.marginBottom = `${margenRandom}rem`;
    
            div.appendChild(imgElement);
        });
    });


    ly1col.forEach(columna => duplicarContenidoColumna(columna));


    // Ajustar las animaciones GSAP para cada columna
    ly1col.forEach(columna => {
        let velocidad = 1;

        if (columna.classList.contains('mid')) {
            velocidad = 1.3;
        } else if (columna.classList.contains('fast')) {
            velocidad = 1.6;
        }

        const alturaColumna = columna.scrollHeight / 2; // Altura del conjunto original (sin duplicado)

        // Crear el efecto de desplazamiento infinito
        gsap.to(columna, {
            y: () => -(alturaColumna * (velocidad - 1)), // Ajustar desplazamiento según la velocidad
            ease: "none",
            repeat: -1, // Loop infinito
            scrollTrigger: {
                trigger: columna,
                start: "top bottom",
                end: `+=${alturaColumna}`, // Duración basada en la altura del conjunto original
                scrub: true, // Sincronizar con el scroll
                onUpdate: self => {
                    // Reiniciar posición cuando el scroll llega al final
                    if (self.progress === 1) {
                        self.scroll(self.start); // Volver al inicio
                    }
                },
                invalidateOnRefresh: true, // Recalcular al actualizar el contenido o cambiar el tamaño
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
    

});