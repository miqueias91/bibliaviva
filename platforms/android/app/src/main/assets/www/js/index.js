var admobid = {}
if (/(android)/i.test(navigator.userAgent)) {
  admobid = {
    banner: 'ca-app-pub-7091486462236476/5967509294',
    interstitial: 'ca-app-pub-7091486462236476/9668555937',
  }
}
window.fn = {};
$("#existeProximoCapitulo").val(0)
var id = '';
var usar_cores = 0;
var inicioLeitura = 0;
var velocidade = 0;
var tamanho = 826;
var pausar = 0;
var rolagem = 0;

var ultimo_livro_lido = localStorage.getItem('ultimo_livro_lido');
var ultimo_livro_lido_abr = localStorage.getItem('ultimo_livro_lido_abr');
var ultimo_capitulo_lido = localStorage.getItem('ultimo_capitulo_lido');
var fonte_versiculo = JSON.parse(localStorage.getItem('fonte-versiculo') || '20');
localStorage.setItem("fonte-versiculo", fonte_versiculo);
var modo_noturno = JSON.parse(localStorage.getItem('modo-noturno') || false);
localStorage.setItem("modo-noturno", modo_noturno);

if (!window.localStorage.getItem('lista-versiculos')) {
  localStorage.setItem("lista-versiculos", '[]'); 
}

if (!window.localStorage.getItem('versao-biblia')) {
  localStorage.setItem("versao-biblia", 'viva'); 
}
var versaoId = window.localStorage.getItem('versao-biblia');

var lista_notificacao = JSON.parse(localStorage.getItem('lista-notificacoes') || '[]');
if (window.localStorage.getItem('userId')) {
  localStorage.removeItem('userId');
}

window.localStorage.setItem("versao_pro", 'NAO');

if (!window.localStorage.getItem('lista-favorito-hinario')) {
  localStorage.setItem("lista-favorito-hinario", '[]'); 
}

window.fn.toggleMenu = function () {
  document.getElementById('appSplitter').left.toggle();
};

window.fn.loadView = function (index) {
  document.getElementById('appTabbar').setActiveTab(index);
  document.getElementById('sidemenu').close();
};

window.fn.loadLink = function (url) {
  window.open(url, '_blank');
};

window.fn.pushPage = function (page, anim) {
  if (anim) {
    document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title }, animation: anim });
  } else {
    document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title } });
  }
};

// SCRIPT PARA CRIAR O MODAL DE AGUARDE
window.fn.showDialog = function (id) {
  var elem = document.getElementById(id);      
  elem.show();            
};

var showTemplateDialog = function() {
  var dialog = document.getElementById('my-dialog');

  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('dialog.html', { append: true })
      .then(function(dialog) {
        dialog.show();
      });
  }
};
//SCRIPT PARA ESCONDER O MODAL DE AGUARDE
window.fn.hideDialog = function (id) {
  document.getElementById(id).hide();
};

var app = {
  // Application Constructor
  initialize: function() {

    if (JSON.parse(ultimo_capitulo_lido)) {
      fn.pushPage({'id': 'textoLivro.html', 'title': ultimo_livro_lido_abr+'||'+ultimo_livro_lido+'||200||'+ultimo_capitulo_lido});
    }
    else{
      fn.pushPage({'id': 'textoLivro.html', 'title': 'Gn||Gênesis||50||1'});
    }
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    document.addEventListener('admob.banner.events.LOAD_FAIL', function(event) {
      // alert(JSON.stringify(event))
    });
    document.addEventListener('admob.interstitial.events.LOAD_FAIL', function(event) {
      // alert(JSON.stringify(event))
    });
    document.addEventListener('admob.interstitial.events.LOAD', function(event) {
      // alert(JSON.stringify(event))
      document.getElementsByClassName('showAd').disabled = false
    });
    document.addEventListener('admob.interstitial.events.CLOSE', function(event) {
      // alert(JSON.stringify(event))
      admob.interstitial.prepare()
    });
  },
  onDeviceReady: function() {    
    this.receivedEvent('deviceready');  
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    this.firebase();
    this.oneSignal();
    this.getIds();
    this.buscaDadosUsuario();
    this.admob();
    this.buscaNotificacoes();
  },
  oneSignal: function() {
    window.plugins.OneSignal
    .startInit("541c60bb-5dd3-474f-8b6c-7bf193f621f0")   
    .handleNotificationOpened(function(jsonData) {
      var mensagem = JSON.parse(JSON.stringify(jsonData['notification']['payload']['additionalData']['mensagem']));
      var titulo = JSON.parse(JSON.stringify(jsonData['notification']['payload']['additionalData']['titulo']));
      ons.notification.alert(
        mensagem,
        {title: titulo}
      );
    })
    .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
    .endInit();
  },
  //FUNÇÃO DE BUSCA
  onSearchKeyDown: function(id) {
    if (id === '') {
      return false;
    }
    else{
      
    }
  },
  retirarMarcadorVersiculo: function(livro, num_capitulo, num_versiculo, array) {
    for(var i=0; i<array.length; i++) {
      if (array[i]['livro']) {
        if((array[i]['livro'].toLowerCase() === livro.toLowerCase()) && (array[i]['num_capitulo'] === num_capitulo) && (array[i]['num_versiculo'] === num_versiculo)) {
          array.splice(i, 1);
        }
      }
    }
    var lista_versiculos = JSON.parse(localStorage.getItem('lista-versiculos') || '[]');
    localStorage.removeItem(lista_versiculos);
    localStorage.setItem("lista-versiculos", JSON.stringify(array));
  },
  incluirMarcadorVersiculo: function(livro, num_capitulo, num_versiculo) {
    array = JSON.parse(localStorage.getItem('lista-versiculos'));
    if (array) {
      for(var k=0; k < array.length; k++) {
        if (array[k]['livro']) {
          if((array[k]['livro'].toLowerCase() == livro.toLowerCase()) && (array[k]['num_capitulo'] == num_capitulo) && (array[k]['num_versiculo'] == num_versiculo)) {
            return array[k]['cor'];
          }
        }
      }   
    }
    return false;
  },  
  retirarCapitulo: function(search_array, array) {
    for(var i=0; i<array.length; i++) {
        if(array[i] === search_array) {
          var indice = array.indexOf(search_array);
          array.splice(indice, 1);
        }
    }
    var lista_capitulos = JSON.parse(localStorage.getItem('lista-capitulos') || '[]');
    localStorage.removeItem(lista_capitulos);
    localStorage.setItem("lista-capitulos", JSON.stringify(array));
  },
  incluirCapitulo: function(search_array) {
    array = JSON.parse(localStorage.getItem('lista-capitulos'));
    if (array) {
      for(var i=0; i<array.length; i++) {
          if(array[i] === search_array) {
            return true;
          }
        return false;
      }   
      return false;   
    }
    return false;
  },  
    buscaFavorioHinario: function(hinario, id_hinario) {
    var array = JSON.parse(localStorage.getItem('lista-favorito-hinario'));
    if (array) {
      for(var k=0; k < array.length; k++) {
        if (array[k]['hinario']) {
          if((array[k]['hinario'].toLowerCase() == hinario.toLowerCase()) && (array[k]['id_hinario'] == id_hinario)) {
            return 'yellow';
          }
        }
      }   
    }
    return '#f5f5f5'
  },
  incluirFavorioHinario: function(hinario, id_hinario, titulo) {
    var favorito_hinario = JSON.parse(localStorage.getItem('lista-favorito-hinario') || '[]');
    favorito_hinario.push({hinario: hinario, id_hinario: id_hinario, titulo: titulo});
    localStorage.setItem("lista-favorito-hinario", JSON.stringify(favorito_hinario));
    ons.notification.toast('Adicionado aos favoritos.', { buttonLabel: 'Ok', timeout: 1500 });
    return 'yellow';
  },
  retirarFavorioHinario: function(hinario, id_hinario) {
    var array = JSON.parse(localStorage.getItem('lista-favorito-hinario') || '[]');
    for(var i=0; i<array.length; i++) {
      if (array[i]['hinario']) {
        if((array[i]['hinario'].toLowerCase() === hinario.toLowerCase()) && (array[i]['id_hinario'] === id_hinario)) {
          array.splice(i, 1);
        }
      }
    }
    var favorito_hinario = JSON.parse(localStorage.getItem('lista-favorito-hinario') || '[]');
    localStorage.removeItem(favorito_hinario);
    localStorage.setItem("lista-favorito-hinario", JSON.stringify(array));
    this.listaFavorioHinario();
    ons.notification.toast('Removido dos favoritos.', { buttonLabel: 'Ok', timeout: 1500 });
  },
  listaFavorioHinario: function() {
    var link = '';
    var descricao = '';
    var html_favoritos = '<p style="text-align: center">Nenhum favorito encontrado...</p>'
    var array = JSON.parse(localStorage.getItem('lista-favorito-hinario'));
    if (array) {
      html_favoritos = "";
      for(var k=0; k < array.length; k++) {
        if (array[k]['hinario']) {
          if (array[k]['hinario'] === 'harpa') {
            link = 'conteudoHarpa.html';
          }
          else{
            link = 'conteudoCantor.html';
          }
          descricao = array[k]['id_hinario']+'||'+array[k]['titulo'];

          html_favoritos += '<ons-list-item class="showAd list-item list-item--material" onclick="fn.pushPage({\'id\': \''+link+'\', \'title\': \''+descricao+'\'})" modifier="material">'+
            '<div class="center list-item__center list-item--material__center" style="font-size: 15px;">'+array[k]['id_hinario']+' - '+array[k]['titulo']+'</div>'+
            '<div class="left list-item__left list-item--material__left"></div>'+
            '<div class="right list-item__right list-item--material__right">'+
               '<ons-icon icon="fa-angle-right" class="ons-icon fa-angle-right fa" modifier="material"></ons-icon>'+
            '</div>'+
         '</ons-list-item>';
        }
      }   
    }
    $("#listaFavoritos").html(html_favoritos);
  },
  buscaTexto: function(versaoId,livro,capitulo, nome) {
    inicioLeitura = 0;
    localStorage.setItem("ultimo_livro_lido", nome);
    localStorage.setItem("ultimo_livro_lido_abr", livro);
    localStorage.setItem("ultimo_capitulo_lido", capitulo);
    fonte_versiculo = JSON.parse(localStorage.getItem('fonte-versiculo'));
    modo_noturno = JSON.parse(localStorage.getItem('modo-noturno'));

    $("#textoLivro").html('');
    var versaoId = versaoId || "viva";
    var selector = this;
    var texts = [];

    $.ajax({
      type : "GET",
      url : "js/"+versaoId+".json",
      dataType : "json",
      success : function(data){
        $(selector).each(function(){
          var ref = livro+""+capitulo+".1-200";
          var reg = new RegExp('([0-9]?[a-zA-Záàâãéèêíïó]{2,3})([0-9]+)[\.|:]([0-9]+)-?([0-9]{1,3})?');
          var regex = reg.exec(ref);                    
          var myBook = null;
          var obj = {
            ref : ref,
            book : regex[1].toLowerCase(),
            chapter : parseInt(regex[2]),
            text : ""
          };

          for(i in data){
            if(data[i].abbrev == obj.book){
                myBook = data[i];
            }
          }

          for (var i in myBook.chapters[obj.chapter - 1]) {
            if (myBook.chapters[obj.chapter - 1]) {
              $("#existeProximoCapitulo").val(1);
              var marcado = 0;
              var txt_marcado = 0;
              var capitulo_marcado = 0;
              var background = '#f5f5f5';
              var color = '1f1f21';
              var existe_marcado = app.incluirMarcadorVersiculo(livro, capitulo, i);
              var existe_capitulo = app.incluirCapitulo(livro+' '+capitulo);
              if (modo_noturno) {
                background = '#333';
                color = 'fff';
              }

              if (existe_marcado) {
                txt_marcado = 1;
                background = existe_marcado;
                color = '1f1f21';
              }

              if (existe_capitulo) {
                capitulo_marcado = 1;
              }

              var texto = myBook.chapters[obj.chapter - 1][i];
              obj.text += '<ons-list-item style="background:'+background+';color:#'+color+'" id="txt_versiculo'+livro+'_'+capitulo+'_'+i+'_">'+
                            '<p style="font-size: '+fonte_versiculo+'px;text-align:justify;line-height: 35px;background:'+background+';color:#'+color+'"  id="txt_versiculo'+livro+'_'+capitulo+'_'+i+'" class="txt_versiculo" livro="'+livro+'" num_capitulo="'+capitulo+'" num_versiculo="'+i+'" marcado="'+marcado+'" txt_marcado="'+txt_marcado+'" txt_versiculo="'+texto+'">'+
                              '<span style="font-weight:bold;">'+(parseInt(i)+1)+'</span>'+
                              '&nbsp;&nbsp;'+texto+ 
                            '</p>'+
                          '</ons-list-item>';
            }
          }

          if (parseInt($("#existeProximoCapitulo").val()) == 1) {
            obj.text += '<br><br><section style="margin: 16px"><ons-button capitulo_marcado="'+capitulo_marcado+'" modifier="large" class="button-margin marcar_capitulo" livro_marcar="'+livro+'" num_capitulo_marcar="'+capitulo+'">MARCAR CAPÍTULO COMO LIDO</ons-button></section>'
            $("#textoLivro").html(obj.text);

          }
          else{
            $("#atual").val(parseInt($("#atual").val())-1);
            localStorage.setItem("ultimo_capitulo_lido", parseInt($("#atual").val()));
            $('#textoLivro_ div.center').html(ultimo_livro_lido+' '+parseInt($("#atual").val()));
            app.buscaTexto(versaoId,ultimo_livro_lido_abr,parseInt($("#atual").val()), ultimo_livro_lido);
          }
          $("#existeProximoCapitulo").val(0);
        });

        $( ".marcar_capitulo" ).click(function() {
          var capitulo_marcar = $(this).attr('livro_marcar')+" "+$(this).attr('num_capitulo_marcar');
          capitulo = $(this).attr('capitulo_marcado');

          if (capitulo == 0) {
            $(this).attr('capitulo_marcado',1);
            var lista_capitulos = JSON.parse(localStorage.getItem('lista-capitulos') || '[]');
            lista_capitulos.push(capitulo_marcar);
            localStorage.setItem("lista-capitulos", JSON.stringify(lista_capitulos));
            ons.notification.toast('Capítulo marcado como lido.', { buttonLabel: 'Ok', timeout: 1500 });
          }
          else{
            $(this).attr('capitulo_marcado',0);
            lista_capitulos = JSON.parse(localStorage.getItem('lista-capitulos'));
            app.retirarCapitulo(capitulo_marcar, lista_capitulos);
            ons.notification.toast('Capítulo desmarcado como lido.', { buttonLabel: 'Ok', timeout: 1500 });
          }
        });


        $( ".txt_versiculo" ).click(function() {
          if (parseInt(rolagem) == 0) {
            marcado = $(this).attr('marcado');
            id = $(this).attr('id');          
            var livro = $('#'+id).attr('livro');
            var num_capitulo = $('#'+id).attr('num_capitulo');
            var num_versiculo = $('#'+id).attr('num_versiculo');
            if (marcado==0) {
              usar_cores++;
              if(parseInt(usar_cores) === 1){
                $(".cores").css("display","");
                $(".copiar").css("display","");
                $(".compartilha").css("display","");
              }
              else{
                $(".cores").css("display","none");
              }
              $('#'+id).attr('marcado',1);
              $('#'+id).attr('txt_marcado',0);
              $(".botao_controle").css("display","none");

              color = '#fff';
              modo_noturno = JSON.parse(localStorage.getItem('modo-noturno'));
              if (modo_noturno) {
                color = '#333';
              }
              $('#'+id).css("color",color);
              $('#'+id).css("background","#ccc");


              lista_versiculos = JSON.parse(localStorage.getItem('lista-versiculos'));
              app.retirarMarcadorVersiculo(livro, num_capitulo, num_versiculo, lista_versiculos);
            }
            else{
              usar_cores--;
              $(this).attr('marcado',0);
              $(this).attr('txt_marcado',0);
              if(parseInt(usar_cores) === 1){
                $(".cores").css("display","");
                $(".botao_controle").css("display","none");
              }
              else{
                $(".cores").css("display","none");
                if(parseInt(usar_cores) > 1){
                  $(".botao_controle").css("display","none");
                }
                else{
                  $(".botao_controle").css("display","");
                  $(".copiar").css("display","none");
                $(".compartilha").css("display","none");
                }
              }
              background = '#f5f5f5';
              color = '#1f1f21';
              modo_noturno = JSON.parse(localStorage.getItem('modo-noturno'));
              if (modo_noturno) {
                background = '#333';
                color = '#fff';
              }
              $('#'+id).css("background",background);
              $('#'+id).css("color",color);
              lista_versiculos = JSON.parse(localStorage.getItem('lista-versiculos'));
              app.retirarMarcadorVersiculo(livro, num_capitulo, num_versiculo, lista_versiculos);
            }      
          }      
        });

        $( ".cores" ).click(function() {
          marcado = $(this).attr('marcado');
          var cor = $(this).attr('id');
          var livro = $('#'+id).attr('livro');
          var num_capitulo = $('#'+id).attr('num_capitulo');
          var num_versiculo = $('#'+id).attr('num_versiculo');
    
          if (marcado==0) {
            $('#'+id).attr('marcado',1);
            $('#'+id).attr('txt_marcado',0);
            $(".botao_controle").css("display","none");
            $(".cores").css("display","");
            $('#'+id).css("background","#f5f5f5");
            lista_versiculos = JSON.parse(localStorage.getItem('lista-versiculos'));
            app.retirarMarcadorVersiculo(livro, num_capitulo, num_versiculo, lista_versiculos);
          }
          else{
            $(".copiar").css("display","none");
            $(".compartilha").css("display","none");
            id = $("[marcado=1]").attr('id');
            $("#"+id).attr('marcado',0);
            $('#'+id).attr('txt_marcado',1);
            $(".cores").css("display","none");
            $(".botao_controle").css("display","");
            $("#"+id).css("background",cor);
            var livro = $('#'+id).attr('livro');
            var num_capitulo = $('#'+id).attr('num_capitulo');
            var num_versiculo = $('#'+id).attr('num_versiculo');

            var lista_versiculos = JSON.parse(localStorage.getItem('lista-versiculos') || '[]');
            lista_versiculos.push({cor: cor, livro: livro, num_capitulo: num_capitulo, num_versiculo: num_versiculo});
            localStorage.setItem("lista-versiculos", JSON.stringify(lista_versiculos));
            usar_cores = 0;
          }      
        });
      }
    });
  },
  rolar: function() {
    tamanho = $("#textoLivro").height();
    document.getElementById('onsPageTextoLivro').scrollTop = inicioLeitura;
    inicioLeitura++;
    if (inicioLeitura != tamanho && velocidade != 0) {
      t = setTimeout(function() { app.rolar() }, velocidade);
    }
  },
  parar: function() {
    clearTimeout(t);
  },
  buscaVersiculo: function(versaoId,livro_capitulo_versiculo, id) {
    $("#textoLivro").html('');
    var versaoId = versaoId || "viva";
    var selector = this;
    var texts = [];
    var dados0 = livro_capitulo_versiculo.split('||');
    var livro = dados0[0];
    var dados1 = dados0[1].split('.');
    var capitulo = dados1[0];
    var versiculo = dados1[1];
    $.ajax({
      type : "GET",
      url : "js/"+versaoId+".json",
      dataType : "json",
      success : function(data){
        $(selector).each(function(){
          var ref = livro+""+capitulo+"."+versiculo;
          var reg = new RegExp('([0-9]?[a-zA-Z]{2,3})([0-9]+)[\.|:]([0-9]+)-?([0-9]{1,3})?');
          var regex = reg.exec(ref);                    
          var myBook = null;
          var obj_v = {
            ref : ref,
            book : regex[1].toLowerCase(),
            chapter : parseInt(regex[2]),
            text : ""
          };

          for(i in data){
            if(data[i].abbrev == obj_v.book){
                myBook = data[i];
            }
          }
          var start = parseInt(regex[3]);
          var end = parseInt(regex[4]) || parseInt(regex[3]);


          for(var i = start; i <=  end; i++){
            if (myBook.chapters[obj_v.chapter - 1][i]) {
                obj_v.text += '<ons-list-item onclick="fn.pushPage({\'id\': \'textoLivro.html\', \'title\': \''+myBook.abbrev+'||'+myBook.name+'||'+myBook.chapters.length+'||'+(parseInt(capitulo))+'\'});">'+
                  '<p style="font-size: 20px;line-height:30px;text-align:justify">'+
                    myBook.chapters[obj_v.chapter - 1][i] +
                  '</p>'+
                  '<p style="font-size: 15px;">'+livro.toUpperCase()+' '+capitulo+':'+(parseInt(i)+1)+'</p>'+
                '</ons-list-item>';
            }
          }
          $("#"+id).append(obj_v.text);
        });
      }
    });
  },
  buscaVersiculoDia: function(livro_capitulo_versiculo, id) {
    $("#"+id).html('Buscando...');
    var selector = this;
    var texts = [];
    var dados0 = livro_capitulo_versiculo.split('||');
    var livro = dados0[0];
    var dados1 = dados0[1].split('.');
    var capitulo = (dados1[0] - 1);
    var versiculo = (dados1[1]-1);

    var text = "";
    var texto = "";
    var abbrev = "";
    var name = "";
    var chapters = "";

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      fn.showDialog('modal-aguarde');
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        for (var i = 0; i < data.length; i++) {
          if (data[i]['abbrev'].toLowerCase() == livro.toLowerCase()) {
            abbrev = data[i]['abbrev'];
            name = data[i]['name'];
            chapters = data[i]['chapters'].length;
            text = data[i]['chapters'][parseInt(capitulo)][versiculo];
          }
          
        }
        texto = '<ons-list-item onclick="fn.pushPage({\'id\': \'textoLivro.html\', \'title\': \''+abbrev+'||'+name+'||'+chapters+'||'+(parseInt(capitulo)+1)+'\'});">'+

                  '<p style="font-size: 20px;line-height:30px;text-align:justify">'+
                    text+
                  '</p>'+
                  '<p style="font-size: 15px;">'+livro.toUpperCase()+' '+(parseInt(capitulo)+1)+':'+(parseInt(versiculo)+1)+'</p>'+
                '</ons-list-item>';
        var timeoutID = 0;
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() { fn.hideDialog('modal-aguarde') }, 100);
        $("#"+id).html(texto);
      }
    };
    xmlhttp.open("GET", "js/viva.json", true);
    xmlhttp.send();
  },
  buscaHinario: function(id) {
    var selector = this;
    var texto = "";

    $.ajax({
      type : "GET",
      url : "js/harpa.json",
      dataType : "json",
      success : function(data){
        $(selector).each(function(){
          var myBook = null;
          var refrao = "";
          var obj = {
            id : id,
            text : ""
          };
          background = '#f5f5f5';
          color = '1f1f21';
          modo_noturno = JSON.parse(localStorage.getItem('modo-noturno'));
          if (modo_noturno) {
            background = '#333';
            color = 'fff';
          }
          if (modo_noturno) {
            background = '#333';
            color = 'fff';
          }

          if (data) {
            for(i in data){
              if(data[i].id == obj.id){
                  myBook = data[i];
              }
            } 
            for (var i = 0; i < myBook['hinario'].length; i++) {
              texto = myBook['hinario'][i];
              if(texto.substr(0, 1) == '*'){
                refrao = texto.replace("*","");
                obj.text += 
                '<ons-list-item style="padding:0 16px;background:'+background+';color:#'+color+';font-weight:bold">'+
                  '<p style="line-height:31px;margin:0;font-weight:bold;font-size:20px;text-align:left;background:'+background+';color:#'+color+'">'+
                    '<i>'+refrao+ 
                  '</i></p>'+
                '</ons-list-item>';
              }
              if(texto.substr(0, 1) != '*'){
                obj.text += 
                '<ons-list-item style="padding:0 16px;background:'+background+';color:#'+color+'">'+
                  '<p style="line-height:31px;margin:0;font-size:20px;text-align:left;background:'+background+';color:#'+color+'">'+
                    ''+texto+ 
                  '</p>'+
                '</ons-list-item>';
              }
            }
          }
          $("#conteudoHarpa").html(obj.text);
        });
      }
    });
  },
  listaHinario: function() {
    var text = "";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        $("#listaharpa").html('');
        var data = JSON.parse(this.responseText);
        data.forEach(function (hinos) {
          text +=
          '<ons-list-item class="showAd" onclick="fn.pushPage({\'id\': \'conteudoHarpa.html\', \'title\': \''+hinos['id']+'||'+hinos['titulo']+'\'})">'+
          '  <div class="left"></div>'+
          '  <div class="center" style="font-size: 15px;">'+hinos['id']+' - '+hinos['titulo']+'</div>'+
          '  <div class="right"><ons-icon icon="fa-angle-right"></ons-icon></div>'+
          '</ons-list-item>';
        });
        $("#listaharpa").html(text);
      }
    };
    xmlhttp.open("GET", "js/harpa.json", true);
    xmlhttp.send();
  },
  pesquisaHarpa: function(term){
    if (term != '') {
      text = '';
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          $("#resultado_pesquisa_harpa").html('');
          var data = JSON.parse(this.responseText);

          data.forEach(function (hinos) {
            var achou = 0;

            //PESQUISA PELO NUMERO
            var str = hinos['id'];
            if (achou == 0) {
              if(parseInt(str) === parseInt(term)){
                achou = 1;
                text +=
                '<ons-list-item class="showAd" onclick="fn.pushPage({\'id\': \'conteudoHarpa.html\', \'title\': \''+hinos['id']+'||'+hinos['titulo']+'\'})">'+             
                '  <div class="center" style="font-size: 15px;display:block;"><span>'+hinos['id']+' - '+hinos['titulo']+'</span>'+
                '   <div><i style="font-size: 11px;">'+hinos['id']+" - "+hinos['titulo']+'</i></div>'+
                '  </div>'+
                '</ons-list-item>';
              }
            }

            //PESQUISA PELO TITULO SE NAO ACHAR PELO NUMERO
            if (achou == 0) {
              var str = hinos['titulo'].toLowerCase();
              term = term.toLowerCase();
              if(str.match(term) && achou == 0){
                achou = 1;
                text +=
                '<ons-list-item class="showAd" onclick="fn.pushPage({\'id\': \'conteudoHarpa.html\', \'title\': \''+hinos['id']+'||'+hinos['titulo']+'\'})">'+             
                '  <div class="center" style="font-size: 15px;display:block;"><span>'+hinos['id']+' - '+hinos['titulo']+'</span>'+
                '   <div><i style="font-size: 11px;">'+hinos['id']+" - "+hinos['titulo']+'</i></div>'+
                '  </div>'+
                '</ons-list-item>';
              }
            }

            //PESQUISA DENTRO DO HINARIO SE NAO ACHAR NO TITULO
            if (achou == 0) {
              hinos['hinario'].forEach(function (hino) {
                var str = hino.toLowerCase();
                term = term.toLowerCase();
                if(str.match(term) && achou == 0){
                  achou = 1;
                  text +=
                  '<ons-list-item class="showAd" onclick="fn.pushPage({\'id\': \'conteudoHarpa.html\', \'title\': \''+hinos['id']+'||'+hinos['titulo']+'\'})">'+             
                  '  <div class="center" style="font-size: 15px;display:block;"><span>'+hinos['id']+' - '+hinos['titulo']+'</span>'+
                  '   <div><i style="font-size: 11px;">'+str+'</i></div>'+
                  '  </div>'+
                  '</ons-list-item>';
                }
              });
            }
          });


          if (text === '') {
            text = '<p style="text-align: center; margin: 0 0 10px 0;">Nenhum resultado encontrado</p>';
          }
          $("#resultado_pesquisa_harpa").html(text);
          $("#resultado_pesquisa_harpa").css("display","");
        }
      };
      xmlhttp.open("GET", "js/harpa.json", true);
      xmlhttp.send();
    }
  },
  pesquisaBiblia: function(term){
    var versaoId = versaoId || "viva";

    if (term != '') {
      term = term.toLowerCase();
      text = '';
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          $("#resultado_pesquisa_biblia").html('');
          var data = JSON.parse(this.responseText);
          data.forEach(function (biblia) {
            var achou = false;
            var num_cap_busca = 0;
            biblia['chapters'].forEach(function (versiculos) {
              for (var i = 0; i < versiculos.length; i++) {
                if (!achou) {
                  str = versiculos[i].toLowerCase();
                  if(str.match(term)){
                    achou = true;
                    text +=
                    '<ons-list-item onclick="fn.pushPage({\'id\': \'textoLivro.html\', \'title\': \''+biblia['abbrev']+'||'+biblia['name']+'||'+biblia['chapters'].length+'||'+(parseInt(num_cap_busca)+1)+'\'});">'+
                      '<p style="font-size: 20px;line-height:30px;text-align:justify">'+
                        versiculos[i] +
                      '</p>'+
                      '<p style="font-size: 15px;">'+biblia['abbrev'].toUpperCase()+' '+(parseInt(num_cap_busca)+1)+':'+(parseInt(i)+1)+'</p>'+
                    '</ons-list-item>';
                  }
                }
              }
              num_cap_busca = num_cap_busca + 1;
            });
          });
          if (text === '') {
            text = '<p style="text-align: center; margin: 0 0 10px 0;">Nenhum resultado encontrado</p>';
          }
          $("#resultado_pesquisa_biblia").html(text);
          // $("#resultado_pesquisa_biblia").css("display","");
        }
      };
      xmlhttp.open("GET", "js/"+versaoId+".json", true);
      xmlhttp.send();
    }
  },
  dateTime: function() {
    let now = new Date;
    let ano = now.getFullYear();
    let mes = now.getMonth() + 1;
    let dia = now.getDate();

    let hora = now.getHours();
    let min = now.getMinutes();
    let seg = now.getSeconds();

    if (parseInt(mes) < 10) {
      mes = '0'+mes;
    }
    if (parseInt(dia) < 10) {
      dia = '0'+dia;
    }
    if (parseInt(hora) < 10) {
      hora = '0'+hora;
    }
    if (parseInt(min) < 10) {
      min = '0'+min;
    }
    if (parseInt(seg) < 10) {
      seg = '0'+seg;
    }
    return ano+'-'+mes+'-'+dia+' '+hora+':'+min+':'+seg;
  },
  getIds: function() {
    window.plugins.OneSignal.getIds(function(ids) {
      window.localStorage.setItem('playerID', ids.userId);
      window.localStorage.setItem('pushToken', ids.pushToken);
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        window.localStorage.setItem('uid',uid);
      }
    });

    this.cadastraUser();
  },
  cadastraUser: function() {
    var playerID = window.localStorage.getItem('playerID');
    var pushToken = window.localStorage.getItem('pushToken');
    var uid = window.localStorage.getItem('uid');
    
    if (playerID && uid) {
      $.ajax({
        url: "https://www.innovatesoft.com.br/webservice/app/cadastraUser.php",
        dataType: 'html',
        type: 'POST',
        data: {
          'userId': playerID,
          'pushToken': pushToken,
          'uid': uid,
          'datacadastro': this.dateTime(),
          'ultimoacesso': this.dateTime(),
          'app': 'viva_v2',
        },
        error: function(e) {
        },
        success: function(a) {
        },
      });
    }
  },
  registraAcesso: function(pagina) {
    /*if (window.localStorage.getItem('uid')) {
      $.ajax({
        url: "https://www.innovatesoft.com.br/webservice/app/registraAcesso.php",
        dataType: 'json',
        type: 'POST',
        data: {
          'pagina': pagina,
          'origem': window.localStorage.getItem('uid')
        },
      });
    }*/
  },
  buscaCantor: function(id) {
    var selector = this;
    var texto = "";

    $.ajax({
      type : "GET",
      url : "js/cantor.json",
      dataType : "json",
      success : function(data){
        $(selector).each(function(){
          var myBook = null;
          var obj = {
            id : id,
            text : ""
          };
          background = '#f5f5f5';
          color = '1f1f21';
          modo_noturno = JSON.parse(localStorage.getItem('modo-noturno'));
          if (modo_noturno) {
            background = '#333';
            color = 'fff';
          }
          if (modo_noturno) {
            background = '#333';
            color = 'fff';
          }

          if (data) {
            for(i in data){
              if(data[i].id == obj.id){
                  myBook = data[i];
              }
            }

            for (var i = 0; i < myBook['hinario'].length; i++) {
              texto = myBook['hinario'][i];
              if(texto.substr(0, 1) == '*'){
                refrao = texto.replace("*","");
                obj.text += 
                '<ons-list-item style="padding:0 16px;background:'+background+';color:#'+color+';font-weight:bold">'+
                  '<p style="line-height:31px;margin:0;font-weight:bold;font-size:20px;text-align:left;background:'+background+';color:#'+color+'">'+
                    '<i>'+refrao+ 
                  '</i></p>'+
                '</ons-list-item>';
              }
              if(texto.substr(0, 1) != '*'){
                obj.text += 
                '<ons-list-item style="padding:0 16px;background:'+background+';color:#'+color+'">'+
                  '<p style="line-height:31px;margin:0;font-size:20px;text-align:left;background:'+background+';color:#'+color+'">'+
                    ''+texto+ 
                  '</p>'+
                '</ons-list-item>';
              }
            }
          }
          $("#conteudoCantor").html(obj.text);
        });
      }
    });
  },
  listaCantor: function() {
    var text = "";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        $("#listacantor").html('');
        var data = JSON.parse(this.responseText);
        data.forEach(function (hinos) {
          text +=
          '<ons-list-item class="showAd" onclick="fn.pushPage({\'id\': \'conteudoCantor.html\', \'title\': \''+hinos['id']+'||'+hinos['titulo']+'\'})">'+
          '  <div class="left"></div>'+
          '  <div class="center" style="font-size: 15px;">'+hinos['id']+' - '+hinos['titulo']+'</div>'+
          '  <div class="right"><ons-icon icon="fa-angle-right"></ons-icon></div>'+
          '</ons-list-item>';
        });
        $("#listacantor").html(text);
      }
    };
    xmlhttp.open("GET", "js/cantor.json", true);
    xmlhttp.send();
  },
  pesquisaCantor: function(term){
    if (term != '') {
      text = '';
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          $("#resultado_pesquisa_cantor").html('');
          var data = JSON.parse(this.responseText);
          var achou = 0;
          data.forEach(function (hinos) {
            //PESQUISA PELO NUMERO
            var str = hinos['id'];
            if (achou == 0) {
              if(parseInt(str) === parseInt(term)){
                achou = 1;
                text +=
                '<ons-list-item class="showAd" onclick="fn.pushPage({\'id\': \'conteudoCantor.html\', \'title\': \''+hinos['id']+'||'+hinos['titulo']+'\'})">'+             
                '  <div class="center" style="font-size: 15px;display:block;"><span>'+hinos['id']+' - '+hinos['titulo']+'</span>'+
                '   <div><i style="font-size: 11px;">'+hinos['id']+" - "+hinos['titulo']+'</i></div>'+
                '  </div>'+
                '</ons-list-item>';
              }
            }

            //PESQUISA PELO TITULO SE NAO ACHAR PELO NUMERO
            if (achou == 0) {
              var str = hinos['titulo'].toLowerCase();
              term = term.toLowerCase();
              if(str.match(term) && achou == 0){
                achou = 1;
                text +=
                '<ons-list-item class="showAd" onclick="fn.pushPage({\'id\': \'conteudoCantor.html\', \'title\': \''+hinos['id']+'||'+hinos['titulo']+'\'})">'+             
                '  <div class="center" style="font-size: 15px;display:block;"><span>'+hinos['id']+' - '+hinos['titulo']+'</span>'+
                '   <div><i style="font-size: 11px;">'+hinos['id']+" - "+hinos['titulo']+'</i></div>'+
                '  </div>'+
                '</ons-list-item>';
              }
            }

            //PESQUISA DENTRO DO HINARIO SE NAO ACHAR NO TITULO
            if (achou == 0) {
              hinos['hinario'].forEach(function (hino) {
                var str = hino.toLowerCase();
                term = term.toLowerCase();
                if(str.match(term) && achou == 0){
                  achou = 1;
                  text +=
                  '<ons-list-item class="showAd" onclick="fn.pushPage({\'id\': \'conteudoCantor.html\', \'title\': \''+hinos['id']+'||'+hinos['titulo']+'\'})">'+             
                  '  <div class="center" style="font-size: 15px;display:block;"><span>'+hinos['id']+' - '+hinos['titulo']+'</span>'+
                  '   <div><i style="font-size: 11px;">'+str+'</i></div>'+
                  '  </div>'+
                  '</ons-list-item>';
                }
              });
            }
            achou = 0;
          });

          if (text === '') {
            text = '<p style="text-align: center; margin: 0 0 10px 0;">Nenhum resultado encontrado</p>';
          }
          $("#resultado_pesquisa_cantor").html(text);
          $("#resultado_pesquisa_cantor").css("display","");
        }
      };
      xmlhttp.open("GET", "js/cantor.json", true);
      xmlhttp.send();
    }
  },
  buscaNotificacoes: function(){
    var uid = window.localStorage.getItem('uid');
    var playerID = window.localStorage.getItem('playerID');

    if (uid) {
      firebase.database().ref('notificacoes').child(uid).on('value', (snapshot) => {
        //localStorage.removeItem("lista-notificacoes");
        var notificacoes = snapshot.val();
        if (notificacoes) {
          $.each(notificacoes, function (key, item) {
            var hash = item['hash'];
            var titulo = item['titulo'];
            var mensagem = item['mensagem'];
            var lido = item['lido'];
            var data_notificacao = item['data_notificacao'];
            var link = item['link'];
            var app = item['app'];
            lista_notificacao.push({id: hash, titulo: titulo, mensagem: mensagem, lido: lido, data_notificacao: data_notificacao, link: link});
            localStorage.setItem("lista-notificacoes", JSON.stringify(lista_notificacao));
          });
          firebase.database().ref('notificacoes').child(uid).remove();
        }
      });
    }
  },
  verificaExistenciaUsuario: function(usuario, religiao, nome, email, celular) {
    var uid = window.localStorage.getItem('uid');
    var playerID = window.localStorage.getItem('playerID');
    if (usuario != "") {
      fn.showDialog('modal-aguarde');
      $.ajax({
        url: "https://www.innovatesoft.com.br/webservice/app/verificaExistenciaUsuario.php?usuario="+usuario,
        dataType: 'json',
        type: 'POST',
        data: {
          'nome': nome,
          'email': email,
          'religiao': religiao,
          'celular': celular,
          'uid': uid,
          'userId': playerID,
        },
        error: function(e) {
          var timeoutID = 0;
          clearTimeout(timeoutID);
          timeoutID = setTimeout(function() { fn.hideDialog('modal-aguarde') }, 100);
          ons.notification.alert(
            'Verifique sua conexão com a internet!',
            {title: 'Erro'}
          );
        },
        success: function(a) {
          var timeoutID = 0;
          clearTimeout(timeoutID);
          timeoutID = setTimeout(function() { fn.hideDialog('modal-aguarde') }, 100);
          if (a == true) {
            ons.notification.alert(
              'Escolha outro usuário!',
              {title: 'Erro'}
            );
          }
          else{
            window.localStorage.setItem("usuario", usuario);
            window.localStorage.setItem("nome", nome);
            window.localStorage.setItem("email", email);
            window.localStorage.setItem("religiao", religiao);
            window.localStorage.setItem("celular", celular);
            ons.notification.alert(
              'Dados atualizados com sucesso!',
              {title: 'Sucesso'}
            );
          }
        },
      });
    }
  },
  registraContato: function(assunto, email, celular, mensagem) {
    var playerID = window.localStorage.getItem('playerID');
    if (playerID != "") {
      fn.showDialog('modal-aguarde');
      $.ajax({
        url: "https://www.innovatesoft.com.br/registra-mensagem.php",
        dataType: 'json',
        type: 'POST',
        data: {
          'assunto': assunto,
          'email': email,
          'celular': celular,
          'mensagem': mensagem,
          'userId': playerID,
        },
        error: function(e) {
          var timeoutID = 0;
          clearTimeout(timeoutID);
          timeoutID = setTimeout(function() { fn.hideDialog('modal-aguarde') }, 100);
          ons.notification.alert(
            'Verifique sua conexão com a internet!',
            {title: 'Erro'}
          );
        },
        success: function(a) {
          var timeoutID = 0;
          clearTimeout(timeoutID);
          timeoutID = setTimeout(function() { fn.hideDialog('modal-aguarde') }, 100);
          ons.notification.alert(
            'Mensagem enviada com sucesso!',
            {title: 'Sucesso'}
          );
        },
      });
    }
    else{
      ons.notification.alert(
        'Tente novamente mais tarde!',
        {title: 'Erro'}
      );
    }
  },
  validacaoEmail: function(field) {
    if (field.search("@") >= 0) {
      return true;
    }
    return false;
  },
  buscaDadosUsuario: function() {
    var uid = window.localStorage.getItem('uid');
    var playerID = window.localStorage.getItem('playerID');

    if (uid) {
      $.ajax({
        url: "https://www.innovatesoft.com.br/webservice/app/buscaDadosUsuario.php",
        dataType: 'json',
        type: 'POST',
        async: true,
        data: {
          'uid': uid,
          'userId': playerID,
        },
        success: function(a) {
          if (a) {
            window.localStorage.setItem("nome", a['nome']);
            window.localStorage.setItem("usuario", a['usuario']);
            window.localStorage.setItem("email", a['email']);
            window.localStorage.setItem("celular", a['celular']);
            window.localStorage.setItem("religiao", a['religiao']);
            if (a['final_versao_pro'] == null) {
              a['final_versao_pro'] = 'NAO';
            }
            window.localStorage.setItem("versao_pro", a['final_versao_pro']);
          }
        },
      });
    }
  },
  admob: function(){
    window.plugins.insomnia.keepAwake();
    admob.banner.config({ 
      id: admobid.banner, 
      isTesting: false, 
      autoShow: true, 
    })

    if (window.localStorage.getItem("versao_pro") === 'NAO') {
      admob.banner.prepare()
    }
    
    admob.interstitial.config({
      id: admobid.interstitial,
      isTesting: false,
      autoShow: false,
    })

    if (window.localStorage.getItem("versao_pro") === 'NAO') {
      admob.interstitial.prepare()
    }

    document.getElementsByClassName('showAd').disabled = true
    document.getElementsByClassName('showAd').onclick = function() {
      admob.interstitial.show()
    }
  },
  firebase: function(){
    var firebaseConfig = {
      apiKey: "AIzaSyD2vTa8malnzRJij-1JL7YNNHGapZTtrvI",
      authDomain: "biblia-sagrada-viva.firebaseapp.com",
      databaseURL: "https://biblia-sagrada-viva-default-rtdb.firebaseio.com",
      projectId: "biblia-sagrada-viva",
      storageBucket: "biblia-sagrada-viva.appspot.com",
      messagingSenderId: "1039797489156",
      appId: "1:1039797489156:web:2210ac377b11b014bcef51",
      measurementId: "G-ZE5JQ900WT"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    firebase.auth().signInAnonymously().catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage)
    });
  }
};

app.initialize();
