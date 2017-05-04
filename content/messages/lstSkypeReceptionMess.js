//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ    слушает изменения дома скайпа
// 
//
'use strict';


//  ФУНКЦИЯ    слушает изменения дома скайпа
// 
// KEY  -  ссылка на объект с ключами
// EL  -  ссылка на объект с элементами
// MessHdlr - функция обработчик события
//
export let lstSkypeReceptionMess = function (KEY, EL, userObj) {
    
    
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver ;
   
    let inMessSkypeEl = document.querySelector('.conversationHistory > div[role = "log"]');
    let inMessDataOld = inMessSkypeEl.textContent;
    let observeSkypeEl = document.querySelector('.messageHistory[data-swx-testid="messageHistory"]');

    let inMessDataNew;
    let mutationCounter = 0;

    let observerForSkype = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutationCounter++;
            //console.log('мутация');
            if(mutationCounter === 1){
                inMessDataNew = inMessSkypeEl.textContent;
                console.log('мутация  ', inMessDataNew);
                //  вырезаем начало меседжа до запятой
                //let pos = inMessDataNew.indexOf(',') + 1;
                //inMessDataNew = inMessDataNew.substring(pos);
                // выводим сообщение в инбокс
                // отправляем его на перевод
                console.log('мутация2  ', inMessDataNew);
                setSkypeInMessHdlr(KEY, EL, inMessDataNew, userObj);
                setTimeout(function(){
                   mutationCounter = 0; 
                },50);

            }    
        });    
    });

    // настраиваем наблюдатель
    let observerConfig = { attributes: true, childList: true, characterData: true };
    
    observerForSkype.disconnect();
    observerForSkype.observe(observeSkypeEl, observerConfig);
};



//
// ФУНКЦИЯ 
//  получает текст входящего сообщения- очищает его и достает отдельно пользователя
// заносит его в #SkCtchInbox => .inbox_inner (inboxInner)
// если mess.category[0] = 'in';
//  сохраняет значение в объекте и отправляет объект на перевод
// 


function setSkypeInMessHdlr(KEY, EL, messData, userObj) {

    let mess = {};
    let pos = messData.indexOf(',') + 1;
    let messText = messData.substring(pos);
    let userOutLength = userObj.out.length;
    
    let pos1 = pos - userOutLength - 1;
    let messAuthor =  messData.substring(pos1, pos - 1);
    //console.log('messAuthor   ', messAuthor);
    //console.log('userObj.out   ', userObj.out);
    let inboxInnerEl = $(EL.inboxInner);
    let hederNameEl = $(EL.hederName);
    if(!mess.category) mess.category = [];

    if (messAuthor == userObj.out ){
        
        mess.category[0] = 'out';
        
    } else {
       
        mess.category[0] = 'in'; 
        if(!hederNameEl.is('.inbox')) hederNameEl.addClass('inbox');
        inboxInnerEl.text('');
        inboxInnerEl.text(messText);

    }


    let inLanguage = $(EL.inLangButt).text().toLowerCase();
    let outLanguage = $(EL.outLangButt).text().toLowerCase();

    
    mess.key = KEY.translateAndSave;
    mess.author = userObj.in;
    mess.language = inLanguage + '-' + outLanguage;
    mess.word = messText;
   
    chrome.runtime.sendMessage(mess);


}





/*
// ФУНКЦИЯ 
//  вырезаем начало меседжа до запятой
export function cutStartOfMess(mess) {
    var pos = mess.indexOf(',') + 1;
    return mess.substring(pos);
}
*/

