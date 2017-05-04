//  SkypeCatcher - сокращение SkCtch
//
//  ФУНКЦИЯ    создает основное окно сообщений
// 
//
'use strict';



let createMainMessWindow = function (targetEl) {

  let skypeContainer = "<div id='SkCtchSkypeContainer'>"+

                            "<div class='SkCtchSkConWrap'>"+

                                "<div class='sk_head_wrap' id='SkCtchHeadWrap'>"+

                                    "<div class='sk_header head'>"+
                                        "<div class='material-icons icon sk_inUser_icon'>"+
                                          "person"+ 
                                        "</div>"+
                                        "<div class='icon icon_small button sk_inUser_langButton'  id='SkCtchInUserlang'>"+
                                            'En'+
                                        "</div>"+   

                                        "<div class='headerBody' id='SkCtchHeaderBody'>"+
                                           "<div class='userName inUser'>"+
                                             "Входящий"+
                                           "</div>"+
                                           "<div class='material-icons icon theWay_icon'>"+
                                             "forward"+
                                           "</div>"+ 
                                           "<div class='userName outUser'>"+
                                             "Исходящий"+
                                           "</div>"+
                                        "</div>"+

                                        "<div class='material-icons icon sk_outUser_icon'>"+
                                          "person"+
                                        "</div>"+
                                        "<div class='icon icon_small button sk_outUser_langButton'  id='SkCtchOutUserlang'>"+
                                           "Ru"+
                                        "</div>"+

                                    "</div>"+ //end  sk_header

                                    "<div class='sk_box sk_inbox' id='SkCtchInbox' >"+
                                        "<div class='box_inner inbox_inner'></div>"+
                                    "</div>"+

                                    "<div class='sk_box sk_outbox' id='SkCtchOutbox'>"+
                                        "<div class='box_inner outbox_inner'>"+
                                            "<textarea class='box_inner_body' id='SkCtchOutTranslTextarea'>"+
                                            "</textarea>"+
                                            "<div class='box_inner_controls'>"+
                                                "<div class='material-icons icon icon_small button box_inner_edit' id='SkCtchBoxEditButt'>"+
                                                   "edit"+
                                                "</div>"+
                                                "<div class='material-icons icon icon_small button box_inner_send' id='SkCtchBoxSendButt'>"+
                                                "send"+
                                                "</div>"+   
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+ // end sk_box
                                    "<ul class='langList sk_inLangList' id ='SkCtchInLangList'></ul>"+
                                    "<ul class='langList sk_outLangList' id ='SkCtchOutLangList'></ul>"+ 

                                "</div>"+ // end sk_head_wrap
                              
                                "<div class='sk_in'>"+

                                    "<div class='sk_inBody' id='SkCtchInBody'>"+
                                        "<div class='messCont'>"+
                                            "<div class='mess_inner in_mess'>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+
                                    "<div class='sk_in_outbox'>"+
                                        "<textarea class='outbox_textarea' id='SkCtchOutOrigTextarea'>"+
                                        "</textarea>"+
                                        "<div class='outbox_controls' id='SkCtchOutboxControls'>"+
                                            "<div class='material-icons icon button sendButt' id='SkCtchSendButt'>"+
                                               'send'+ 
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+
                                    "<div class='sk_in_footer'></div>"+

                                "</div>"+ // end  sk_in 
                            "</div>"+// end SkCtchSkConWrap
                        "</div>"; // end   SkCtchSkypeContainer

    $(targetEl).after(skypeContainer);
/*
    // вставляем пустые месс контейнеры

    let messContainer = "<div class='messCont'>"+
                          "<div class='mess_inner in_mess'>"+
                          
                          "</div>"+
                        "</div>"+
                        "<div class='messCont'>"+
                          "<div class='mess_inner out_mess'></div>"+
                        "</div>";

    for(let i=0; i < 6 ; i++){
      $('#SkCtchInBody').prepend(messContainer);
    }                    

*/

};

export {createMainMessWindow};



// ФУНКЦИЯ
     //  устанавливает фонтфейс
     // 

let setFontFace  = function () {

      var newStyle = document.createElement('style');
      var fontName = 'Material Icons';
      var fontURL = chrome.extension.getURL("fonts/MaterialIcons-Regular.woff2");


      newStyle.appendChild(document.createTextNode("\
      @font-face {\
          font-family: '" + fontName + "';\
          src: url('" + fontURL + "') format('woff2');\
      }\
      "));

      document.head.appendChild(newStyle);
    }

export {setFontFace};
    