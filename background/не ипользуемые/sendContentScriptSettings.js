//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ   отправляет месадж с настройками в контент скрипт
//
//   settingsObj - объект с настройками контент скрипта

'use strict';


let sendContentScriptSettings = function (settingsObj) {
    
    return new Promise(function(resolve, reject) {

        if(!settingsObj) reject('Нет настроек');

         chrome.tabs.query({currentWindow:true, active:true }, function(tabArray){
       
            chrome.tabs.sendMessage ( tabArray[0].id , settingsObj);
            resolve(); // ???? доделать
        });


    });
};

export {sendContentScriptSettings};