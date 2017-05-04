//
//'use strict';

$(document).ready(function() {

   //
   //
    

    // ПЕРЕМЕННЫЕ
    //
    var dblclickWord = {}; // слово полученное двойным кликом
    var theSelectionWords = { // фраза полученая выделением
        content : '',
        subContent : ''
    }; 

    

    //var imgSettingsSrc = chrome.extension.getURL("images/settings4.png"); // урл иконки
    var imgArrowUp3Src = chrome.extension.getURL("images/arrow_up3.png");
    var imgSettings6Src = chrome.extension.getURL("images/settings6.png");  
    var menuContent ="<p>Сюда прилетит перевод</p>"+
                     "<a></a> ";
    var yandexHrefText = "Переведено Яндекс Переводчиком";
    var yandexHref = "http://translate.yandex.ru/";
    var status = "<a> Ничего не выделенно !</a> "+
                 "<div class='myWords_save_button'>"+
                 "Сохранить"+
                 "</div>";

    //  настройки окна
    var contentSetting = {};// тут настройки полученные по запросу из бэкраунда
    var currentContent = {};// тут текущие настройки окна (некоторые) не сохраненные
    currentContent.skypeMode = 'off';
    currentContent.telegramMode = 'off';
     // ключ на отправку сообщения с текущими настройками
    currentContent.key = 'addContentScriptSettings';

    // ключ на отправку запроса  настроек сохраненных в бэкгаунде
    var requestContentSetting = {};
    requestContentSetting.key = "newContentSetting";

    //
    // список языков перевода и текущий язык
    //
    var languageAbr, // абревиатура текущего языка перевода
        languageStr, // строка текущего языка перевода
        carrentLanguagesName = [] ,
        carrentLanguagesAbr= [] ;


    // 
    // Запрашиваем настройки окна сохраненные в бэкграунде 
    //
    if (window.Promise) {
        console.log('Promise found');
     var myPromise1 = new Promise(function(resolve, reject){

        // запрашиваем настройки окна и получаем их в промис

        chrome.runtime.sendMessage(requestContentSetting, function(response) {
          console.log('Получен ответ ', response);

          contentSetting.contentWindState = response.contentWindState || 'on';  
          contentSetting.posTop = response.posTop || '0';
          contentSetting.posLeft = response.posLeft || '0';
          contentSetting.width = response.width || '150px';
          
          
          contentSetting.height = response.height || '200px';
          contentSetting.opacity = response.opacity || '0.8';
          contentSetting.background = response.background || '#87CEFF';
          contentSetting.selPoint = response.selPoint || '25';
          contentSetting.selInputFontSize = response.selInputFontSize || '18px';
          contentSetting.offon = response.offon || 'off';
          contentSetting.allLanguagesName = response.allLanguagesName || 'Английский - русский';
          contentSetting.allLanguagesAbr = response.allLanguagesAbr || 'en';
          contentSetting.language = response.language || 'Английский - русский';


          resolve();// без вызова резолв не работает
        });
        
     });
    }
    // ---------------------------------------------------------------------------
    myPromise1.then(function(){
      //console.log('Сработал резолв', contentSetting.width);
      // перезаписываем текущие настройки
      currentContent.width = contentSetting.width;
      currentContent.selInputFontSize = contentSetting.selInputFontSize;
      currentContent.selPoint = +contentSetting.selPoint; // макс длина строки при которой меняется
       //режим запоминания - не запоминается анкор (вместо него сама строка)

      currentContent.offon =  contentSetting.offon; // текущее состояние выключателя
      currentContent.language = contentSetting.language; // текущий язык перевода

      // console.log('Сработал резолв   currentContent.offon =  ', currentContent.offoSn);
      //
      setFontFace();
      // создаем выключатель и отслеживаем его включение выключение
      offOnWindow();
      // создаем setMenu
      addSetMenu();
      // запускаем создание окна
      setContentPopup();

      // устанавливаем кнопку "сохранить"
      setSaveButtonClick();
      // скрываем окно чтобы не мешало
      hideWindow();
      //setBodyMutation();
    });
    //-----------------------------------------------------------------------------
    
    // ОТСЛЕЖИВАНИЕ выделенных слов и обработчики 
    // отслеживаем выделенные слова
    //
    document.addEventListener('mouseup', function(){
        //console.log('theSelectionWords.content', theSelectionWords.content);
        //console.log('getSelectionText()', getSelectionText());

        var theSelWordCon = theSelectionWords.content;
        var getSelTxt = getSelectionText();
        var curConOffOn = currentContent.offon;
        var conSetConWindSt = contentSetting.contentWindState;
        var skypeMode = currentContent.skypeMode;
        var telegramMode =currentContent.telegramMode;

        if (theSelWordCon != getSelTxt && curConOffOn === 'on' && conSetConWindSt === 'on' && skypeMode === 'off' && telegramMode === 'off') { //проверяем не поменялось 
            // ли слово - чтобы не отслеживать все маус апы

            theSelectionWords.content = getSelTxt;//получаем выделенные слова
       

            var theSelect = theSelectionWords.content;
            if (theSelect.length > 0 && theSelect.length <= currentContent.selPoint ){
               theSelectionWords.anchor = getContext2(); // получаем контекст
            }


            // вычисляем допустимую длину строки
            currentContent.selWordsLength = Math.floor(2 * (parseInt(currentContent.width) - 110) / parseInt(currentContent.selInputFontSize));
            //console.log('допустимая длина строки', currentContent.selWordsLength);

           if (theSelect.length === 0) {

                $('.myWords_save_button').removeClass("active");
                $('.myWords_selection_input').text('');
                $('#myWords_content p').text('');
                $('#myWords_status a').text(' Ничего не выделенно !');

            
           } else if (theSelect.length > currentContent.selWordsLength) {
                // показываем окно
                //
                $("#myWords_window").css({
                    'opacity': contentSetting.opacity,
                    
                   
                    'top': currentContent.currentTopWindow
                });

                window.setTimeout(
                    function() {
                        $("#myWords_window").css({
                            'transition': 'top 0s',
                         });

                }, 800);

               //console.log('не нормально'); // обрезаем строку и выводим статус
               $('#myWords_status a').text(' Длина строки  '+ theSelect.length + '  символов');

               theSelect = theSelect.substring(0, currentContent.selWordsLength);
               $('.myWords_selection_input').text(theSelect + '...');
               // запрашиваем и получаем и вставляем перевод строки
               // 
               //отправляем сообщение в фоновую страницу
               theSelectionWords.key = 'translate';
               //console.log("Message translate1 was send ");
               

              $('.myWords_save_button').removeClass("active"); 
              $('#myWords_status a').text(' Переводим...');
              chrome.runtime.sendMessage(theSelectionWords);
               // вставляем функцию редактирования и сохранения строки

            } else if (theSelect.length <= currentContent.selWordsLength) {

                // показываем окно
                //
                $("#myWords_window").css({
                    'opacity': contentSetting.opacity,
                    
                    'top': currentContent.currentTopWindow
                });


                window.setTimeout(
                    function() {
                        $("#myWords_window").css({
                            'transition': 'top 0s',
                         });

                }, 800);



               //console.log('нормально');
               $('.myWords_selection_input').text(theSelect);
               $('#myWords_status a').text(' Длина строки '+ theSelect.length + '  символов');
                // запрашиваем и получаем  и вставляем перевод строки
                // 
               //отправляем сообщение в фоновую страницу
                theSelectionWords.key = 'translate';
                //console.log("Message translate2 was send ");
                

                $('.myWords_save_button').removeClass("active");
                $('#myWords_status a').text(' Переводим...');
                chrome.runtime.sendMessage(theSelectionWords);

               // вставляем функцию редактирования и сохранения строки
            }
        } 


    }, false);
    //
    // ловим перевод от яндекса
    //
    chrome.runtime.onMessage.addListener(function(req){

        if (req.key == 'translateRequest') {
            theSelectionWords.translation = req.translation;
            //console.log("Message translate  ", theSelectionWords.translation);
            $('#myWords_content p').text(theSelectionWords.translation);
            $('#myWords_status a').text(yandexHrefText).attr('href', yandexHref);
            // показываем кнопку сохранить
            $('.myWords_save_button').addClass("active");

        
        
        //  ловим выключение окна
        } else if(req.key == 'contentWindState') {
            contentSetting.contentWindState =  req.content;   
            breakContentWindow();
            console.log("Вкладка активирована   "+ 'req.content = '+
             req.content+ '  pop = '+ req.pop + '  back =  '+ req.back);
           

        }


    });

   

    // =====================================================
    // тут лежат все ФУНКЦИИ примерно в порядке использования
    // =====================================================

      // ФУНКЦИЯ 1  ------------------------------
      // функция создает окошко, навешивает стили, прикрепляет обработчики ресайза
      // и перетаскивания, отслеживает остановку ресайза и перетаскивания и отправляет
      // сообщения с новыми настройками на запись
      // Цель: получить окно, размер и положение которого сохраняются на любых загруженных
      // вкладках браузера
      //  
      
    function setContentPopup(){

        // создаем окно 
        $('body').prepend(

            "<div class= 'ui-widget-content' id='myWords_window'>"+
                "<div id= 'myWords_window_inner'>"+
                    "<div id= 'myWords_header'>"+
                        "<div id= 'myWords_ofSkype_head'>"+
                            "<div class ='ofSkype_head_title'>"+
                                'Skype mode'+
                            "</div>"+
                            "<div class ='head_btn ofSkype_btn_retranslate material-icons '>"+
                                'refresh'+
                            "</div>"+
                            "<div class ='head_btn ofSkype_btn_prev material-icons '>"+
                                'arrow_back'+
                            "</div>"+
                            "<div class ='head_btn ofSkype_btn_next material-icons '>"+
                                'arrow_forward'+
                            "</div>"+
                        "</div>"+
                        "<div id= 'myWords_ofSkype_mess'>"+
                           'Ждем сообщений'+ 
                        "</div>"+
                        "<div class= 'myWords_selection_input'>"+
                        "Здесь появиться выделенные слова "+
                        "</div>"+
                        "<div class= 'myWords_icon_settings'>"+
                            "<img id='myWords_imgSettings'  src=" +
                               imgArrowUp3Src +
                            ">"+
                        "</div>"+
                    "</div>"+
                    "<div id= 'myWords_content'>"+
                    menuContent +
                    "</div>"+
                    "<div id= 'myWords_status'>"+
                    status+
                    "</div>"+
                "</div>"+
            "</div>"

        );
        
        // определяем некоторые стили
        currentContent.currentTopWindow = contentSetting.posTop;
        $("#myWords_window").css({
           // 'background': contentSetting.background,
           //'opacity': 0,
           
           //'top': contentSetting.posTop,


           'top' : '-500px',
           'left': contentSetting.posLeft,
        });

        $("#myWords_window_inner").css({
           'width': contentSetting.width,
           'height': contentSetting.height,
          'background': contentSetting.background
            //'opacity': contentSetting.opacity,
         });

        // на вложенном окне контейнера применяем ресайз

        $('#myWords_window_inner').resizable({
            minWidth: 400, // минимальные размеры окна
            minHeight: 300,
            resize: function( event, ui ) {
                $("#myWords_window").css({
                    'width': ui.size.width, // изменяем ширину и высоту наружного окошка
                    'height': ui.size.height,// так как ресайз не на нем а на вложенном
                });   
            },
            stop: function( event, ui ) { // по событию "стоп" изменяем текущие настроки окна
                currentContent.width = ui.size.width;
                currentContent.height = ui.size.height;
                chrome.extension.sendMessage(currentContent); // отправляем их на запись в бэкграунд
               // console.log("Message addContentScriptSettings was send resizable");
            }
        });

        // применяем драгбл к наружному окну (к контейнеру)
        $( "#myWords_window" ).draggable({
             containment: "window",
             
        });

        // ловим остановку перетаскивания
        $( "#myWords_window" ).on( "dragstop", function( event, ui ) {
            // преобразуем текущие координаты окна в проценты и обновляем текущие настройки
            currentContent.top = (ui.position.top / document.documentElement.clientHeight) * 100 + '%';
            currentContent.left = 100 * ui.position.left / document.documentElement.clientWidth + '%';

            // отправляем изменившиеся настройки в бэкграунд
            chrome.extension.sendMessage(currentContent);
            //console.log("Message addContentScriptSettings was send draggable");
        });

    }

    //
    //  ФУНКЦИЯ 2 ----------------------------------------
    //возвращает выделенное слово под курсором ( при дабл клике выделяется автоматически)
    //
    function getSelectionText(){
        var selectedText = "";
        if (window.getSelection){ // all modern browsers and IE9+
            selectedText = window.getSelection().toString();
        }
        return selectedText;
    }
    //
    //  ФУНКЦИЯ 3 ----------------------------------------
    //возвращает предложение вокруг выделенного слова
    // применяется только для даблклика - для выделения смотри следующую
    function getContext(){
        var selectedContext = "";

        if (window.getSelection){ // all modern browsers and IE9+
            var sel = window.getSelection();
            var offsetWord = sel.anchorOffset;//смещение
            
            //console.log('offsetWord  =    ',offsetWord);


            var stringContext = '' + sel.anchorNode.data;//текущая нода с контекстом
           
            // console.log('текущая нода с контекстом  =    ',stringContext);      
            //находим левый оффсет
            for (var i = offsetWord+1; stringContext.charAt(i) !== "!" && stringContext.charAt(i) !== "?" && stringContext.charAt(i) !== "." && i != -1; i--) {

              var offsetLeft = i;
            }
          // console.log('offsetLeft  =    ',offsetLeft);
             //находим правый оффсет
            for (i = offsetWord+2;  stringContext.charAt(i) !== "!" && stringContext.charAt(i) !== "?" && stringContext.charAt(i) !== "." && i != stringContext.length; i++) {

              var offsetRigt = i+2;
            }
           // console.log('offsetRigt  =    ',offsetRigt);
           // вырезаем кусок строки
            selectedContext = stringContext.slice(offsetLeft,offsetRigt);
             console.log('selectedContext  =  ',selectedContext);

        }
        return selectedContext;
    }

    //

    //
    //  ФУНКЦИЯ 3/2 ----------------------------------------
    //возвращает предложение вокруг выделенного слова
    // применяется только для выделения - для даблклика смотри раньше
    function getContext2(){
        var selectedContext = "";
        if (window.getSelection){ // all modern browsers and IE9+
            var sel = window.getSelection();
            var offsetWord = sel.anchorOffset;//смещение

            //var conteiner= sel.anchorNode.parentNode;//нода с контекстом
            //var stringContext = conteiner.innerHTML;//строка с контекстом
           // console.log('offsetWord  =    ',offsetWord);
            var selLength = ''+ sel;
            selLenghth = selLength.length;
            var leftPoint = offsetWord - selLenghth - 1;
            var stringContext =''+ sel.anchorNode.data;//текущая нода с контекстом
           // var stringContext = conteiner;//строка с контекстом
           //  console.log('текущая нода с контекстом  =    ',stringContext);
           //  console.log('leftPoint  =    ',leftPoint);
           //  console.log('stringContext.charAt(leftPoint)  =    ',stringContext.charAt(leftPoint));


            if (leftPoint > 0) {

               for (i = leftPoint; stringContext.charAt(i) !== "!" && stringContext.charAt(i) !== "?" && stringContext.charAt(i) !== "." && i != -1; i--) {

                  var offsetLeft = i;
                }


            } else {
                var offsetLeft = 0;
            }

          // console.log('offsetLeft  =    ',offsetLeft);

             //находим правый оффсет
            for (i = offsetWord;  stringContext.charAt(i) !== "!" && stringContext.charAt(i) !== "?" && stringContext.charAt(i) !== "." && i != stringContext.length + 1; i++) {

              var offsetRigt = i;
            }
            offsetRigt = offsetRigt + 1;
           // console.log('offsetRigt  =    ',offsetRigt);

           // вырезаем кусок строки

            selectedContext = stringContext.slice(offsetLeft,offsetRigt);
           //  console.log('selectedContext  =  ',selectedContext);

        }
        return selectedContext;
    }









    //  ФУНКЦИЯ 4 ----------------------------------------
    // устанавливаем обработчик клика на кнопку сохранить
    // и сохраняет фразу по клику
    function setSaveButtonClick(){
        $(".myWords_save_button").off("click").on('click', function(){
            console.log("Клик по кнопке сохранить  ", theSelectionWords.content);
            var maxLenght = 70;
            var wordContent = theSelectionWords.content;
            var wordAnchor = theSelectionWords.anchor;
            var wordLenght = theSelectionWords.content.length; // длина фразы
            dblclickWord.key = "addTheWord";//ключ чтобы распознать сообщение

            if (wordLenght > 0 && wordLenght <= currentContent.selPoint){ // если меньше установленного значения
                // то анкор сохраняем отдельно

                dblclickWord.someWord = wordContent;
                dblclickWord.сontext = wordAnchor;
                  //отправляем сообщение в фоновую страницу
                chrome.extension.sendMessage(dblclickWord);


            } else if (wordLenght > currentContent.selPoint && wordLenght <= maxLenght){ // проверяем что оно длинне нуля
                              
                  dblclickWord.someWord = wordContent;
                  dblclickWord.сontext = wordContent;
                  //отправляем сообщение в фоновую страницу
                  chrome.extension.sendMessage(dblclickWord);
                  //console.log("Message addTheWord was send ");
            } else if (wordLenght > maxLenght ){

                wordContent = wordContent.substring(0, maxLenght);
                dblclickWord.someWord = wordContent;
                dblclickWord.сontext = wordContent;
                  //отправляем сообщение в фоновую страницу

                chrome.extension.sendMessage(dblclickWord);
            }

        });  


    }

    //  ФУНКЦИЯ 5 ----------------------------------------
    // устанавливаем обработчик клика на кнопку настроек для скрытия окна
    //  временное решение 0.51
    //
    function hideWindow(){
        $(".myWords_icon_settings").off("click").on('click', function(){

             hideWindowHandler();
            

        });  

    } 
    //  ФУНКЦИЯ 5/h  обработчик для ф5 ----------------------------------------
    function hideWindowHandler(){
         if($("#myWords_window").css('top') != '-500px'){
                currentContent.currentTopWindow = $("#myWords_window").css('top');
             }

            $("#myWords_window").css({
                //'opacity': '0',
                'top' : '-500px',
                'transition': 'top 0.6s'
            });
    }

    //  ФУНКЦИЯ     опускает окно ----------------------------------------
    function downWindowHandler(){
         if($("#myWords_window").css('top') === '-500px'){
                currentContent.currentTopWindow = $("#myWords_window").css('top');
             }

            $("#myWords_window").css({
                //'opacity': '0',
                'top' : '0px',
                'transition': 'top 0.6s'
            });
    }


    //  ФУНКЦИЯ 6 ----------------------------------------
    //  рисуем кнопку активации приложения
    //  навешиваем на нее обработчик который записывает состояние
    // 
    function offOnWindow(){

        if(currentContent.offon === 'off' ){
            $('body').prepend(
                "<div id='myWords_offon'>"+
                  'OFF' +
                "</div>"
            );
        } else {
            $('body').prepend(
                "<div id='myWords_offon' class ='active'>"+
                  'ON' +
                "</div>"
            );
        }

        $("#myWords_offon").off("click").on('click', function(){
            
            if (currentContent.offon === 'on'){
                $("#myWords_offon").removeClass('active');
                currentContent.offon = 'off';

                $("#myWords_offon").text('OFF');
                   
                if($("#myWords_window").css('top') != '-500px'){
                    currentContent.currentTopWindow = $("#myWords_window").css('top');
                }
                   $("#myWords_window").css({
                       // 'opacity' : '0',
                       'top' : '-500px',
                       'transition': 'top 0.6s'
                    });
                  // перезаписываем настройку в фоне
                  chrome.extension.sendMessage(currentContent); // отправляем их на запись в бэкграунд
                   // console.log("Message addContentScriptSettings was send resizable");
                } else {
                  $("#myWords_offon").addClass('active');
                  currentContent.offon = 'on';
                  $("#myWords_offon").text('ON');

                  chrome.extension.sendMessage(currentContent); // отправляем их на запись в бэкграунд
                  //console.log("Message addContentScriptSettings was send resizable");
            }

        });

        if (contentSetting.contentWindState === 'off' ) {
            $('#myWords_offon').css('display','none');
        }

    }


    //  ФУНКЦИЯ 7 ---------------------  МЕНЮ НАСТРОЕК -------------------
    //  создаем выезжающее меню - при длительном ховере на кнопку включения
    //  навешиваем на нее обработчик который записывает состояние
    // 

    function addSetMenu (){

        $('body').prepend(
                "<div id='myWords_setmenu'>"+
                   "<div id='myWords_setmenu_offon'>"+
                      "<img id='myWords_imgSetmenu_offon'  src=" +
                            imgSettings6Src +
                       ">"+  
                       "<span class= 'myW_offon_left'>"+
                            'move'+
                            '<div class="material-icons">arrow_back</div>'+
                       "</span>" +
                       "<span class= 'myW_offon_up'>"+
                           
                       "</span>"+ 
                   "</div>"+

                   "<div id='myWords_setmenu_language'>"+
                   
                   "</div>"+
                   "<div id='myWords_setmenu_opacity'>"+
                   
                   "</div>"+
                   "<div id='myWords_setmenu_skine'>"+
                   
                   "</div>"+
                   "<div id='myWords_setmenu_notes'>"+
                      "<div id='myWords_skype_on' class = 'on_btn'>"+
                        'Skype Off'+
                      "</div>"+
                      "<div id='myWords_telegram_on' class = 'on_btn'>"+
                        'T'+
                      "</div>"+
                      "<div id='myWords_3_on' class = 'on_btn'>"+
                        '3'+
                      "</div>"+

                   "</div>"+

                "</div>"
        );

        $("#myWords_setmenu_offon").off("click").on('click', function(){
            if($("#myWords_setmenu").hasClass('active')){
                $("#myWords_setmenu").removeClass('active');
            } else {
                $("#myWords_setmenu").addClass('active');
            }
        }); 

        getLanguage(); // получаем языки

        var carrentActiveIndx; // текущий индекс активного спана .myW_lang
        var nameLength = carrentLanguagesName.length;

        for(var i = 0; i < nameLength; i++){
            var langAbrHtml =   "<div class= 'myW_lang' id= 'myW_lang_"+ i +"'>"+
                                    "<span class= 'myW_lang_abr'>"+
                                        carrentLanguagesAbr[i] +
                                     "</span>" +
                                     "<span class= 'myW_lang_name'>"+
                                        carrentLanguagesName[i] +
                                    "</span>"+ 
                                "</div>"; 

           $("#myWords_setmenu_language").append(langAbrHtml);
           if(carrentLanguagesName[i] === languageStr) {
               $("#myW_lang_"+ i).addClass('active');
               carrentActiveIndx = i; 
           }
        }

        // устанавливаем обработчики клика на языки
        //
        for(i = 0; i < nameLength; i++){

            (function(){
                  var j = i;
                  
                  $("#myW_lang_"+ j).off("click").on('click', function(){
                        $("#myW_lang_"+ carrentActiveIndx).removeClass('active');
                        carrentActiveIndx = j;
                        $("#myW_lang_"+ j).addClass('active');
                        currentContent.language = carrentLanguagesName[j];
                        chrome.extension.sendMessage(currentContent); // отправляем их на запись в бэкграунд

                  });

            })();

        }

        if (contentSetting.contentWindState === 'off' ) {
            $('#myWords_setmenu').css('display','none');
        }
        // устанавливаем обработчик на включение skype режима
        $('#myWords_skype_on').off("click").on('click', function(){

            if($('#myWords_skype_on').is('.active')){
               $('#myWords_skype_on').removeClass('active');
               $('#myWords_skype_on').text('Skype Off');
               $('#myWords_window_inner').removeClass('skype');
               $('body').removeClass('skype');
               currentContent.skypeMode = 'off'; 
               // поднимаем окно
               hideWindowHandler();
               // выключаем обзервер
               observerForSkype.disconnect();
               // убираем скайп контейнер
               $('#myWordsSkypeContainer').remove();
             
            }  else { // включение скайп режима
               $('#myWords_skype_on').addClass('active');
               $('#myWords_skype_on').text('Skype ON');
               $('#myWords_window_inner').addClass('skype');
               $('#myWords_telegram_on').removeClass('active');
               $('body').addClass('skype');
               // прячем меню 
               $("#myWords_setmenu").removeClass('active');
               currentContent.telegramMode = 'off';
               currentContent.skypeMode = 'on';
               // опускаем окно
               //downWindowHandler(); // временно
               // вставляем скайп контейнер
               setSkypeContainer('#shellMainStage');
               // включаем обзервер
               //setSkypeMutation();
            }

        });
        // устанавливаем обработчик на включение telegram режима
        $('#myWords_telegram_on').off("click").on('click', function(){

            if($('#myWords_telegram_on').is('.active')){
               $('#myWords_telegram_on').removeClass('active');
               
               $('#myWords_window_inner').removeClass('telegram');
               $('#myWords_window_inner').removeClass('skype'); 
               currentContent.telegramMode = 'off'; 
               // поднимаем окно
               hideWindowHandler();
               // выключаем обзервер
              observerForTelegram.disconnect();
             
            }  else { // включение скайп режима
               $('#myWords_telegram_on').addClass('active');
               $('#myWords_window_inner').addClass('skype');
               $('#myWords_window_inner').addClass('telegram');
               $('#myWords_skype_on').removeClass('active');
               currentContent.skypeMode = 'off';
               currentContent.telegramMode = 'on';

               // опускаем окно
               downWindowHandler();
               // включаем обзервер 
               setTelegramMutation();
            }

        });
        

    }

    //
    //  ФУНКЦИЯ преобразовывает текущее строковое значение языка перевода в абревиатуру
    //
    function getLanguage () {
        languageStr = currentContent.language;
        carrentLanguagesName = contentSetting.allLanguagesName.split(';');
        carrentLanguagesAbr = contentSetting.allLanguagesAbr.split(';');
        var nameLength = carrentLanguagesName.length;
        if(nameLength > 0 && nameLength === carrentLanguagesAbr.length) {
            for(var i = 0; i < nameLength; i++){
                if(carrentLanguagesName[i] === languageStr){
                    languageAbr = carrentLanguagesAbr[i];
                }
            }
        }
    }

    //
    // ФУНКЦИЯ  тушит окно
    //
    function breakContentWindow () {
       if(contentSetting.contentWindState === 'off'){

        hideWindowHandler();
        $('#myWords_setmenu').css('display','none');
        $('#myWords_offon').css('display','none');
       } else {
          $('#myWords_setmenu').css('display','block');
        $('#myWords_offon').css('display','block');  
       }
    }

    //--  content js   -------------------------------------------------
     // !!!!   фУНКЦИЯ   !!!!!!!!!   FOR  SKYPE  !!!!!!!!!!!!!!!
     //
     // 
     // 
    var observerForSkype; 
    function setSkypeMutation() {
      
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

      var observeSkypeEl;
      var inMessSkypeEl;
      var inMessDataNew;
      var inMessDataOld;
      var mutationCounter = 0;
    
      observerForSkype = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
        
          //  inMessSkypeEl.setAttribute('check', 'New 12345');
            mutationCounter++;
            if(mutationCounter === 1){
                inMessDataNew = inMessSkypeEl.textContent; 
                if(inMessDataNew != inMessDataOld){
                 // inMessDataNew =  cutStartOfMess(inMessDataNew); 
                 //console.log('inMessData2 ', inMessDataNew);
                }
                 inMessDataNew =  cutStartOfMess(inMessDataNew); 
                 console.log('inMessData2 ', inMessDataNew);
                 setSkypeMessHdlr(inMessDataNew);

                setTimeout(function(){
                   mutationCounter = 0; 
                },50);

            }
           
            
          });    
      });

      // настраиваем наблюдатель
      var config = { attributes: true, childList: true, characterData: true }
       
      // передаем элемент и настройки в наблюдатель

      setTimeout(function(){
       
        inMessSkypeEl = document.querySelector('.conversationHistory > div[role = "log"]');
        inMessDataOld = inMessSkypeEl.textContent;
        observeSkypeEl = document.querySelector('.messageHistory[data-swx-testid="messageHistory"]');
        //observeSkypeEl.setAttribute('lang', 'New 12345');
        
        observerForSkype.observe(observeSkypeEl, config);

      },500);
 
      
    }
    //--  content js   -------------------------------------------------
     // !!!!   фУНКЦИЯ   !!!!!!!!!   FOR  TELEGRAM  !!!!!!!!!!!!!!!
     //
     // 
     //
    var observerForTelegram;
    function setTelegramMutation() {
      
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

      var observeTelegramEl;
      var inMessTelegramEl;
      var inMessDataNew;
      var inMessDataOld;
      var mutationCounter = 0;
    
      observerForTelegram = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
       // console.log('поймали');
          inMessTelegramEl = document.querySelector('.im_history_messages_peer');
         inMessTelegramEl = inMessTelegramEl.querySelector('.im_history_message_wrap:last-child');
         inMessTelegramEl = inMessTelegramEl.querySelector('.im_content_message_wrap');
         inMessTelegramEl = inMessTelegramEl.querySelector('.im_message_text');  

          inMessDataNew = inMessTelegramEl.textContent;
          console.log('поймали            ', inMessDataNew );
          setSkypeMessHdlr(inMessDataNew);
                      
            
          });    
      });

      // настраиваем наблюдатель
      var config = { attributes: true, childList: true, characterData: true }
       
      // передаем элемент и настройки в наблюдатель

      setTimeout(function(){
       
        //inMessTelegramEl = document.querySelector('.im_history_messages_peer > .im_history_message_wrap:last-child');
        //inMessTelegramEl.setAttribute('lang', 'New 1234577777777777777777777777');
        observeTelegramEl = document.querySelector('.im_history_messages_peer');
        //observeTelegramEl.setAttribute('lang', 'New 12345');
        //console.log('inMessData2 ');
        observerForTelegram.observe(observeTelegramEl, config);

      },500);
 
      
    }




    // ФУНКЦИЯ 
    //
    //  вырезаем начало меседжа до запятой

    function cutStartOfMess(mess) {
      var pos = mess.indexOf(',') + 1;
      return mess.substring(pos);
    }

    // ФУНКЦИЯ 
    // 
    //  

    function setSkypeMessHdlr(mess) {
      mess = ''+ mess;  
      $('#myWords_ofSkype_mess').text(mess);

      //отправляем сообщение в фоновую страницу
      theSelectionWords.key = 'translate';
      theSelectionWords.content = mess;
      $('.myWords_save_button').removeClass("active"); 
      $('#myWords_status a').text(' Переводим...');
      chrome.runtime.sendMessage(theSelectionWords);

    }
   
    // !!!!   фУНКЦИЯ   !!!!!!!!!   FOR  SKYPE  !!!!!!!!!!!!!!!
     //  вставляем скайп контейнер на страницу скайпа
     //  targetEl === '#shellMainStage'
     // 

    function setSkypeContainer(targetEl) {

       var skypeContainer = "<div id='myWordsSkypeContainer'>"+
                              "<div class='myWordsSkConWrap'>"+
                                "<div class='sk_in sect'>"+

                                  "<div class='sk_in_header head'>"+
                                    "<div class='sk_in_icon icon material-icons'>"+
                                       "person"+ 
                                    "</div>"+
                                    "<div class='sk_in_headerBody headerBody'>"+
                                       
                                        "Входящий пользователь"+
                                    "</div>"+   
                                  "</div>"+

                                  "<div class='sk_in_body inBody'>"+
                                    "<div class='sk_in_bodyMesCont bodyMesCont'>"+
                                    "</div>"+
                                    "<div class='sk_in_inbox inbox'>"+
                                    "</div>"+
                                  "</div>"+

                                "</div>"+

                                "<div class='sk_out sect'>"+

                                  "<div class='sk_out_header head'>"+
                                    "<div class='sk_out_icon icon material-icons'>"+
                                       "person"+ 
                                    "</div>"+
                                    "<div class='sk_out_headerBody headerBody'>"+
                                        "Исходящий пользователь"+ 
                                    "</div>"+  
                                  "</div>"+

                                  "<div class='sk_out_body inBody'>"+
                                    "<div class='sk_out_bodyMesCont bodyMesCont'>"+
                                    "</div>"+
                                    "<div class='sk_out_inbox inbox'>"+
                                    "</div>"+
                                  "</div>"+

                                "</div>"+    
                              "</div>"+
                           "</div>";

      $(targetEl).after(skypeContainer);
      
    }

     // ФУНКЦИЯ
     //  устанавливает фонтфейс
     // 

    function setFontFace() {

      var newStyle = document.createElement('style');
      var fontName = 'Material Icons';
      var fontURL = chrome.extension.getURL("fonts/MaterialIcons-Regular.woff2");


      newStyle.appendChild(document.createTextNode("\
      @font-face {\
          font-family: '" + fontName + "';\
          src: url('" + fontURL + "') format('woff2');\
      }\
      "));

      document.head.appendChild(newStyle);
    }


}); 