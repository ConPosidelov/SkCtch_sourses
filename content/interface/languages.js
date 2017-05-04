// SkypeCatcher - сокращение SkCtch
//
// Вспомогательные ФУНКЦИИ
//
'use strict';



// ФУНКЦИЯ    возвращает абревиатуру языка
// получает:  язык- language, список языков -nameList,
// список абревиатур - abrList
// 
let getLanguageAbr = (language, nameList, abrList) => {
    //console.log('getLanguageAbr run');  
    let languagesName = nameList.split(';');
    let languagesAbr = abrList.split(';');
    let nameLength = languagesName.length;
    let abrLength = languagesAbr.length;

    if(nameLength > 0 && nameLength === abrLength) {
        for(var i = 0; i < nameLength; i++){
            if(languagesName[i] === language){
                return languagesAbr[i];
            }
        }
    }
};

export {getLanguageAbr};

// ФУНКЦИЯ    заполняет меню выбора языков
//  и навешивает на него обработчик
/* получает:
    settings - объект с настр языков = {
              settings.allLanguagesName - список имен
              settings.allLanguagesAbr - список абревиатур
              settings.language - входящий язык
              settings.selfLanguage - исходящий язык (собственный)
              }
    listEl - элемент который слушает клик открытия меню
    menuEl - элемент получаетель меню
    abrEl  - элемент получатель абревиатуры
    typeEl - элемент получатель типа (класса с именем тип)
    transformFunc - функция преобразовывающая язык в абревиатуру  
*/ 
//  type - параметр задающий тип меню ( 'inLangMenu', 'outLangMenu');
//
let setLanguagesMenu = (type, settings, listEl, menuEl, abrEl, typeEl,  transformFunc) => {

    if(!type || !settings || !listEl || !menuEl || !abrEl || !typeEl || !transformFunc){
        return console.log('error in setLanguagesMenu - param');
    }
    let langName = settings.allLanguagesName.split(';'); 
    let nameLength = langName.length;
   
    $(menuEl).text(''); // clean menu
    for(let i=0; i<nameLength; i++){
        let menuItem =`<li class='button'>${langName[i]}</li>`;
        $(menuEl).append(menuItem);
    }

    $(menuEl+'>li').each((indx, element) => {
        $(element).off("click").on('click', () => {
            let selLanguage =  $(element).text();
            let selAbr = transformFunc(selLanguage, settings.allLanguagesName, settings.allLanguagesAbr);
        
            $(abrEl).text(selAbr.toUpperCase());  
            if(type === 'inLangMenu'){settings.language = selAbr};
            if(type === 'outLangMenu'){settings.selfLanguage = selAbr};
            $(typeEl).removeClass(type); // close menu

        });
    });

    $(listEl).off("click").on('click', () => {
        let targetEl = $(typeEl);
        if(targetEl.hasClass(type)){
           targetEl.removeClass(type); 
        } else {
           targetEl.addClass(type); 
        }
    });    

};

export {setLanguagesMenu}; 
