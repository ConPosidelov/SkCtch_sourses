//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ    получает объект mes с переводом  и отправляет его
//  
//
'use strict'

let sendTranslation = function (mes) {
    
    return new Promise(function(resolve, reject) {

        chrome.tabs.query({currentWindow:true, active:true }, function(tabArray){
       
            chrome.tabs.sendMessage ( tabArray[0].id , mes);
            resolve(mes); // ???? доделать
        });
    });
};

export {sendTranslation};