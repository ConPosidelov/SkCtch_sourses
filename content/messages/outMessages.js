// SkypeCatcher - сокращение SkCtch
//
// 
//
'use strict';

// ФУНКЦИЯ
// слушаем ввод новых исходящих сообщений
// отправляем их на перевод
//
//
export let lstNewOutMess = (KEY, EL) => {

    let inputEl = EL.outOrigTxtAr;
    let origSendButtEl = EL.outOrigSendButt;
    let counter = 0;
    let messObj = {};
    let inLanguage = $(EL.inLangButt).text().toLowerCase();
    let outLanguage = $(EL.outLangButt).text().toLowerCase();
    
    messObj.language = outLanguage + '-' + inLanguage;

    $(inputEl).on('input', () => {

        counter++;
        
        let messStr = ''+ $(inputEl).val();
        let lastHar = messStr.slice(-1);

        messObj.key = KEY.translate;
        messObj.word = messStr;
 
        if (
            lastHar === ' '||
            lastHar === '.'||
            lastHar === ','||
            lastHar === '!'||
            lastHar === '?'||
            lastHar === ':'||
            lastHar === ';'||
            lastHar === '"'||
            lastHar === "'"||
            lastHar === '-'||
            lastHar === ')'
           )
        {

           
         chrome.runtime.sendMessage(messObj);
        // console.log('messStr2  ', messStr);

        } else {

            let counterLast = counter;
            setTimeout(() => {
                
                if(counter === counterLast && messStr != '') chrome.runtime.sendMessage(messObj);
               // if(counter === counterLast && messStr != '') console.log('messStr  ', messStr);
            }, 1000);
        }

    }); 

    origSendButtEl.off('click').on('click', () => {
        
        let messStr = ''+ $(inputEl).val();
        
        messObj.key = KEY.translate;
        messObj.word = messStr;
        chrome.runtime.sendMessage(messObj);
    });




};

// ФУНКЦИЯ
// принимает перевод выводит его в outTranslTxtAr
// показывает outTranslTxtAr
//
//


export let outTranslationHdlr = (req, EL) => {

    let translation = req.translation;

    let outTxtArEl = $(EL.outTranslTxtAr);
    let hederNameEl = $(EL.hederName);

    if(hederNameEl.is('.inbox')) hederNameEl.removeClass('inbox');
    if(!hederNameEl.is('.outbox')) hederNameEl.addClass('outbox');

    outTxtArEl.text('');
    outTxtArEl.text(translation);



};


// ФУНКЦИЯ
// слушает кнопку отправки переведенного сообщения
// отправляет сообщение в скайп
//
//

export let sendTransButtHdlr = ( EL) => {

    let editButtEl = $(EL.outTranslTxtEditButt);
    let sendButtEl = $(EL.outTranslTxtSendButt);
    
    let outTxtArEl = $(EL.outTranslTxtAr);
    let hederNameEl = $(EL.hederName);
   
    let $inputSkipeEl = $(EL.textareaBindings).find(EL.textareaInputField); 
    let $txtArEl = $(EL.outOrigTxtAr);

    let textareaBindingsEl = document.getElementById('textarea-bindings');
    let inputSkipeEl = textareaBindingsEl.querySelector(EL.textareaInputField);

    let sendButtSkipeEl = $(EL.swxContent1).find(EL.swxChatInput).find(EL.sendButtonHolder).find('button'); 

    

    sendButtEl.off('click').on('click', () => {

        let mess = outTxtArEl.val();
        let oldVal = $inputSkipeEl.val();
        if(hederNameEl.is('.outbox')) hederNameEl.removeClass('outbox');
        //console.log(mess);
        
        $txtArEl.val('');
         //$inputSkipeEl.val(mess);

        $inputSkipeEl.val(oldVal + ' '+ mess);
        $inputSkipeEl.focus();

        let event1 = new KeyboardEvent('keydown', {keyCode: 186});
        inputSkipeEl.dispatchEvent(event1);
    
        setTimeout(() => {

           sendButtSkipeEl.click();
           $txtArEl.focus();

        },300);

    }); 

    editButtEl.off('click').on('click', () => {

        let mess = outTxtArEl.val();
        let oldVal = $inputSkipeEl.val();

        $inputSkipeEl.val(oldVal + ' '+ mess);
         $txtArEl.val('');
        $txtArEl.focus();
    });

 
};