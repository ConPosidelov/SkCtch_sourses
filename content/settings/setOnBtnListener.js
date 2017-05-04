//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ    проверяет имена сайта и если годятся то 
//  создает кнопку "ON-Off" при нажатии возвращает промис resolve
// 
//
'use strict';

export {setOnBtnListener};
export {createSkCtchMode};
export {createOnBtn};

function setOnBtnListener(activateSkypeMode2) {
 
    let skypeURL = 'web.skype.com';
    let telegramURL = 'web.telegram.org';
    let SKYPE = false ;
    let TELEGRAM = false ;
  /*
    chrome.webNavigation.onDOMContentLoaded.addListener(
        function(details) {
            SKYPE = true;
            TELEGRAM = false;
            createSkCtchMode(activateSkypeMode);
        }, {url: [{hostSuffix: skypeURL}]}    
    );
        
    chrome.webNavigation.onDOMContentLoaded.addListener(
        function(details) {
            TELEGRAM = true;
            SKYPE = false;
            createSkCtchMode(activateSkypeMode);
        }, {url: [{hostSuffix: telegramURL}]}    
    );
    */
    SKYPE = true;
    createSkCtchMode(activateSkypeMode2, SKYPE, TELEGRAM);

};

// ФУНКЦИЯ 
//            запускает SkCtchMode
      
function createSkCtchMode(activateSkypeMode1, SKYPE, TELEGRAM) {

    createOnBtn('SkCtch_onBtn');
    let onBtn = $('#SkCtch_onBtn');
    let body  = $('body');

    onBtn.off("click").on('click', function(){

        if(body.is('.skypeSkCtch')){
            onBtn.removeClass('active'); 
            body.removeClass('skypeSkCtch');
           // delSkypeMode();
           
        } else if (body.is('.telegramSkCtch')){
            onBtn.removeClass('active'); 
            body.removeClass('telegramSkCtch');
           // delTelegramMode();
         
        } else if (SKYPE){
            activateSkypeMode1(); 
            onBtn.addClass('active'); 
            body.addClass('skypeSkCtch');
         
        } else if (TELEGRAM){
            //activateTelegramMode(); 
            onBtn.addClass('active'); 
            body.addClass('telegramSkCtch');
           
        } else {
            console.log('Another site');
        }

    });
}

// создает   OnBtn
function  createOnBtn   (el) {
    $('body').prepend(
        "<div class= '"+el+"' id= '"+ el +"'> "+
            'OFF' +
        "</div>"
    );
};

