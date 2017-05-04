//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ    получает объект   и отправляет его
//  в content script
//
'use strict'

export let sendMessages = (mes) => {

    return new Promise(function(resolve, reject) {

        chrome.tabs.query({currentWindow:true, active:true }, function(tabArray){
       
            chrome.tabs.sendMessage ( tabArray[0].id , mes);
            resolve(mes); // ???? доделать
        });
    });






};