/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.axis2d.Default"]){
dojo._hasResource["dojox.charting.axis2d.Default"]=true;
dojo.provide("dojox.charting.axis2d.Default");
dojo.require("dojox.charting.scaler.linear");
dojo.require("dojox.charting.axis2d.common");
dojo.require("dojox.charting.axis2d.Base");
dojo.require("dojo.colors");
dojo.require("dojo.string");
dojo.require("dojox.gfx");
dojo.require("dojox.lang.functional");
dojo.require("dojox.lang.utils");
(function(){
var dc=dojox.charting,df=dojox.lang.functional,du=dojox.lang.utils,g=dojox.gfx,_1=dc.scaler.linear,_2=du.merge,_3=4;
dojo.declare("dojox.charting.axis2d.Default",dojox.charting.axis2d.Base,{defaultParams:{vertical:false,fixUpper:"none",fixLower:"none",natural:false,leftBottom:true,includeZero:false,fixed:true,majorLabels:true,minorTicks:true,minorLabels:true,microTicks:false,htmlLabels:true},optionalParams:{min:0,max:1,from:0,to:1,majorTickStep:4,minorTickStep:2,microTickStep:1,labels:[],labelFunc:null,maxLabelSize:0,stroke:{},majorTick:{},minorTick:{},microTick:{},tick:{},font:"",fontColor:""},constructor:function(_4,_5){
this.opt=dojo.delegate(this.defaultParams,_5);
du.updateWithPattern(this.opt,_5,this.optionalParams);
},dependOnData:function(){
return !("min" in this.opt)||!("max" in this.opt);
},clear:function(){
delete this.scaler;
delete this.ticks;
this.dirty=true;
return this;
},initialized:function(){
return "scaler" in this&&!(this.dirty&&this.dependOnData());
},setWindow:function(_6,_7){
this.scale=_6;
this.offset=_7;
return this.clear();
},getWindowScale:function(){
return "scale" in this?this.scale:1;
},getWindowOffset:function(){
return "offset" in this?this.offset:0;
},_groupLabelWidth:function(_8,_9){
if(!_8.length){
return 0;
}
if(dojo.isObject(_8[0])){
_8=df.map(_8,function(_a){
return _a.text;
});
}
var s=_8.join("<br>");
return dojox.gfx._base._getTextBox(s,{font:_9}).w||0;
},calculate:function(_b,_c,_d,_e){
if(this.initialized()){
return this;
}
var o=this.opt;
this.labels="labels" in o?o.labels:_e;
this.scaler=_1.buildScaler(_b,_c,_d,o);
var _f=this.scaler.bounds;
if("scale" in this){
o.from=_f.lower+this.offset;
o.to=(_f.upper-_f.lower)/this.scale+o.from;
if(!isFinite(o.from)||isNaN(o.from)||!isFinite(o.to)||isNaN(o.to)||o.to-o.from>=_f.upper-_f.lower){
delete o.from;
delete o.to;
delete this.scale;
delete this.offset;
}else{
if(o.from<_f.lower){
o.to+=_f.lower-o.from;
o.from=_f.lower;
}else{
if(o.to>_f.upper){
o.from+=_f.upper-o.to;
o.to=_f.upper;
}
}
this.offset=o.from-_f.lower;
}
this.scaler=_1.buildScaler(_b,_c,_d,o);
_f=this.scaler.bounds;
if(this.scale==1&&this.offset==0){
delete this.scale;
delete this.offset;
}
}
var _10=0,ta=this.chart.theme.axis,_11=o.font||(ta.majorTick&&ta.majorTick.font)||(ta.tick&&ta.tick.font),_12=_11?g.normalizedLength(g.splitFontString(_11).size):0;
if(this.vertical){
if(_12){
_10=_12+_3;
}
}else{
if(_12){
var _13,i;
if(o.labelFunc&&o.maxLabelSize){
_13=o.maxLabelSize;
}else{
if(this.labels){
_13=this._groupLabelWidth(this.labels,_11);
}else{
var _14=Math.ceil(Math.log(Math.max(Math.abs(_f.from),Math.abs(_f.to)))/Math.LN10),t=[];
if(_f.from<0||_f.to<0){
t.push("-");
}
t.push(dojo.string.rep("9",_14));
var _15=Math.floor(Math.log(_f.to-_f.from)/Math.LN10);
if(_15>0){
t.push(".");
for(i=0;i<_15;++i){
t.push("9");
}
}
_13=dojox.gfx._base._getTextBox(t.join(""),{font:_11}).w;
}
}
_10=_13+_3;
}
}
this.scaler.minMinorStep=_10;
this.ticks=_1.buildTicks(this.scaler,o);
return this;
},getScaler:function(){
return this.scaler;
},getTicks:function(){
return this.ticks;
},getOffsets:function(){
var o=this.opt;
var _16={l:0,r:0,t:0,b:0},_17,a,b,c,d,gl=dc.scaler.common.getNumericLabel,_18=0,ta=this.chart.theme.axis,_19=o.font||(ta.majorTick&&ta.majorTick.font)||(ta.tick&&ta.tick.font),_1a=this.chart.theme.getTick("major",o),_1b=this.chart.theme.getTick("minor",o),_1c=_19?g.normalizedLength(g.splitFontString(_19).size):0,s=this.scaler;
if(!s){
return _16;
}
var ma=s.major,mi=s.minor;
if(this.vertical){
if(_1c){
if(o.labelFunc&&o.maxLabelSize){
_17=o.maxLabelSize;
}else{
if(this.labels){
_17=this._groupLabelWidth(this.labels,_19);
}else{
_17=this._groupLabelWidth([gl(ma.start,ma.prec,o),gl(ma.start+ma.count*ma.tick,ma.prec,o),gl(mi.start,mi.prec,o),gl(mi.start+mi.count*mi.tick,mi.prec,o)],_19);
}
}
_18=_17+_3;
}
_18+=_3+Math.max(_1a.length,_1b.length);
_16[o.leftBottom?"l":"r"]=_18;
_16.t=_16.b=_1c/2;
}else{
if(_1c){
_18=_1c+_3;
}
_18+=_3+Math.max(_1a.length,_1b.length);
_16[o.leftBottom?"b":"t"]=_18;
if(_1c){
if(o.labelFunc&&o.maxLabelSize){
_17=o.maxLabelSize;
}else{
if(this.labels){
_17=this._groupLabelWidth(this.labels,_19);
}else{
_17=this._groupLabelWidth([gl(ma.start,ma.prec,o),gl(ma.start+ma.count*ma.tick,ma.prec,o),gl(mi.start,mi.prec,o),gl(mi.start+mi.count*mi.tick,mi.prec,o)],_19);
}
}
_16.l=_16.r=_17/2;
}
}
if(_17){
this._cachedLabelWidth=_17;
}
return _16;
},render:function(dim,_1d){
if(!this.dirty){
return this;
}
var o=this.opt;
var _1e,_1f,_20,_21,_22,_23,ta=this.chart.theme.axis,_24=o.font||(ta.majorTick&&ta.majorTick.font)||(ta.tick&&ta.tick.font),_25=o.fontColor||(ta.majorTick&&ta.majorTick.fontColor)||(ta.tick&&ta.tick.fontColor)||"black",_26=this.chart.theme.getTick("major",o),_27=this.chart.theme.getTick("minor",o),_28=this.chart.theme.getTick("micro",o),_29=Math.max(_26.length,_27.length,_28.length),_2a="stroke" in o?o.stroke:ta.stroke,_2b=_24?g.normalizedLength(g.splitFontString(_24).size):0;
if(this.vertical){
_1e={y:dim.height-_1d.b};
_1f={y:_1d.t};
_20={x:0,y:-1};
if(o.leftBottom){
_1e.x=_1f.x=_1d.l;
_21={x:-1,y:0};
_23="end";
}else{
_1e.x=_1f.x=dim.width-_1d.r;
_21={x:1,y:0};
_23="start";
}
_22={x:_21.x*(_29+_3),y:_2b*0.4};
}else{
_1e={x:_1d.l};
_1f={x:dim.width-_1d.r};
_20={x:1,y:0};
_23="middle";
if(o.leftBottom){
_1e.y=_1f.y=dim.height-_1d.b;
_21={x:0,y:1};
_22={y:_29+_3+_2b};
}else{
_1e.y=_1f.y=_1d.t;
_21={x:0,y:-1};
_22={y:-_29-_3};
}
_22.x=0;
}
this.cleanGroup();
try{
var s=this.group,c=this.scaler,t=this.ticks,_2c,f=_1.getTransformerFromModel(this.scaler),_2d=(dojox.gfx.renderer=="canvas"),_2e=_2d||this.opt.htmlLabels&&!dojo.isIE&&!dojo.isOpera?"html":"gfx",dx=_21.x*_26.length,dy=_21.y*_26.length;
s.createLine({x1:_1e.x,y1:_1e.y,x2:_1f.x,y2:_1f.y}).setStroke(_2a);
dojo.forEach(t.major,function(_2f){
var _30=f(_2f.value),_31,x=_1e.x+_20.x*_30,y=_1e.y+_20.y*_30;
s.createLine({x1:x,y1:y,x2:x+dx,y2:y+dy}).setStroke(_26);
if(_2f.label){
_31=dc.axis2d.common.createText[_2e](this.chart,s,x+_22.x,y+_22.y,_23,_2f.label,_24,_25,this._cachedLabelWidth);
if(_2e=="html"){
this.htmlElements.push(_31);
}
}
},this);
dx=_21.x*_27.length;
dy=_21.y*_27.length;
_2c=c.minMinorStep<=c.minor.tick*c.bounds.scale;
dojo.forEach(t.minor,function(_32){
var _33=f(_32.value),_34,x=_1e.x+_20.x*_33,y=_1e.y+_20.y*_33;
s.createLine({x1:x,y1:y,x2:x+dx,y2:y+dy}).setStroke(_27);
if(_2c&&_32.label){
_34=dc.axis2d.common.createText[_2e](this.chart,s,x+_22.x,y+_22.y,_23,_32.label,_24,_25,this._cachedLabelWidth);
if(_2e=="html"){
this.htmlElements.push(_34);
}
}
},this);
dx=_21.x*_28.length;
dy=_21.y*_28.length;
dojo.forEach(t.micro,function(_35){
var _36=f(_35.value),_37,x=_1e.x+_20.x*_36,y=_1e.y+_20.y*_36;
s.createLine({x1:x,y1:y,x2:x+dx,y2:y+dy}).setStroke(_28);
},this);
}
catch(e){
}
this.dirty=false;
return this;
}});
})();
}
