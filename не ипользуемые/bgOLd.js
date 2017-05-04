//
'use strict';

(function backgroundFunction ()  {



    //  ФУНКЦИИ
    //функция приводит  дату  к нормальному виду
    function todayString(today){
      var dayString = today.getDate()+"."+(parseInt(today.getMonth())+1)+"."+ today.getFullYear();
        return dayString;
    }
    //========================================
    // ПЕРЕМЕННЫЕ

    //дата
    var today = new Date();
    var currentDate = todayString(today);

    //----------------------------------------
    // настройки языка перевода
    //
    var allLanguages = {
        name : [
            'Английский - русский',
            'Польский - русский',
            'Датский - русский',
            'Голандский - русский',
            'Немецкий - русский',
            'Французкий - русский'
        ],
        abr : [
            'en',
            'pl',
            'da',
            'nl',
            'de',
            'fr'
        ],
        nameStr : function (){
                    return this.name.join(';');
                },
        
        abrStr : function (){
                    return this.abr.join(';');
                }

    };
     //категория
    let category = {
        keyId: '',
        name: '',
        iconName: '',
        color: '',
        elIdList: []
     };
     //
     //

    localStorage["myWords_allLanguagesName"] = allLanguages.nameStr();
    localStorage["myWords_allLanguagesAbr"] =  allLanguages.abrStr(); 
    localStorage["myWords_language"] = localStorage["myWords_language"] || 'Английский - русский'; // по умолчанию английский

    var languageTr,
        languageStr,
        carrentLanguagesName = [] ,
        carrentLanguagesAbr= [] ;

    function getLanguage () {
        languageStr = localStorage["myWords_language"];
        carrentLanguagesName = localStorage["myWords_allLanguagesName"].split(';');
        carrentLanguagesAbr = localStorage["myWords_allLanguagesAbr"].split(';');
        var nameLength = carrentLanguagesName.length;
        if(nameLength > 0 && nameLength === carrentLanguagesAbr.length) {
            for(var i = 0; i < nameLength; i++){
                if(carrentLanguagesName[i] === languageStr){
                    languageTr = carrentLanguagesAbr[i];
                }
            }
        }
    }

  //===========================================================================
не нужно

    //
    //  варианты яндекса : pl- польский, de - немецкий, fr - французкий, es - испанский
    //------------------------------
    // Настройки попапа
    //
    // удаление элемента базы по даблклику если 0 то удаление по нажатию на крестик
    localStorage["myWords_popupSetDblClicRemove"] = localStorage["myWords_popupSetDblClicRemove"] ||'0';
    localStorage["myWords_popupSetDblClicRemove"] = '0'; // удаление элемента базы по даблклику

//=============пока не нужно ==============================================================
    //------------------------------------
    // настройка счетчика слов - в бейджике расширения
    localStorage["myWords_wordsCounter"] = 0; // обнуляем при загрузке

    //----------------------------
    // уведомление
    //звук уведомления
    var myaudio = new Audio('sfind.wav');
    myaudio.volume = 0.1;
    //время показа уведомления
    var timeShowNotification = 5000;

//===========================================================================
    //----------------------------------
    // ключ доступа к сервису яндекса
    var yandexUrl = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20151220T165032Z.57a96df4f44c42f3.320614a58ab586a2ce7158293e4e62eefc24d98b";

//===========================================================================
    

    //база данных
        var myDbName = "DictionaryDb3";
        
        var request = indexedDB.open(myDbName);
        var db;
      
      request.onerror = function(event){
        console.log(' Какая то ошибка !!! ' + event.target.errorCode);
        //Сюда надо написать обработчик ошибки
      };

      request.onsuccess = function(event) {
          let db = request.result; 
         console.log(  'версия БД =    ',  db.version);
         db.close();
       };



    // создание хранилища
      request.onupgradeneeded = function(){
        console.log('onupgradeneeded  сработал');
        let db = request.result;
        console.log(  'старая версия БД =    ',  db.oldVersion);    

        let store1 = db.createObjectStore("myWords", {
            keyPath: "time",
            autoIncrement: false
        });
        store1.createIndex("by_time", "time");
        console.log('Хранилище myWords создано');

        let store2 = db.createObjectStore("category", {
            keyPath: "keyId",
            autoIncrement: false
        });
        store2.createIndex("by_keyId", "keyId");
        store2.createIndex("by_name", "name");
        store2.createIndex("by_iconName", "iconName");
        store2.createIndex("by_color", "color");    
        console.log('Хранилище category создано');

      };
    //-----------------------------------------



    //текущее полученное слово
    var lastWord= {
        time:"",
        date:"",
        word:"",
        context:"",
        translation:"",
        category : []
        
    };
    // console.log('lastWord.category=  ', lastWord.category[0] + '  '+ lastWord.category[1]);
    //--------------------------------------

    //настройки окна контент скрипта
    localStorage["myWords_conScriptOpacity"] = 0.9;
    localStorage["myWords_conScriptBackground"] = '#bae3ff';
    localStorage["myWords_conScriptSelPoint"] = '25';
    //localStorage["myWords_conScriptOffOn"] = 'off';
  var conScriptSettings = {
        contentWindState : localStorage["myWords_contentWindState"] || 'on',
        posTop : localStorage["myWords_conScriptPosTop"] || '0',
        posLeft : localStorage["myWords_conScriptPosLeft"] || '70%',
        width : localStorage["myWords_conScriptWidth"] || '300px',
        height : localStorage["myWords_conScriptHeight"] || '400px',
        opacity : localStorage["myWords_conScriptOpacity"] || '0.8',
        background : localStorage["myWords_conScriptBackground"] || '#bae3ff',
        selPoint : localStorage["myWords_conScriptSelPoint"] || '25',
        selInputFontSize : localStorage["myWords_conScriptSelInputFontSize"] || '18px',
        offon : localStorage["myWords_conScriptOffon"] || 'off',
        allLanguagesName : localStorage["myWords_allLanguagesName"],
        allLanguagesAbr : localStorage["myWords_allLanguagesAbr"],
        language : localStorage["myWords_language"]

    };


//--------------------------------------

    //слушаем сообщения из других окон

    chrome.extension.onMessage.addListener(function(request_mess, sender, sendResponse){

      if(request_mess.key=="addTheWord"){ //проверяем что сообщение на добление слова в базу
              lastWord.word = request_mess.someWord;
              lastWord.context = request_mess.сontext;

 /*       //считаем полученные слова за текущий день

        if (localStorage["myWords_Current Date"] !== currentDate){
            localStorage["myWords_wordsCounter"] = 1;
            localStorage["myWords_Current Date"] = currentDate;

            //выводим циферку сверху иконки расширения

            chrome.browserAction.setBadgeText({text:"" + localStorage["myWords_wordsCounter"]});
        } else {
            localStorage["myWords_wordsCounter"]++;
            chrome.browserAction.setBadgeText({text:"" + localStorage["myWords_wordsCounter"]});

        }
*/
       // счетчика слов - в бейджике расширения ---------------------------
        localStorage["myWords_wordsCounter"]++;
        //выводим циферку сверху иконки расширения
        chrome.browserAction.setBadgeText({text:"" + localStorage["myWords_wordsCounter"]});
        //-----------------------------------------------------------------
        //
        // создаем уведомление --------------------------------------
        (function notifyMe() {
          // Let's check if the browser supports notifications
          if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
          }

          // Let's check whether notification permissions have alredy been granted
          else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification("Словарик не спит!",{
                 body: 'Слово   '+lastWord.word + "   записано в базу",
                 icon :  'icon.png' ,
                
                 requireInteraction: false
            });

            
            setTimeout(notification.close.bind(notification), timeShowNotification);
          }

          // Otherwise, we need to ask the user for permission
          else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
              // If the user accepts, let's create a notification
              if (permission === "granted") {
                var notification = new Notification("Hi there-0000000!");
              }
            });
          }
         
        })(); // -------------------------------------------------------------
        //


/*      //голосовое оповещение
           chrome.tts.getVoices(
          function(voices) {
            for (var i = 0; i < voices.length; i++) {
              console.log('Voice ' + i + ':');
              console.log('  name: ' + voices[i].voiceName);
              console.log('  lang: ' + voices[i].lang);
              console.log('  gender: ' + voices[i].gender);
              console.log('  extension id: ' + voices[i].extensionId);
              console.log('  event types: ' + voices[i].eventTypes);
            }
          });   
          chrome.tts.speak('Sochranil');  
*/

        //проиграем звук оповещения --------------------------
        myaudio.play();  
        //----------------------------------------------------
        //
        //заполняем поля текущим временем
         var parent = /[а-яёЁ]/i,
        language = "",
        resTranslate = "",
        yandexRequest ="",
        params = {};

         // ???  var onTranslateSender = {};   



         lastWord.time = ''+ Date.now();
        
         lastWord.date = '';
        // проверяем язык перевода
        languageTr = getLanguage();

        language = (parent.test(lastWord.word))? 'ru-'+languageTr : languageTr+'-ru';

        params = {
          text: lastWord.word,
          lang: language
        };
      
        var yandexRequest =""+ yandexUrl+ '&'+ $.param(params);
         
      //console.log(' yndexRequest: ', yndexRequest);
   
        $.getJSON(yandexRequest,function(res){
               //$('#result').text("");
               
               for (var i in res.text) {
                  //$('#result').text($('#result').text() + res.text[i] + " ");
                  var resalt = "";
                  resTranslate = resalt + res.text[i] + " ";
                  
              }
              lastWord.translation = resTranslate;
                
            // console.log(' Time: ', lastWord.time);
            // console.log(' Дата: ', lastWord.date);
            /// console.log(' Принято слово: ', lastWord.word);
           //  console.log(' Находится в предложении: ', lastWord.context);
           //  console.log(' Перевод слова: ', lastWord.translation);

            //соединяемся с базой и сохраняем данные
            request = indexedDB.open(myDbName);
                console.log('соединяемся с базой');
            request.onerror = function(event){
                console.log(' Какая то ошибка !!! ' + event.target.errorCode);
                //Сюда надо написать обработчик ошибки
            };

            request.onsuccess = function (){
                let db = request.result;
                console.log('открываем хранилище');
                let tx = db.transaction("myWords", "readwrite");
                let store = tx.objectStore("myWords");
                //console.log('lastWord.category=  ', lastWord.category[0] + '  '+ lastWord.category[1]);
                let request2 = store.put ({
                    time: lastWord.time,
                    date: lastWord.date,
                    word: lastWord.word,
                    context: lastWord.context,
                    translation: lastWord.translation,
                    category: lastWord.category

                });
                
                request2.onsuccess= function(){
                     console.log(' Данные сохранились ');
                };
                request2.onerror= function(){
                    console.log(' Во время сохранения данных произошла ошибка');
                };
                 db.close();
            }; 



        });

     } else if(request_mess.key=="remove"){
        //
        // продолжаем слушать сообщения с другими ключами
        //
           console.log('Получено сообщение ', request_mess.key);
       
        //проверяем ключ на удаление
         
            //  var removeId = +request_mess.id;//id надо преобразовать к числу
              
            // console.log(' Принято removeId ', removeId);

             removeElFromDb ("DictionaryDb2", "myWords", request_mess.id);

         

      } else if (request_mess.key == "newContentSetting"){

            console.log('Получено сообщение ', request_mess.key);
                           
            sendResponse(conScriptSettings);
           //console.log('Отправлен ответ ', conScriptSettings);
            

      } else if (request_mess.key == "addContentScriptSettings"){ // перезапись состояний контент скрипта
           console.log('Получено сообщение ', request_mess.key);
                
           localStorage["myWords_conScriptPosTop"] = request_mess.top || conScriptSettings.posTop;
           localStorage["myWords_conScriptPosLeft"] = request_mess.left || conScriptSettings.posLeft;
           localStorage["myWords_conScriptWidth"] = request_mess.width || conScriptSettings.width;
           localStorage["myWords_conScriptHeight"] = request_mess.height || conScriptSettings.height;
           localStorage["myWords_conScriptOffon"] = request_mess.offon || conScriptSettings.offon;
           localStorage["myWords_language"] = request_mess.language || conScriptSettings.language;


           conScriptSettings.posTop = request_mess.top || conScriptSettings.posTop;
           conScriptSettings.posLeft = request_mess.left || conScriptSettings.posLeft;
           conScriptSettings.width = request_mess.width || conScriptSettings.width;
           conScriptSettings.height = request_mess.height || conScriptSettings.height;
           conScriptSettings.offon = request_mess.offon || conScriptSettings.offon;
           conScriptSettings.language = request_mess.language || conScriptSettings.language; 



           //console.log('Настройки окна изменены '+ ' localStorage["myWords_conScriptOffon"] =  ' , localStorage["myWords_conScriptOffon"]);
           //console.log('Настройки окна изменены '+ ' conScriptSettings.width =  '+ conScriptSettings.width);
         
      }  else if (request_mess.key == "translate"){
            //
            // тут мы просто отправляем запрос на перевод без записи
            // 

            lastWord.word = request_mess.content;
             console.log('Получено сообщение ', request_mess.key);
        
            parent = /[а-яёЁ]/i;

            // проверяем язык перевода
            languageTr = getLanguage();
            
            language = (parent.test(lastWord.word))? 'ru-'+languageTr : languageTr+'-ru';
            params = {
              text: lastWord.word,
              lang: language
            };
      
            yandexRequest = ""+ yandexUrl +'&'+ $.param(params);
           // console.log(' yndexRequest translate: ', yandexRequest);
   
            $.getJSON(yandexRequest,function(res){
                      
               for (var i in res.text) {
                  
                  var resalt = "";
                  resTranslate = resalt + res.text[i] + " ";
                }
                lastWord.translation = resTranslate;
                //console.log(' yndex resTranslate: ', lastWord.translation);

                lastWord.key = 'translateRequest';
                chrome.tabs.query ({ currentWindow :  true , active :  true }, function(tabArray){
                   // console.log('tabArray [ 0 ]. id = ',  tabArray[0].id);
                    chrome.tabs.sendMessage ( tabArray[0].id ,lastWord); 
                });
                    
            });

      } 
      // ФУНКЦИЯ отправляет месаджи в активную вкладку на закрытие окошка
      // 
       var activateFF = {};
       activateFF.back = 0; 
       chrome.tabs.onActivated.addListener(function (activeTab) {
            activateFF.back++;
            activateFF.key = 'contentWindState';
            activateFF.content = localStorage["myWords_contentWindState"];
             chrome.tabs.sendMessage ( activeTab.tabId , activateFF);
           

       }); 

       //
       //
       //
      // ФУНКЦИЯ удаляет элементы из базы
      //
      // dbName = "DictionaryDb2";  storage = "myWords"; removeId = lastWord.time
      //
      function removeElFromDb (dbName, ver, storage, removeId) {
           let delId = ''+ removeId; 
          request = indexedDB.open(dbName);
                      console.log('соединяемся с базой');
                  request.onerror = function(event){
                      console.log(' Какая то ошибка !!! ' + event.target.errorCode);
                      //Сюда надо написать обработчик ошибки
                  };

                  request.onsuccess = function (){
                      db = request.result;
                      console.log('открываем хранилище');
                      var tx = db.transaction(storage, "readwrite");
                      var store = tx.objectStore(storage);
                      console.log(' Принято removeId ', delId);
                      var request2 = store.delete(delId);

                      request2.onsuccess = function() {
                          console.log('Запись удалена');
                      };

                      request2.onerror = function() {
                         console.log(request2.error.message);
                      };
                      console.log('База закрывается - функция удаления');
                       db.close();
                  };

      }


    });

     
/*
  
*/
  



})();