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

// ФУНКЦИЯ    
// достает юзеров из верстки скайпа и заполняет интерфейс
//
let getUsersFromSkype = () => {

    let skyContainer = $('#meComponent').find('.Me-skyContainer');
    let outTileImage = skyContainer.find('.tileImage > img');
    let myImgUrl = outTileImage.attr('src');
    let meName = skyContainer.find('.Me-displayName').text();

    let inTileImage = $('#chatComponent').find('.tileImage > img');
    let inImgUrl = inTileImage.attr('src');
    let inName = $('#chatComponent').find('.tileName').find('.hoverWrap > a').text();

    let inUserAvatarEl = $('#SkCtchHeadWrap').find('.sk_inUser_icon');
    let outUserAvatarEl = $('#SkCtchHeadWrap').find('.sk_outUser_icon');
    let inUserNameEl = $('#SkCtchHeaderBody > .inUser');
    let outUserNameEl = $('#SkCtchHeaderBody > .outUser');

    let myBackgroundUrl = `url(${myImgUrl}) transparent center center no-repeat`;
    if(myBackgroundUrl){
        outUserAvatarEl.text('');
        outUserAvatarEl.css({
        'background': myBackgroundUrl,
        'background-size': 'cover'
         });
    }
    outUserNameEl.text(meName);

    let inBackgroundUrl = `url(${inImgUrl}) transparent center center no-repeat`;
    if(inBackgroundUrl){
       inUserAvatarEl.text('');
       inUserAvatarEl.css({
        'background': inBackgroundUrl,
        'background-size': 'cover'
        }); 
    }

    inUserNameEl.text(inName);

};

export {getUsersFromSkype};  

// ФУНКЦИЯ    
// слушает  обновления пользователя и обновляет его
// 

let refreshInUser = () => {
    console.log('refreshInUser');
    //let inNameEl = $('#chatComponent').find('.tileName').find('.hoverWrap > a');
    let inUserAvatarEl = $('#SkCtchHeadWrap').find('.sk_inUser_icon');
    let inUserNameEl = $('#SkCtchHeaderBody > .inUser');

    
    let recentsEl = $('#timelineComponent').find('.recents > .list-selectable');

    recentsEl.each((indx, element) => {
        $(element).off("click").on('click', () => {
            setTimeout(function(){
                //console.log('click');
                let inNameEl = $(element).find('.tileName > h4 > .topic');

                let inName = inNameEl.text();
                //console.log('inName  ',  inName);
                let inTileImage = $(element).find('.tileImage > img');
                let inImgUrl = inTileImage.attr('src');

                let inBackgroundUrl = `url(${inImgUrl}) transparent center center no-repeat`;
                if(inBackgroundUrl){
                   inUserAvatarEl.text('');
                   inUserAvatarEl.css({
                    'background': inBackgroundUrl,
                    'background-size': 'cover'
                    }); 
                }

                inUserNameEl.text(inName);
            },100);    

        });
    });

};

export {refreshInUser};

// ФУНКЦИЯ    
// 
//
/*
let setInputText = (inEl, outEl, obj) => {

   console.log('inEl  ', inEl);
    
   let proxy = new Proxy(obj, {
     
      set(target, prop, value) {
        $(outEl).text('');
        $(outEl).text(value);
        console.log('value  ', value);
        target[prop] = value;
        return true;
      }

    }); 

   $(inEl).on('input', () => { 

     proxy.val =''+ $(inEl).val();
     
     console.log('proxy.val  ', proxy.val);
     console.log('obj.val  ', obj.val);   
   });




};

export {setInputText};

*/

