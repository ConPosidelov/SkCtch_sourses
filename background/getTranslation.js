//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ    получает объект mes со словом и возвращает перевод
//  mes.word - слово  mes.translation - перевод
// inputLang - абревиатура вх языка  outputLang абревиатура языка перевода
//
'use strict'

export let getTranslation = function (mes, yandexUrl) {
  
    return new Promise(function(resolve, reject) { 

        let languageKey = mes.language;
        let params = {
              text: mes.word,
              lang: languageKey
            };
        let yandexRequest = ''+ yandexUrl + '&'+ $.param(params);
        let resTranslate;
        $.getJSON(yandexRequest,function(res){

            for (var i in res.text) {
                let resalt = '';
                resTranslate = resalt + res.text[i] + " ";
            }
            mes.translation = resTranslate;
            resolve(mes);
        });    

   });   
}






















