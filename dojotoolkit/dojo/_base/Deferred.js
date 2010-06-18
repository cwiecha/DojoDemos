/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojo._base.Deferred"]){
dojo._hasResource["dojo._base.Deferred"]=true;
dojo.provide("dojo._base.Deferred");
dojo.require("dojo._base.lang");
(function(){
var _1=function(){
};
var _2=Object.freeze||function(){
};
dojo.Deferred=function(_3){
var _4,_5,_6,_7,_8;
var _9=this.promise={};
function _a(_b){
if(_5){
throw new Error("This deferred has already been resolved");
}
_4=_b;
_5=true;
_c();
};
function _c(){
var _d;
while(!_d&&_8){
var _e=_8;
_8=_8.next;
if(_d=(_e.progress==_1)){
_5=false;
}
var _f=(_6?_e.error:_e.resolved);
if(_f){
try{
var _10=_f(_4);
if(_10&&typeof _10.then==="function"){
_10.then(_e.deferred.resolve,_e.deferred.reject);
continue;
}
var _11=_d&&_10===undefined;
_e.deferred[_11&&_6?"reject":"resolve"](_11?_4:_10);
}
catch(e){
_e.deferred.reject(e);
}
}else{
if(_6){
_e.deferred.reject(_4);
}else{
_e.deferred.resolve(_4);
}
}
}
};
this.resolve=this.callback=function(_12){
this.fired=0;
this.results=[_12,null];
_a(_12);
};
this.reject=this.errback=function(_13){
_6=true;
this.fired=1;
_a(_13);
this.results=[null,_13];
if(!_13||_13.log!==false){
(dojo.config.deferredOnError||function(x){
console.error(x);
})(_13);
}
};
this.progress=function(_14){
var _15=_8;
while(_15){
var _16=_15.progress;
_16&&_16(_14);
_15=_15.next;
}
};
this.addCallbacks=function(_17,_18){
this.then(_17,_18,_1);
return this;
};
this.then=_9.then=function(_19,_1a,_1b){
var _1c=_1b==_1?this:new dojo.Deferred(_9.cancel);
var _1d={resolved:_19,error:_1a,progress:_1b,deferred:_1c};
if(_8){
_7=_7.next=_1d;
}else{
_8=_7=_1d;
}
if(_5){
_c();
}
return _1c.promise;
};
this.cancel=_9.cancel=function(){
if(!_5){
var _1e=_3&&_3(this);
if(!(_1e instanceof Error)){
_1e=new Error(_1e);
}
_1e.log=false;
this.reject(_1e);
}
};
_2(_9);
};
dojo.extend(dojo.Deferred,{addCallback:function(_1f){
return this.addCallbacks(dojo.hitch.apply(dojo,arguments));
},addErrback:function(_20){
return this.addCallbacks(null,dojo.hitch.apply(dojo,arguments));
},addBoth:function(_21){
var _22=dojo.hitch.apply(dojo,arguments);
return this.addCallbacks(_22,_22);
},fired:-1});
})();
dojo.when=function(_23,_24,_25,_26){
if(_23&&typeof _23.then==="function"){
return _23.then(_24,_25,_26);
}
return _24(_23);
};
}
