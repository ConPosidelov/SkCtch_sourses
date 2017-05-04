//
//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ     получает настройки контент скрипта
//
'use strict'

let setContentScriptSettings = function () {
    
    let conScriptSettings = {
        //contentWindState : localStorage["SkCtch_contentWindState"] || 'on',
               
        offon : localStorage["myWords_conScriptOffon"] || 'off',
        allLanguagesName : localStorage["SkCtch_allLanguagesName"],
        allLanguagesAbr : localStorage["SkCtch_allLanguagesAbr"],
        language : localStorage["SkCtch_language"],
        selfLanguage : localStorage["SkCtch_selfLanguage"]

    };


    return conScriptSettings;


};
export {setContentScriptSettings};