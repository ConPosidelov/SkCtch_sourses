// SkypeCatcher - сокращение SkCtch
//
// Вспомогательные ФУНКЦИИ
//
'use strict';
import * as EL from "../variables/interfaceEl";
import * as KEY from "../variables/queryKeys";
import {lstSkypeReceptionMess} from "../messages/lstSkypeReceptionMess";
import {waitLoad} from "../service/serviceFunc";

// ФУНКЦИЯ    
// достает юзеров из верстки скайпа и заполняет интерфейс
// + вызывает функцию получения истории
// getHistoryFun - имя функции
// lengthHistory - длина истории
// KEY  -  ссылка на объект с ключами
// user - объект с юзерами

let getUsersFromSkype = (getHistoryFun, lengthHistory, user) => {

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
    user.in = inName;
    user.out = meName;

    if(inName){
      getHistoryFun(inName, lengthHistory,  KEY);  
    }
    

};

export {getUsersFromSkype};  

// ФУНКЦИЯ    
// слушает  обновления пользователя и обновляет его
// + вызывает функцию получения истории
// getHistoryFun - имя функции
// lengthHistory - длина истории
// key - ссылка на объект с ключами
// user - объект с юзерами

let refreshInUser = (getHistoryFun, lengthHistory, user) => {
    console.log('refreshInUser');
    //let inNameEl = $('#chatComponent').find('.tileName').find('.hoverWrap > a');
    let inUserAvatarEl = $('#SkCtchHeadWrap').find('.sk_inUser_icon');
    let inUserNameEl = $('#SkCtchHeaderBody > .inUser');
    let inboxInnerEl = $(EL.inboxInner);
    let hederNameEl = $(EL.hederName);
    
    let recentsEl = $('#timelineComponent').find('.recents > .list-selectable');

    recentsEl.each((indx, element) => {
        $(element).off("click").on('click', () => {
            //console.log('click1');
            setTimeout(function(){
                console.log('click2');
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
                //console.log('refreshInUser inName   ',inName);
                user.in = inName;
               
                if(inName){
                  //console.log('refreshInUser getHistoryFun');  
                  getHistoryFun(inName, lengthHistory,  KEY);  
                }
                if(hederNameEl.is('.inbox')) hederNameEl.removeClass('inbox');
                inboxInnerEl.text('');

                lstSkypeReceptionMess(KEY, EL, user);
                let targetSpinEl = document.querySelector('body.skypeSkCtch');
                waitLoad(targetSpinEl, 20000);


                setTimeout(function(){
                   lstSkypeReceptionMess(KEY, EL, user); 
                },20000);


            },100); 

                

        });
    });

};

export {refreshInUser};
