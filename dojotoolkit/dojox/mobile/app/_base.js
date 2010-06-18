/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.mobile.app._base"]){
dojo._hasResource["dojox.mobile.app._base"]=true;
dojo.provide("dojox.mobile.app._base");
dojo.experimental("dojox.mobile.app._base");
dojo.require("dojox.mobile.app._Widget");
dojo.require("dojox.mobile.app.StageController");
dojo.require("dojox.mobile.app.SceneController");
dojo.require("dojox.mobile.app.SceneAssistant");
dojo.require("dojox.mobile.app.AlertDialog");
dojo.require("dojox.mobile.app.List");
dojo.require("dojox.mobile.app.ListSelector");
dojo.require("dojox.mobile.app.TextBox");
(function(){
var _1;
var _2;
var _3=["dojox.mobile","dojox.mobile.parser"];
var _4;
var _5;
function _6(_7){
var _8=_7.pop();
var _9=dojo.baseUrl+dojo._getModuleSymbols(_8).join("/")+".js";
dojo.xhrGet({url:_9,sync:false}).addCallback(function(_a){
dojo["eval"](_a);
if(_7.length>0){
_6(_7);
}else{
dojox.mobile.app._pushFirstScene();
}
});
};
if(dojo.isSafari&&(navigator.userAgent.indexOf("iPhone")>-1||navigator.userAgent.indexOf("iPod")>-1)){
dojox.mobile.app.isIPhone=true;
dojo._oldConnect=dojo._connect;
var _b={onmousedown:"ontouchstart",mousedown:"ontouchstart",onmouseup:"ontouchend",mouseup:"ontouchend",onmousemove:"ontouchmove",mousemove:"ontouchmove"};
dojo._connect=function(_c,_d,_e,_f,_10){
_d=_b[_d]||_d;
return dojo._oldConnect(_c,_d,_e,_f,_10);
};
}
dojo.mixin(dojox.mobile.app,{init:function(_11){
_5=_11||dojo.body();
_4=dojo.clone(_3);
_6(_4);
dojo.subscribe("/dojox/mobile/app/goback",function(){
_1.popScene();
});
dojo.subscribe("/dojox/mobile/app/alert",function(_12){
dojox.mobile.app.getActiveSceneController().showAlertDialog(_12);
});
},getActiveSceneController:function(){
return _1.getActiveSceneController();
},getStageController:function(){
return _1;
},_pushFirstScene:function(){
_1=new dojox.mobile.app.StageController(_5);
var _13={id:"com.test.app",version:"1.0.0",initialScene:"main"};
if(window["appInfo"]){
dojo.mixin(_13,window["appInfo"]);
}
_2=dojox.mobile.app.info=_13;
if(_2.title){
var _14=dojo.query("head title")[0]||dojo.create("title",{},dojo.query("head")[0]);
document.title=_2.title;
}
_1.pushScene(_2.initialScene);
},resolveTemplate:function(_15){
return "app/views/"+_15+"/"+_15+"-scene.html";
},resolveAssistant:function(_16){
return "app/assistants/"+_16+"-assistant.js";
}});
})();
}
