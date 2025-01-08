$(document).ready(function () {

    // 3D landing
    function getMouse(e) {
        return [
            e.clientX, // Coordenada X del ratón
            e.clientY  // Coordenada Y del ratón
        ]
    }
    
    document.onmousemove = function(e) {
        const mouse = getMouse(e);  // Obtener la posición del ratón
        const modelViewer = document.querySelector("#myModel");
    
        // Calcular los ángulos según la posición del ratón
        // Ajustamos los ángulos para que no haya límites rígidos y haya un rango más natural.
        const horizontalAngle = (mouse[0] / window.innerWidth) * 270;  // Ángulo horizontal (0 a 360)
        const verticalAngle = ((mouse[1] / window.innerHeight) * 180) - 90;  // Ángulo vertical (-90 a 90)
    
        // Aseguramos que los ángulos estén dentro de los rangos válidos para evitar problemas con la cámara
        const clampedVerticalAngle = Math.max(-120, Math.min(-100, verticalAngle));  // Limitar la rotación vertical entre -89 y 89 grados
        
        // Actualizar la cámara para que siga la posición del ratón
        modelViewer.cameraOrbit = `${horizontalAngle}deg ${clampedVerticalAngle}deg 110%`;
    };


    // arrays tatuadores y array de todo
    const tatuadores = ["acid.ambar", "alex.a.aramburu", "elvirambarbara", "galgocanalla", "infrababy", "nando.diablo_", "nona.tatt", "santagemzz", "zepa.ttt"];
    const rutaBase = "./media/";
  
    const arraysTatuadores = tatuadores.map(tatuador => {
        const numImagenes = 10; 
        return Array.from({ length: numImagenes }, (_, i) => `${rutaBase}${tatuador}/imagen${i + 1}.jpg`);
    });

    const tatuadorImagenes = tatuadores.reduce((acc, tatuador, index) => {
        acc[tatuador] = arraysTatuadores[index];
        return acc;
    }, {});


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

    gsap.registerPlugin(ScrollTrigger);
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
            imgElement.style.position = `relative`;

            div.appendChild(imgElement);
        });
    });


    // Crear animación parallax con GSAP
    ly1col.forEach(columna => {
        let velocidad = 1;

        // Determinar la velocidad según la clase
        if (columna.classList.contains('mid')) {
            velocidad = 1.3;
        } else if (columna.classList.contains('fast')) {
            velocidad = 1.6; 
        } else {
            velocidad = 1; 
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
        const ly1col = document.querySelectorAll('.ly1col');

// Registrar en la consola la altura de cada elemento
ly1col.forEach((columna, index) => {
    console.log(`Altura de ly1col[${index}]: ${columna.scrollHeight}px`);
});
    });




    $('#layout1 .ly1col img').on('mouseenter', function() {
        $('.infodivs').css('opacity', '1'); 
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
        $('.infodivs').css('opacity', '0');
    });

    

    // LAYOUT 2

    let currentIndex = 0;
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
    
    const numImagenes = 10;
    const indices = tatuadores.reduce((acc, tatuador) => {
        acc[tatuador] = 0;
        return acc;
    }, {});

    $('.tatuador').hover(
        function () {
            $('#ly3img').css('opacity', '1')
            $("#layout2").hide();
            $("#layout2 > div").css({
                "width": "",
                "margin-left": "",
                "margin-right": ""
            });
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




    // TRANSICIONES :)

    $("#ly1").on("click", function () {
        if ($("#layout2").is(":visible")) {
            ly2ToLy1();
        } else if ($("#layout3").is(":visible")) {
            ly3ToLy1();
        }
        hideUs();
    });

    $("#ly2").on("click", function () {
        if ($("#layout1").is(":visible")) {
            ly1ToLy2();
        } else if ($("#layout3").is(":visible")) {
            ly3ToLy2();
        }
        hideUs();
    });

    $("#ly3").on("click", function () {
        if ($("#layout1").is(":visible")) {
            ly1ToLy3();
        } else if ($("#layout2").is(":visible")) {
            ly2ToLy3();
        }
        hideUs();
    });

   

    // LAYOUT 1 a LAYOUT 2
    function ly1ToLy2() {
        let chosenimg;  
        $('#info-imgs').css('opacity', '0');
        $('body').css('overflow', 'hidden');

        let visibleImages = $("#center img").filter(function () {
            const rect = this.getBoundingClientRect();
            return rect.bottom >= 0 && rect.top <= window.innerHeight;
        });

        chosenimg = visibleImages
            .toArray()
            .reduce((closest, img) => {
                const rect = img.getBoundingClientRect();
                const imgCenter = (rect.top + rect.bottom) / 2; 
                const screenCenter = window.innerHeight / 2;  
                const distanceToCenter = Math.abs(imgCenter - screenCenter);

                if (!closest || distanceToCenter < closest.distance) {
                    return { img, distance: distanceToCenter };
                }
                return closest;
            }, null)?.img;

        if (chosenimg) {
            chosenimg = $(chosenimg); 
        }

        let allImages = $(".ly1col img").not(chosenimg);
        let shuffledImages = allImages.toArray().sort(() => Math.random() - 0.5); 
        let groups = [];
        let groupSize = Math.ceil(shuffledImages.length / 6);

        for (let i = 0; i < 10; i++) {
            groups.push(shuffledImages.slice(i * groupSize, (i + 1) * groupSize));
        }

        groups.forEach((group, index) => {
            setTimeout(() => {
                $(group).animate({ opacity: 0 }, 200);
            }, index * 200); 
        });

        setTimeout(() => {
            let viewportWidth = $(window).width();
            let viewportHeight = $(window).height();

            let viewportCenterX = viewportWidth / 2;
            let viewportCenterY = viewportHeight / 2;
            
            let chosenimgRect = chosenimg[0].getBoundingClientRect();
            let chosenimgCenterX = chosenimgRect.left + (chosenimgRect.width / 2);
            let chosenimgCenterY = chosenimgRect.top + (chosenimgRect.height / 2);

            let translateX = viewportCenterX - chosenimgCenterX;
            let translateY = viewportCenterY - chosenimgCenterY;

            chosenimg.css({
                transformOrigin: "center center", 
                transition: "transform 0.6s ease",
                transform: `translate(${translateX}px, ${translateY}px)`
            });

            setTimeout(() => {
                let scaleFactor = viewportWidth / chosenimgRect.width;

                chosenimg.css({
                    transition: "transform 0.8s ease",
                    transform: `translate(${translateX}px, ${translateY}px) scale(${scaleFactor})` 
                });
            }, 600); 
        }, 1400);

        setTimeout(() => {
            $("#ly2img").attr("src", chosenimg.attr("src"));
            $("#ly2img").attr("data-tat", chosenimg.attr("data-tat"));
            currentIndex = imagenesRandom.findIndex(img => img === chosenimg.attr("src"));
            const imagePath = chosenimg.attr("src");
            const pathParts = imagePath.split('/');
            const subcarpeta = pathParts[pathParts.length - 2]; 
            $('#infotat').empty();
            $('#infotat').text(subcarpeta); 
            $("#layout2").show();
            
            let infodivs = $(".infodivs").toArray();
            let shuffledDivs = infodivs.sort(() => Math.random() - 0.5);

            shuffledDivs.forEach((div, index) => {
                setTimeout(() => {
                    $(div).animate({ opacity: 1 }, 200);
                }, index * 300);
            });

            setTimeout(() => {
                chosenimg.css({
                    transform: `` 
                });
                $("#layout1").hide();
                $('#info-imgs').css('opacity', '1');
                $('body').css('overflow', '');
            }, 500);
        }, 2900);
    }    


    // LAYOUT 2 a LAYOUT 1
    function ly2ToLy1() {

        const infodivs = $(".infodivs").toArray();
        infodivs.forEach((div, index) => {
            setTimeout(() => {
                $(div).animate({ opacity: 0 }, 200);
            }, index * 200);
        });

        setTimeout(() => {
            let viewportWidth = $(window).width();
            let margin = 1.3 * parseFloat(getComputedStyle(document.documentElement).fontSize);
            let squareWidth = (viewportWidth / 6) - (2 * margin);
            $("#ly2img").css({
                "width": squareWidth + "px",
                "transition": "width 0.8s ease",
                "margin-left": "auto",
                "margin-right": "auto",
                "display": "block"
            });
        }, 1200);

        setTimeout(() => {
            $("#layout1").show();

            const ly2imgSrc = $("#ly2img").attr("src");
            const centerDiv = $("#center");
            const newFirstImage = document.createElement("img");
            newFirstImage.src = ly2imgSrc;
            newFirstImage.style.position = "relative";
            newFirstImage.style.display = "block";
            newFirstImage.style.marginBottom = "18rem"; 
            centerDiv.prepend(newFirstImage);

            let allImages = $(".ly1col img").toArray();
            let shuffledImages = allImages.sort(() => Math.random() - 0.5);
            let groups = [];
            let groupSize = Math.ceil(shuffledImages.length / 6);

            for (let i = 0; i < 6; i++) {
                groups.push(shuffledImages.slice(i * groupSize, (i + 1) * groupSize));
            }

            groups.forEach((group, index) => {
                setTimeout(() => {
                    $(group).animate({ opacity: 1 }, 200);
                }, index * 200);
            });
        }, 2000);

        setTimeout(() => {
            $("#layout2").hide();
            $("#ly2img").css({
                "width": "",
                "margin-left": "",
                "margin-right": "",
                "display": ""
            });
        }, 3500);
    }



    // LAYOUT 2 a LAYOUT 3
    function ly2ToLy3() {

        const infodivs = $(".infodivs").toArray();
        infodivs.forEach((div, index) => {
            setTimeout(() => {
                $(div).animate({ opacity: 0 }, 200);
            }, index * 200);
        });

        setTimeout(() => {
            $("#layout2 > div").css({
                "width": "20%",
                "transition": "width 0.8s ease",
                "margin-left": "auto",
                "margin-right": "auto",
            });
        }, 1200);

        setTimeout(() => {
            $('#layout3').show();
            let tatuadores = $(".tatuador").toArray();
            let shuffledTats = tatuadores.sort(() => Math.random() - 0.5);
            shuffledTats.forEach((div, index) => {
                setTimeout(() => {
                    $(div).animate({ opacity: 1 }, 200);
                }, index * 200);
            });
        }, 2000);
    }



    // LAYOUT 3 a LAYOUT 2
    function ly3ToLy2() {
        if (!$('#ly2img').attr('src')) {
            let currentIndex = 0;
            $('#ly2img').attr('src', imagenesRandom[currentIndex]);
            $('#ly2img').attr('data-tat', imagenesRandom[currentIndex].split('/')[2]);
            $('#infotat').text(imagenesRandom[currentIndex].split('/')[2]);
        }

        $('#layout2 > div').css('opacity', '0');
        let tatuadores = $(".tatuador").toArray();
        let shuffledTats = tatuadores.sort(() => Math.random() - 0.5);
        shuffledTats.forEach((div, index) => {
            setTimeout(() => {
                $(div).animate({ opacity: 0 }, 200);
            }, index * 200);
        });

        setTimeout(() => {
            $('#layout3').hide();
            $('#layout2').show();
           
        }, 2000);

        setTimeout(() => {
             $('#layout2 > div').css('opacity', '1');
            $('#layout2 > div').css("transition", "opacity 1s ease");
        }, 2300);

        setTimeout(() => {
            const infodivs = $(".infodivs").toArray();
            infodivs.forEach((div, index) => {
                setTimeout(() => {
                    $(div).animate({ opacity: 1 }, 200);
                }, index * 300);
            });        
        }, 3000);
    }



    // LAYOUT 1 a LAYOUT 3
    function ly1ToLy3() {

        let allImages = $(".ly1col img");
        let shuffledImages = allImages.toArray().sort(() => Math.random() - 0.5); 
        let groups = [];
        let groupSize = Math.ceil(shuffledImages.length / 6);

        for (let i = 0; i < 10; i++) {
            groups.push(shuffledImages.slice(i * groupSize, (i + 1) * groupSize));
        }

        groups.forEach((group, index) => {
            setTimeout(() => {
                $(group).animate({ opacity: 0 }, 200);
            }, index * 200); 
        });

        setTimeout(() => {
            $('#layout1').hide();
            $('#layout3').show();
            let tatuadores = $(".tatuador").toArray();
            let shuffledTats = tatuadores.sort(() => Math.random() - 0.5);
            shuffledTats.forEach((div, index) => {
                setTimeout(() => {
                    $(div).animate({ opacity: 1 }, 200);
                }, index * 200);
            });
        }, 1600);
    }



    // LAYOUT 3 a LAYOUT 1
    function ly3ToLy1() {

        let tatuadores = $(".tatuador").toArray();
        let shuffledTats = tatuadores.sort(() => Math.random() - 0.5);
        shuffledTats.forEach((div, index) => {
            setTimeout(() => {
                $(div).animate({ opacity: 0 }, 200);
            }, index * 200);
        });

        setTimeout(() => {
            $("#layout1").show();
            $("#layout3").hide();

            let allImages = $(".ly1col img").toArray();
            let shuffledImages = allImages.sort(() => Math.random() - 0.5);
            let groups = [];
            let groupSize = Math.ceil(shuffledImages.length / 6);

            for (let i = 0; i < 6; i++) {
                groups.push(shuffledImages.slice(i * groupSize, (i + 1) * groupSize));
            }

            groups.forEach((group, index) => {
                setTimeout(() => {
                    $(group).animate({ opacity: 1 }, 200);
                }, index * 200);
            });
        }, 2000);

    }



    // US
    $('#us-bt').click(function() {
        $('body').css('overflow', 'hidden');
        $('#us').show();
        
        setTimeout(() => {
            $('#us-video').css('opacity', '25%')
            $('#us').css('opacity', '100%')
            let infoUs = $("#us > div, #us-data > div").toArray();
            let shuffledInfoUs = infoUs.sort(() => Math.random() - 0.5);
            shuffledInfoUs.forEach((div, index) => {
                setTimeout(() => {
                    $(div).animate({ opacity: 1 }, 200);
                }, index * 130);
            });
        }, 200);
    })

    function hideUs() {
        let infoUs = $("#us > div, #us-data > div").toArray();
        let shuffledInfoUs = infoUs.sort(() => Math.random() - 0.5);
        shuffledInfoUs.forEach((div, index) => {
            setTimeout(() => {
                $(div).animate({ opacity: 0 }, 200);
            }, index * 50);
        });
        
        setTimeout(() => {
            $('#us-video').css('opacity', '')
            $('#us').css('opacity', '')
        }, 600);

        setTimeout(() => {
            $('#us').hide(); 
            $('body').css('overflow', '');
        }, 800);
    }
    


    // LAYOUT 4 
    $('#layout1 img').click(function() {
        $('#layout4').css({ opacity: 1, 'pointer-events': 'all' }); 
        $('#ly1, #ly2, #ly3').hide();
        $('#close').show();

        const imgClicked = $(this).attr('src');
        const subc = imgClicked.split('/')[2]; 
        
        const phototatscroll = $('#phototatscroll');
        phototatscroll.empty(); 
        
        $('#fotoPrincipal').attr('src', imgClicked);

        tatuadorImagenes[subc]?.forEach(imagen => {
            phototatscroll.append(`<img src="${imagen}" alt="${subc} image">`);
        });

        const tatuadorSeleccionado = infoTat.find(t => t.baseImagePath.includes(subc));
        console.log(tatuadorSeleccionado);
        
        if (tatuadorSeleccionado) {
            $('#fotoPrincipal').attr('src', imgClicked); 

            $('#tatuador .tatname').text(tatuadorSeleccionado.name); 
            $('#tatuador .cities').html(tatuadorSeleccionado.cities); 
            $('#tatuador .tatstyle').text(tatuadorSeleccionado.style); 
            $('#openModal').text(`CONTACT WITH ${tatuadorSeleccionado.name.toUpperCase()}`);

            $('#contmodal h2').text(tatuadorSeleccionado.handle); 
            $('#contmodal p').eq(0).text(tatuadorSeleccionado.email); 
            $('#contmodal p').eq(1).text(tatuadorSeleccionado.phone);
            $('#logomodal img').attr('src', tatuadorSeleccionado.logo); 

            const phototatscroll = $('#phototatscroll');
            phototatscroll.empty();

            for (let i = 1; i <= 10; i++) {
                phototatscroll.append(`<img src="${tatuadorSeleccionado.baseImagePath}imagen${i}.jpg" alt="Photo ${i}">`);
            }

            initializePhotoScroll();
        }
    });


    $('#close').click(function() {
        $('#layout4').css('opacity', '0');
        $('#layout4').css('pointer-events', 'none');
        $('#ly1, #ly2, #ly3').show();
        $('#close').hide();
    });


    // arrays info 
    const infoTat = [
        {
        id: "acid.ambar", name: "ACID AMBAR", cities: "CURRENTLY : <br>MADRID [ 09/01/25 - 27/03/25 ]  <br> SOON : <br>VALENCIA [ 01/04/25 - 07/04/25 ]", style: "[ STYLE ] NEW TRIBAL", handle: "@acid.ambar", email: "acid.ambar.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/acid.ambar/", logo: "media/044logo.svg"
        },
        {
        id: "nando.diablo_", name: "NANDO DIABLO", cities: "CURRENTLY : <br>MADRID [ TILL 27/04/25 ]  <br> SOON : <br> PARIS BERLIN LONDON AMSTERDAM SWITZERLAND NY LA MEXICO", style: "[ STYLE ] NEW TRIBAL / BLACKWORK", handle: "@nando.diablo_", email: "nando.diablo.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/nando.diablo_/", logo: "media/044logo.svg"
        },
        {
        id: "infrababy", name: "INFRABABY", cities: "CURRENTLY : <br>MADRID [ TILL 22/05/25 ]  <br> SOON : <br>LONDON", style: "[ STYLE ] TYPOGRAPHY / SURREALISM", handle: "@infrababy", email: "infrababy.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/infrababy/", logo: "media/044logo.svg"
        },
        {
        id: "nona.tatt", name: "NONA", cities: "CURRENTLY : <br>MADRID", style: "[ STYLE ] TRADITIONAL / ART NOUVEAU", handle: "@nona.tatt", email: "nona.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/nona.tatt/", logo: "media/044logo.svg"
        },
        {
        id: "santagemzz", name: "SANTA GEMZZ", cities: "CURRENTLY : <br>MADRID <br> SOON : <br> BARCELONA", style: "[ STYLE ] TOOTH GEMS", handle: "@santagemzzz", email: "santagemzzz.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/santagemzz/", logo: "media/044logo.svg"
        },
        {
        id: "zepa.ttt", name: "ZEPA", cities: "CURRENTLY : <br>MADRID <br> SOON : <br> NY [15/01/25 - 22/01/25]", style: "[ STYLE ] FINE LINE / LETTERING / TRADITIONAL", handle: "@zepa.ttt", email: "zepa.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/zepa.ttt/", logo: "media/044logo.svg"
        },
        {
        id: "alex.a.aramburu", name: "ALEX ARAMBURU", cities: "CURRENTLY : <br>MADRID", style: "[ STYLE ] ABSTRACT / LINE", handle: "@alex.a.aramburu", email: "aramburu.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/alex.a.aramburu/", logo: "media/044logo.svg"
        },
        {
        id: "elvirambarbara", name: "ELVIRA", cities: "CURRENTLY : <br>MADRID", style: "[ STYLE ] FINE LINE / REALISM", handle: "@elvirambarbara", email: "elvira.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/elvirambarbara/", logo: "media/044logo.svg"
        },
        {
        id: "galgocanalla", name: "GALGO CANALLA", cities: "CURRENTLY : <br>MADRID", style: "[ STYLE ] NEO TRIBAL / ORNAMENTAL", handle: "@galgo.canalla", email: "galgo.canalla.tattoo@gmail.com", phone: "+34 652 768 567", baseImagePath: "media/galgocanalla/", logo: "media/044logo.svg"
        }
    ];


    // galería: se actualiza la imagen grande al hacer scroll
    function initializePhotoScroll() {
        const container = $('#phototatscroll'), bigPhoto = $('#fotoPrincipal');
        const photos = $('#phototatscroll img');

        container.append(photos.clone()).scrollTop(0);

        container.off('scroll').on('scroll', function () {
            const scrollTop = container.scrollTop(), photoHeight = photos.first().outerHeight();
            const visibleIndex = Math.floor((scrollTop + container.height() / 2) / photoHeight) % photos.length;
            bigPhoto.attr('src', photos.eq(visibleIndex).attr('src'));

            if (scrollTop + container.height() >= container[0].scrollHeight) container.scrollTop(0);
            else if (scrollTop <= -1) container.scrollTop(container[0].scrollHeight - container.height());
        });
    }


    // modal

    const openModal = document.getElementById('openModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModal = document.getElementById('closeModal');
    
    openModal.addEventListener('click', () => {
        modalOverlay.style.display = 'flex'; 
        setTimeout(() => {
            modalOverlay.classList.add('show'); 
        }, 50);
    });
  
    closeModal.addEventListener('click', () => {
        modalOverlay.classList.remove('show'); 
        setTimeout(() => {
            modalOverlay.style.display = 'none';
        }, 600); 
    });
  
    modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('show'); 
        setTimeout(() => {
            modalOverlay.style.display = 'none'; 
        }, 600); 
     }
    });
  

    
  

});