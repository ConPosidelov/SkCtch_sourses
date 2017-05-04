//
//  SkypeCatcher - сокращение SkCtch
//
//
'use strict';
import * as SC from "./variables/someConstant";
import * as EL from "./variables/interfaceEl";
import * as KEY from "./variables/queryKeys";

import {setOnBtnListener} from "./settings/setOnBtnListener";
import {createSkCtchMode} from "./settings/setOnBtnListener";
import {createOnBtn} from "./settings/setOnBtnListener";
import {getContentSettingsFromBack} from "./settings/getContentSettingsFromBack";

import {getLanguageAbr} from "./interface/languages";
import {setLanguagesMenu} from "./interface/languages";
import {getUsersFromSkype} from "./interface/users";
import {refreshInUser} from "./interface/users";


import {createMainMessWindow} from "./interface/createMainMessWindow";
import {setFontFace} from "./interface/createMainMessWindow";



import {getHistory} from "./messages/history";


import {onMessFromBgLstr} from "./messages/dataFromBack";


import {lstSkypeReceptionMess} from "./messages/lstSkypeReceptionMess";
//import {setSkypeInMessHdlr} from "./messages/lstSkypeReceptionMess";

import {lstNewOutMess} from "./messages/outMessages";





(function () {

// ------------------- variables -----------------------------------
// остальное смотреть в папке variables

//  настройки окна
let contentSetting = {};// тут настройки полученные по запросу из бэкраунда
// список языков перевода и текущий язык
//let carrentLanguagesName = [] ,
//    carrentLanguagesAbr= [] ;
// входящий язык, исходящий языки
//let carrentInLanguage = 'ru';
//let carrentOutLanguage = 'ru';
// все сообщения
let theMessages = [];
// формат такой же как и history
// история
let theHistory = [];
/*
theHistory[author] = [];
theHistory[author][time] = {
    language,
    word,
    translation
    category [0] = {'in'; 'out'}
};
*/
 let theUser = {}; //объект с юзерами:in - входящий ,out -(me)исходящий

/*---------------------------------------------------------------------

*/
// ------------------- execution -------------------------------------------
//
//== 1 ==
   
setOnBtnListener(activateSkypeMode);


// ФУНКЦИЯ ============= запускает SkypeMode
  
function activateSkypeMode () {
    
    //let selfSkypeContainer = '#shellMainStage';
    //загружаем настройки
       getContentSettingsFromBack(contentSetting, KEY.giveSettings) 
       .then(result => {
           // создаем основное окно
           createMainMessWindow(EL.selfSkypeContainer);
           setFontFace();// устанавливаем фонтфейс
           // заполняем меню выбора языков
           setLanguagesMenu(
            'inLangMenu', contentSetting, EL.inLangButt,
             EL.inLangMenu, EL.inLangButt, EL.hederName, getLanguageAbr
           );
           setLanguagesMenu(
            'outLangMenu', contentSetting, EL.outLangButt,
             EL.outLangMenu, EL.outLangButt, EL.hederName, getLanguageAbr
           );

           // получаем юзеров и заполняем имена в интерфейс
           // и делаем запрос истории 
           getUsersFromSkype(getHistory, 20, theUser);
           // при переключении юзеров обновляем
           refreshInUser(getHistory, 20, theUser);
           // получаем историю на нового юзера
           // заполняем 20 контейнеров последними сообщениями истории
           // также слушаем все остальные сообщения из backScript
           //
           //
           onMessFromBgLstr (KEY, EL, theHistory, theMessages);
               
           // слушаем изменение дома скайпа
           lstSkypeReceptionMess(KEY, EL, theUser);
           // 
           // слушаем ввод новых исходящих сообщений
           // отправляем их на перевод
           lstNewOutMess(KEY, EL);

           // слушаем редактирование перевода при окончании
           // отправляем сообщение в скайп
           // отправляем на запись в базу
           // выводим сообщение в ленту

       });


}


 







   // ФУНКЦИЯ ==============  запускает TelegramMode
   
let activateTelegramMode =  function () {
        
}; 
   //export {activateTelegramMode};

    // ФУНКЦИЯ ==============  удаляет TelegramMode
   
let delSkypeMode = function () {
        
}; 
  // export {delSkypeMode};

    // ФУНКЦИЯ ==============  удаляет TelegramMode
   
let delTelegramMode = function() {
        
}; 
  


})();