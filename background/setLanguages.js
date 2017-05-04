//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ   устанавливает или загружает список языков
// 
//
'use strict'


// настройки языка перевода
//

let setLanguages = () => {
    

    let allLanguages = {
        name : [
            'Russian',
            'Ukrainian',
            'English',
            'Polish',
            'German',
            'French'
        ],
        abr : [
            'ru',
            'uk',
            'en',
            'pl',
            'de',
            'fr'
        ],
        nameStr : function (){
            return this.name.join(';');
        },
        abrStr : function (){
            return this.abr.join(';');
        }
    };

    localStorage["SkCtch_allLanguagesName"] = allLanguages.nameStr();
    localStorage["SkCtch_allLanguagesAbr"] =  allLanguages.abrStr(); 
    localStorage["SkCtch_language"] = localStorage["SkCtch_language"] || 'Russian';
    localStorage["SkCtch_selfLanguage"] = localStorage["SkCtch_selfLanguage"] || 'Russian';
};

export {setLanguages};


    

let getLanguageAbr = (languageStr) => {

    let carrentLanguagesName = [] ,
    carrentLanguagesAbr= [] ;
       
    carrentLanguagesName = localStorage["SkCtch_allLanguagesName"].split(';');
    carrentLanguagesAbr = localStorage["SkCtch_allLanguagesAbr"].split(';');
    let nameLength = carrentLanguagesName.length;
    if(nameLength > 0 && nameLength === carrentLanguagesAbr.length) {
        for(var i = 0; i < nameLength; i++){
            if(carrentLanguagesName[i] === languageStr){
                return carrentLanguagesAbr[i];
            }
        }
    }
};

export {getLanguageAbr};
    //
    //  варианты яндекса : pl- польский, de - немецкий, fr - французкий, es - испанский



