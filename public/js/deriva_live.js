$(document).ready(() => {
  $.getJSON('/archivos', (archivos)=>{
    var object = getURLVars();
    
    if(object.startDate && object.endDate){
      startDate = Date.parse(object.startDate);
      endDate = Date.parse(object.endDate);
    }
    
    var JSONdata = [];

    archivos.forEach((archivo) =>{
      if(archivo.videoURL == 'SIN URL')
        return;
      let temp = document.createElement('video');
      temp.src = archivo.videoURL;
      JSONdata.append({"nombre":temp.src, "dur":temp.duration});
      temp.remove();
    });
  });
});

function getURLVars(){
  var r = {};
  var href = window.location.href;
  
  if(href.indexOf("?") == -1)
    return r;
  
  var pairs = href.split('?');
  pairs.shift();
  
  pairs = pairs[0].split('&');
  
  pairs.forEach((keyValue) =>{
    r[decodeURIComponent(keyValue.split('=')[0])] = decodeURIComponent(keyValue.split('=')[1]);
  });
  return r;
}

function videoSecuencia(
    nombreArg,            // nombre de la secuencia
    pathArg,              // path to folder with los videos
    cuantosArg,           // cuantos videos para la secuencia (número o 'todos')
    cadaCuantoArg,        // cada cuanto aparecen (tiempo en ms o 'unoxuno')
    delayInicialArg,      // delay inicial de inicio de la secuencia en ms
    //ARGS de obj Video
    fadeInArg,            // fadeIn time in milliseconds
    fadeOutArg,           // fadeOut time in milliseconds
    opacityArg,           // opacity from 0 to 1
    opacityArgCambio,     // opacity change in a sequence
    volumeArg,            // volume
    posArg,               // posición centrada (c), mitad izq (mi), mitad der (md) o random (r)
    blendArg,             // blendMode
    zIndexArg,
    sombraArg
  
  ){
  
    //Argumentos
    this.nombreArg = nombreArg;
    this.pathArg = pathArg;
    this.cuantosArg = cuantosArg;
    this.cadaCuantoArg = cadaCuantoArg;
    this.delayInicialArg = delayInicialArg;
  
    this.fadeInArg = fadeInArg;
    this.fadeOutArg = fadeOutArg;
    this.opacityArg = opacityArg;
    this.opacityArgCambio = opacityArgCambio;
    this.volumeArg = volumeArg;
    this.posArg = posArg;
    this.blendArg = blendArg;
    this.zIndexArg = zIndexArg;
    this.sombraArg = sombraArg;
  
    //Funciones
    this.returnDurTotal = returnDurTotal;
    this.borrarSecuencia = borrarSecuencia;
  
    var dataURL = pathArg + '_0_nombres.json';
    //var JSONdata = $.getJSON(dataURL + 'callback=?');
    // var JSONdata = $.ajax({ type: "GET", url: dataURL, async: false}).responseText;
  
    var materiales = JSON.parse(JSONdata);
  
    materiales = shuffle(materiales);
  
    var varTimeOut;
  
    if (cuantosArg >= materiales.length || cuantosArg == 'todos') { cuantosArg = materiales.length }
  
    var secuencia =[];
    var delayDur = [];
    var durTotal = 0;
  
    secuencia[0] = new Video(nombreArg, pathArg + materiales[0].nombre, fadeInArg, fadeOutArg, opacityArg, volumeArg, posArg, blendArg, zIndexArg, sombraArg);
  
    varTimeOut = setTimeout(function(){ secuencia[0].crearVideo(); }, delayInicialArg);
  
    var opacityCambioGradual;
    var opacityArgCopia = opacityArg;
    for (var i = 1; i < materiales.length - 1; i ++){
  
      if (opacityArgCambio == 'no' ){ opacityArg = opacityArg }
      else if(opacityArg < opacityArgCambio) {
        opacityCambioGradual = opacityArgCambio / cuantosArg;
        opacityArg = opacityArg + opacityCambioGradual; //video va aumentando opacidad
  
      } else if(opacityArg > opacityArgCambio){
  
        opacityCambioGradual = opacityArgCopia / cuantosArg;
        opacityArg = opacityArg - opacityCambioGradual; //video va disminuyendo opacidad
      }
  
        secuencia[i] = new Video(nombreArg, pathArg + materiales[i].nombre, fadeInArg, fadeOutArg, opacityArg, volumeArg, posArg, blendArg, zIndexArg, sombraArg);
        delayDur[0] = (materiales[0].dur * 1000) + delayInicialArg;
        delayDur[i] = delayDur[i - 1] + (materiales[i].dur * 1000);
    }
  
    if (cadaCuantoArg == 'unoxuno'){
      durTotal = ( delayDur[cuantosArg - 1] + delayInicialArg );
  
      for (var i = 1; i < cuantosArg; ++i){
        (function (i){
            varTimeOut = setTimeout(function(){ secuencia[i].crearVideo(); }, delayDur[ i -1 ]);
        }).call(this, i);
      }
    } //FIN unoxuno
    else{
      durTotal = ( (i * cadaCuantoArg) + delayInicialArg );
  
      for (var i = 1; i < cuantosArg; ++i){
        (function (i){
            varTimeOut = setTimeout(function(){ secuencia[i].crearVideo(); }, i * cadaCuantoArg + delayInicialArg);
        }).call(this, i);
      }
    } // FIN cadaCuanto num
  
    console.log(secuencia);
  
    function returnDurTotal(){ return durTotal; }
  
    function borrarSecuencia(){
        secuencia.splice(0, secuencia.length);
        clearTimeout(varTimeOut);
  
        $("." + nombreArg).each(function() {
          $(this).get(0).pause();
          $(this).fadeOut(500);
          console.log("SE ACTIVA DETENER " + nombreArg);
        });
    }
  
  } // FIN videoSecuencia
  
  function Video(
    nombreArg,
    sourceArg,  // archivo del video
    fadeInArg,  // fadeIn time in milliseconds
    fadeOutArg, // fadeOut time in milliseconds
    opacityArg, // opacity from 0 to 1
    volumeArg,  // volume
    posArg,     // posición centrada (c), mitad izq (mi), mitad der (md) o random (r)
    blendArg,   // blendMode
    zIndexArg,  // zIndex
    sombraArg
    ) {
  
    //ARGUMENTOS
    //audio dividido estéreo según posición
    this.nombreArg = nombreArg;
    this.sourceArg = sourceArg;
    this.fadeInArg = fadeInArg;
    this.fadeOutArg = fadeOutArg;
    this.opacityArg = opacityArg;
    this.volumeArg = volumeArg;
    this.posArg = posArg;
    this.blendArg = blendArg;
    this.zIndexArg = zIndexArg;
    this.sombraArg = sombraArg;
  
    //FUNCIONES
    this.crearVideo = crearVideo;
  
    function crearVideo() {
  
      var videito = document.createElement('video');
      var id_rand = uuidv4();
      var id_videito = 'videito' + id_rand;
      videito.id = id_videito; //videito con ID random para no confundirse con otros videitos.
      document.body.appendChild(videito);
      videito.src = sourceArg; //Lo recibe como parámetro y además convertir en una función? para una lista rand que elige el primero del folder correspondiente
      videito.volume = volumeArg;
      videito.autoplay = true;
      videito.loop = false;
  
      var tiempo = 0; //Empezar videos en otros puntos? //repetir secciones?
      videito.currentTime = tiempo;
  
      $('#' + id_videito).addClass(String(nombreArg));
  
      $('#' + id_videito).css('mixBlendMode', blendArg);
      $('#' + id_videito).css('zIndex', zIndexArg);
      if(sombraArg == 'conSombra'){
        //$('#' + id_videito).css('border', '1px solid white');
        $('#' + id_videito).css('filter', 'drop-shadow(12px 12px 12px #000000)');
      } else if (sombraArg == 'sinSombra'){
        $('#' + id_videito).css('border', 'none');
        $('#' + id_videito).css('filter', 'none');
      }
  
      //Obtener dimensiones del video y posicionarlo
      var v = document.getElementById(id_videito);
  
      v.addEventListener( "loadedmetadata", function (e) {
  
        var listenerVideoWidth = this.videoWidth,
            listenerVideoHeight = this.videoHeight;
  
        if (listenerVideoWidth >= screen.width && posArg != 'mi' && posArg != 'md'){
  
          $('#' + id_videito).css('marginLeft', 0);
          $('#' + id_videito).css('marginRight', 0);
  
          //MITAD IZQUIERDA
        } else if (posArg == 'mi'){
  
          //Si el video es más ancho de la mitad de la pantalla
          if (listenerVideoWidth >= screen.width / 2){
  
              // Mapear a partír de la dimensión del video A
              // de la mitad al total si 1920 - (960 - 1920)
              // a 0 a un cuarto del total 1920 - (0 - 480)
              var clipMap = map_range(
                listenerVideoWidth,
                (screen.width / 2),
                screen.width,
                0,
                (screen.width / 4) );
  
              var marginLeft = - clipMap;
              var marginTop = (screen.height - listenerVideoHeight)  / 2;
  
              $('#' + id_videito).css('clipPath', 'inset(0px ' + clipMap + 'px');
              $('#' + id_videito).css('marginLeft', marginLeft);
              $('#' + id_videito).css('marginTop', marginTop);
  
              //Si el video es menos ancho que la mitad de la pantalla
            } else{
  
              var marginLeft = ( (screen.width / 2) - listenerVideoWidth) / 2;
              var marginTop = (screen.height - listenerVideoHeight)  / 2;
  
              $('#' + id_videito).css('marginLeft', marginLeft);
              $('#' + id_videito).css('marginTop', marginTop);
              }
              //MITAD DERECHA
            } else if (posArg == 'md'){
  
              //Si el video es más ancho de la mitad de la pantalla
              if (listenerVideoWidth >= screen.width / 2){
  
                  // Mapear a partír de la dimensión del video A
                  // de la mitad al total si 1920 - (960 - 1920)
                  // a 0 a un cuarto del total 1920 - (0 - 480)
                  var clipMap = map_range(
                    listenerVideoWidth,
                    (screen.width / 2),
                    screen.width,
                    0,
                    (screen.width / 4) );
                    console.log('clipMap = ' + clipMap);
                  var marginLeft =  screen.width / 2 - clipMap;
                  var marginTop = (screen.height - listenerVideoHeight)  / 2;
  
                  $('#' + id_videito).css('clipPath', 'inset(0px ' + clipMap + 'px');
                  $('#' + id_videito).css('marginLeft', marginLeft);
                  $('#' + id_videito).css('marginTop', marginTop);
  
                  //Si el video es menos ancho que la mitad de la pantalla
                } else{
  
                    var marginLeft =  (screen.width / 2) + ( (screen.width / 2) - listenerVideoWidth ) / 2;
                    var marginTop = (screen.height - listenerVideoHeight)  / 2;
  
                    $('#' + id_videito).css('marginLeft', marginLeft);
                    $('#' + id_videito).css('marginTop', marginTop);
                  }
  
        } else if(listenerVideoWidth < screen.width) {
  
          // CENTRADO
          if (posArg == 'c'){
  
            var marginLeft = (screen.width - listenerVideoWidth) / 2;
            var marginTop = (screen.height - listenerVideoHeight) / 2;
  
            $('#' + id_videito).css('marginLeft', marginLeft);
            $('#' + id_videito).css('marginTop', marginTop);
  
            //RANDOM
          } else if (posArg == 'r'){
  
            var marginLeft = (screen.width - listenerVideoWidth) / 2;
            var marginTop = (screen.height - listenerVideoHeight) / 2;
  
            var randomMarginLeft = Math.random() * marginLeft * 2;
            var randomMarginTop = Math.random() * marginTop * 2;
  
            $('#' + id_videito).css('marginLeft', randomMarginLeft);
            $('#' + id_videito).css('marginTop', randomMarginTop);
  
          }
        }
      }, false ); // FIN posición video
  
      $('#' + id_videito).css('display','none'); //Esconde video
      $('#' + id_videito).css('opacity', opacityArg); //Opacidad video
      $('#' + id_videito).fadeIn(fadeInArg); //Aparece video
  
      videito.onended = function() {
        console.log('FIN ' + id_videito);
        $('#' + id_videito).fadeOut(fadeOutArg); //Desaparece video
      } // FIN onended
    } // FIN función crearVideo
  
  } // FIN objeto Video
  
  function Imagen(
    sourceArgImg,  // archivo de la imagen
    fadeInArgImg,  // fadeIn time in milliseconds
    fadeOutArgImg, // fadeOut time in milliseconds
    opacityArgImg, // opacity from 0 to 1
    posArgImg,     // posición centrada (c), mitad izq (mi), mitad der (md) o random (r)
    blendArgImg,   // blendMode
    zIndexArgImg,  // zIndex
    sombraArgImg,  // sombra
    durImgArg      //duración
    ) {
  
    //ARGUMENTOS
    //audio dividido estéreo según posición
    this.sourceArgImg = sourceArgImg;
    this.fadeInArgImg = fadeInArgImg;
    this.fadeOutArgImg = fadeOutArgImg;
    this.opacityArgImg = opacityArgImg;
    this.posArgImg = posArgImg;
    this.blendArgImg = blendArgImg;
    this.zIndexArgImg = zIndexArgImg;
    this.sombraArgImg = sombraArgImg;
    this.durImgArg = durImgArg;
  
    //FUNCIONES
    this.crearImagen = crearImagen;
  
    function crearImagen(){
  
        var imagen = document.createElement('img');
        var id_rand_img = Math.floor(Math.random() * 999999);
        var id_imagen = 'imagen' + String(id_rand_img);
        imagen.id = id_imagen;
        document.body.appendChild(imagen);
        imagen.src = sourceArgImg;
  
        $('#' + id_imagen).css('display', 'none');
  
  
        imagen.onload = function(){
  
            widthImg = imagen.width;
            heightImg = imagen.height;
  
            if (widthImg > heightImg){
              if (widthImg > 800){ imagen.width = 800;}
  
          }else if(heightImg > widthImg){
            if (heightImg > 860){imagen.height = 860;}
          }
          //futuro: if pos c:
          $('#' + id_imagen).css('marginLeft', (screen.width - imagen.width)/2);
          $('#' + id_imagen).css('marginTop', (screen.height - imagen.height)/2);
        } // FIN onload width y height
  
        $('#' + id_imagen).fadeIn(fadeInArgImg);
        $('#' + id_imagen).css('opacity', opacityArgImg);
        $('#' + id_imagen).css('mixBlendMode', blendArgImg);
        $('#' + id_imagen).css('zIndex', zIndexArgImg);
        $('#' + id_imagen).css('mixBlendMode', blendArgImg);
  
        if(sombraArgImg == 'conSombra'){
          $('#' + id_imagen).css('filter', 'drop-shadow(12px 12px 12px #000000)');
        } else if (sombraArgImg == 'sinSombra'){
          $('#' + id_imagen).css('border', 'none');
          $('#' + id_imagen).css('filter', 'none');
        } // FIN sombra
  
        var varTimeOutImg = setTimeout(function(){
          $('#' + id_imagen).fadeOut(fadeOutArgImg);
        }, durImgArg);
  
    } // FIN crearImagen
  } //FIN Imagen
  
  function detenerTodos(durFinal){
  
    this.durFinal = durFinal;
  
    setTimeout(function(){
      $('video').each(function() {
        $(this).get(0).pause();
        $(this).fadeOut(500);
        console.log("SE ACTIVA DETENER TODOS");
      }); }, durFinal);
  
  } // FIN Duración Final
  
  function detenerSecuencia(nombreSecArg, durSecAnteriorArg){
  
    this.nombreSecArg = nombreSecArg;
    this.durSecAnteriorArg = durSecAnteriorArg;
  
    setTimeout(function(){
      $("." + nombreSecArg).each(function() {
        $(this).get(0).pause();
        $(this).fadeOut(500);
        console.log("SE ACTIVA DETENER " + nombreSecArg);
  
      }); }, durSecAnteriorArg);
  
  } // FIN detenerSecuencia
  
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  } // FIN shuffle
  
  function map_range(value, low1, high1, low2, high2) {
      return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  } // FIN map_range

  function uuidv4() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  