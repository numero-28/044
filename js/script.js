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
                $('#us').hide(); 

    });

    $("#ly2").on("click", function () {
        if ($("#layout1").is(":visible")) {
            ly1ToLy2();
        } else if ($("#layout3").is(":visible")) {
            ly3ToLy2();
        }
                $('#us').hide(); 

    });

    $("#ly3").on("click", function () {
        if ($("#layout1").is(":visible")) {
            ly1ToLy3();
        } else if ($("#layout2").is(":visible")) {
            ly2ToLy3();
        }
                        $('#us').hide(); 

    });

    // US
    $('#us-bt').click(function() {
        $('#layout3').hide();
        $('#layout1').hide();
        $('#layout2').hide();
        $('#us').show();
        $('#info-imgs').css('opacity', '0');  
    })

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

    

});