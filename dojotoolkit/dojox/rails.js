/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.rails"]){
dojo._hasResource["dojox.rails"]=true;
dojo.provide("dojox.rails");
dojo.require("dojo.NodeList-traverse");
dojox.rails.live=function(_1,_2,fn){
if(dojo.isIE&&_2.match(/^(on)?submit$/i)){
dojox.rails.live(_1,"click",function(_3){
var _4=_3.target,_5=_4.tagName.toLowerCase();
if((_5=="input"||_5=="button")&&dojo.attr(_4,"type").toLowerCase()=="submit"){
var _6=dojo.query(_4).closest("form");
if(_6.length){
var h=dojo.connect(_6[0],"submit",function(_7){
dojo.disconnect(h);
fn.call(_7.target,_7);
});
}
}
});
}else{
dojo.connect(dojo.body(),_2,function(_8){
var nl=dojo.query(_8.target).closest(_1);
if(nl.length){
fn.call(nl[0],_8);
}
});
}
};
dojo.ready((function(d,dr,dg){
return function(){
var q=d.query,_9=dr.live,_a=q("meta[name=csrf-token]").attr("content"),_b=q("meta[name=csrf-param]").attr("content");
var _c=function(_d,_e){
var _f="<form style=\"display:none\" method=\"post\" action=\""+_d+"\">"+"<input type=\"hidden\" name=\"_method\" value=\""+_e+"\" />"+"<input type=\"hidden\" name=\""+_b+"\" value=\""+_a+"\" />"+"</form>";
return dojo.place(_f,dojo.body());
};
var _10=function(_11){
d.forEach(_11,function(_12){
if(!d.attr(_12,"disabled")){
var _13=_12.tagName.toLowerCase()=="input"?"value":"innerHTML";
var _14=d.attr(_12,"data-disable-with");
var _15=d.attr(_12,_13);
d.attr(_12,"disabled",true);
d.attr(_12,"data-original-value",_15);
d.attr(_12,_13,_14);
}
});
};
var _16=function(evt){
var el=evt.target,tag=el.tagName.toLowerCase();
var _17=tag.toLowerCase()=="form"?d.formToObject(el):{},_18=d.attr(el,"data-type")||"javascript",_19=(d.attr(el,"method")||d.attr(el,"data-method")||"get").toLowerCase(),url=d.attr(el,"action")||d.attr(el,"href");
if(tag!="form"&&_19!="get"){
el=_c(url,_19);
_19="POST";
}
evt.preventDefault();
d.publish("ajax:before",[el]);
var _1a=d.xhr(_19,{url:url,headers:{"Accept":_18=="text"?"text":"text/"+_18},content:_17,handleAs:_18,load:function(_1b,_1c){
d.publish("ajax:success",[el,_1b,_1c]);
},error:function(_1d,_1e){
d.publish("ajax:failure",[el,_1d,_1e]);
},handle:function(_1f,_20){
d.publish("ajax:complete",[el,_1f,_20]);
}});
d.publish("ajax:after",[el]);
};
var _21=function(el){
q("*[data-disable-with][disabled]",el).forEach(function(_22){
var _23=_22.tagName.toLowerCase()=="input"?"value":"innerHTML";
var _24=d.attr(_22,"data-original-value");
d.attr(_22,"disabled",false);
d.attr(_22,"data-original-value",null);
d.attr(_22,_23,_24);
});
};
var _25=function(evt){
var el=evt.target,_26=_c(el.href,dojo.attr(el,"data-method"));
evt.preventDefault();
_26.submit();
};
var _27=function(evt){
var el=evt.target,_28=q("*[data-disable-with]",el);
if(_28.length){
_10(_28);
}
if(d.attr(el,"data-remote")){
evt.preventDefault();
_16(evt);
}
};
var _29=function(evt){
var _2a=dg.confirm(d.attr(evt.target,"data-confirm"));
if(!_2a){
evt.preventDefault();
}else{
if(d.attr(evt.target,"data-remote")){
_16(evt);
}
}
};
_9("*[data-confirm]","click",_29);
d.subscribe("ajax:complete",_21);
_9("a[data-remote]:not([data-confirm])","click",_16);
_9("a[data-method]:not([data-remote])","click",_25);
_9("form","submit",_27);
};
})(dojo,dojox.rails,dojo.global));
}
