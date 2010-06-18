/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.plot2d.StackedColumns"]){
dojo._hasResource["dojox.charting.plot2d.StackedColumns"]=true;
dojo.provide("dojox.charting.plot2d.StackedColumns");
dojo.require("dojox.charting.plot2d.common");
dojo.require("dojox.charting.plot2d.Columns");
dojo.require("dojox.lang.functional");
dojo.require("dojox.lang.functional.reversed");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_1=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.StackedColumns",dojox.charting.plot2d.Columns,{calculateAxes:function(_2){
var _3=dc.collectStackedStats(this.series);
this._maxRunLength=_3.hmax;
_3.hmin-=0.5;
_3.hmax+=0.5;
this._calc(_2,_3);
return this;
},render:function(_4,_5){
if(this._maxRunLength<=0){
return this;
}
var _6=df.repeat(this._maxRunLength,"-> 0",0);
for(var i=0;i<this.series.length;++i){
var _7=this.series[i];
for(var j=0;j<_7.data.length;++j){
var _8=_7.data[j];
if(_8!==null){
var v=typeof _8=="number"?_8:_8.y;
if(isNaN(v)){
v=0;
}
_6[j]+=v;
}
}
}
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(_4,_5);
}
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_1);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(_9){
_9.cleanGroup(s);
});
}
var t=this.chart.theme,f,_a,_b,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_c=this.events();
f=dc.calculateBarSize(this._hScaler.bounds.scale,this.opt);
_a=f.gap;
_b=f.size;
this.resetEvents();
for(var i=this.series.length-1;i>=0;--i){
var _7=this.series[i];
if(!this.dirty&&!_7.dirty){
t.skip();
continue;
}
_7.cleanGroup();
var _d=t.next("column",[this.opt,_7]),s=_7.group;
for(var j=0;j<_6.length;++j){
var _8=_7.data[j];
if(_8!==null){
var v=_6[j],_e=vt(v),_f=typeof _8!="number"?t.addMixin(_d,"column",_8,true):t.post(_d,"column");
if(_b>=1&&_e>=1){
var _10={x:_5.l+ht(j+0.5)+_a,y:_4.height-_5.b-vt(v),width:_b,height:_e};
var _11=this._plotFill(_f.series.fill,_4,_5);
_11=this._shapeFill(_11,_10);
var _12=s.createRect(_10).setFill(_11).setStroke(_f.series.stroke);
_7.dyn.fill=_12.getFill();
_7.dyn.stroke=_12.getStroke();
if(_c){
var o={element:"column",index:j,run:_7,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:_12,x:j+0.5,y:v};
this._connectEvents(_12,o);
}
if(this.animate){
this._animateColumn(_12,_4.height-_5.b,_e);
}
}
}
}
_7.dirty=false;
for(var j=0;j<_7.data.length;++j){
var _8=_7.data[j];
if(_8!==null){
var v=typeof _8=="number"?_8:_8.y;
if(isNaN(v)){
v=0;
}
_6[j]-=v;
}
}
}
this.dirty=false;
return this;
}});
})();
}
