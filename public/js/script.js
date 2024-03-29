// DERIVA.live
// Software para montaje generativo de video e imagen en tiempo real
// Desarrollado por Pablo Somonte Ruano para la pieza DERIVA_68
// Disponible como software libre bajo la licencia GPL
var JSONdata = [];

$(document).ready(function(){
//***********************INICIO Código necesario para carga de video  */
/*
*
*
*/
$.getJSON('/archivos', (archivos)=>{
    archivos.forEach((archivo) =>{
        if(archivo.videoURL == 'SIN URL')
        return;

        let temp = document.createElement('video');
        temp.preload = 'metadata';
        temp.onloadedmetadata = () => {
            JSONdata.push({"nombre":source.src, "dur":temp.duration});
        };
        let source = document.createElement('source');
        source.src = "/uploads" + archivo.videoURL;
        source.type = 'video/mp4';
        temp.appendChild(source);
        temp.load();
    });
});
/*
*
*
*/
//**********************FIN Código necesario para carga de video */

    setTimeout(function(){
        JSONdata = JSON.stringify(JSONdata);
        durSuma = 0;

        //MODULO 1
        //secuencia 1.a: 2 videos centrados uno después del otro
        //secuencia 1.b: 5 videos en posición aleatoria cada 2 segundos

        var secuencia_1_a = new videoSecuencia('secuencia_1_a',
        '',                                                // path al video
        2, 'unoxuno',                       // cuantos videos, como y cada cuanto
        0, 2000, 2000,                      // delay inicial, fade in y fade out
        1, 1,                               // opacidad inicial y final
        1,                                  // volumen
        'c',                                // posición
        'normal',                           // blendmode
        1,                                  // zIndex
        'sinSombra'                         // sombreado
        );

        var dur_secuencia_1_a = secuencia_1_a.returnDurTotal();

        //setTimeout(function(){ secuencia_1_a.borrarSecuencia(); }, durSuma);

        var secuencia_1_b = new videoSecuencia('secuencia_1_b',
        '',                        // path al video
        5, 2000,                       // cuantos videos, como y cada cuanto
        1000, 1000, 1000,                      // delay inicial, fade in y fade out
        1, 1,                               // opacidad inicial y final
        0.5,                                  // volumen
        'r',                                // posición
        'normal',                           // blendmode
        2,                                  // zIndex
        'conSombra'                         // sombreado
        );

        durSuma = dur_secuencia_1_a;
        setTimeout(function(){ secuencia_1_b.borrarSecuencia(); }, durSuma);

        //FIN Módulo 1


        //MODULO 2

        $("#txt_1").delay(durSuma - 100).fadeIn(2000).delay(7000).fadeOut(1000);


        //secuencia 2.a: 1 video del lado izquierdo
        var secuencia_2_a = new videoSecuencia('secuencia_2_a',
        '',                          // path al video
        1, 'unoxuno',                       // cuantos videos, como y cada cuanto
        durSuma, 1000, 1000,               // delay inicial, fade in y fade out
        1, 1,                               // opacidad inicial y final
        1,                                  // volumen
        'mi',                                // posición
        'normal',                           // blendmode
        2,                                  // zIndex
        'conSombra'                         // sombreado
        ); var dur_secuencia_2_a = secuencia_2_a.returnDurTotal();

        durSuma = dur_secuencia_2_a - durSuma;
        //FIN MODULO 2

        //MODULO 3

        //secuencia 3.a: 2 videos del lado derecho uno tras otro
        var secuencia_3_a = new videoSecuencia('secuencia_3_a',
        '',                          // path al video
        2, 'unoxuno',                       // cuantos videos, como y cada cuanto
        durSuma, 1000, 1000,               // delay inicial, fade in y fade out
        1, 1,                               // opacidad inicial y final
        1,                                  // volumen
        'md',                                // posición
        'normal',                           // blendmode
        2,                                  // zIndex
        'conSombra'                         // sombreado
        ); var dur_secuencia_3_a = secuencia_3_a.returnDurTotal();

        durSuma = dur_secuencia_3_a - durSuma;
        //FIN MODULO 2

        setTimeout(function(){ location.reload(); }, durSuma + 1000);

        //FIN Módulo 5 [Respuesta]
    }, 20000);


}); // FIN document.ready
