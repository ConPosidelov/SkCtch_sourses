//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ  загружает настройки - возвращает промис
//  
//
'use strict'

let getContentSettingsFromBack  = function (settingsObj, settingsKey) {
 
    return new Promise(function(resolve, reject) {
        settingsObj.key = settingsKey;
        
        chrome.runtime.sendMessage(settingsObj, function(response) {
          
            settingsObj.offon = response.offon;
            settingsObj.allLanguagesName = response.allLanguagesName;
            settingsObj.allLanguagesAbr = response.allLanguagesAbr;
            settingsObj.language = response.language;
            settingsObj.selfLanguage = response.selfLanguage;
            resolve(settingsObj);

        });    
    });


};

export {getContentSettingsFromBack};