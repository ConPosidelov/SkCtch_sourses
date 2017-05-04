//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ  преобразовывает язык в абревиатуру
// 
//
'use strict';



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