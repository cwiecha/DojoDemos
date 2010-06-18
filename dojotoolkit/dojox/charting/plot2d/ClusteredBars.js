/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.plot2d.ClusteredBars"]){
dojo._hasResource["dojox.charting.plot2d.ClusteredBars"]=true;
dojo.provide("dojox.charting.plot2d.ClusteredBars");
dojo.require("dojox.charting.plot2d.common");
dojo.require("dojox.charting.plot2d.Bars");
dojo.require("dojox.lang.functional");
dojo.require("dojox.lang.functional.reversed");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_1=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.ClusteredBars",dojox.charting.plot2d.Bars,{render:function(_2,_3){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(_2,_3);
}
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_1);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(_4){
_4.cleanGroup(s);
});
}
var t=this.chart.theme,f,_5,_6,_7,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_8=Math.max(0,this._hScaler.bounds.lower),_9=ht(_8),_a=this.events();
f=dc.calculateBarSize(this._vScaler.bounds.scale,this.opt,this.series.length);
_5=f.gap;
_6=_7=f.size;
this.resetEvents();
for(var i=this.series.length-1;i>=0;--i){
var _b=this.series[i],_c=_7*(this.series.length-i-1);
if(!this.dirty&&!_b.dirty){
t.skip();
continue;
}
_b.cleanGroup();
var _d=t.next("bar",[this.opt,_b]),s=_b.group;
for(var j=0;j<_b.data.length;++j){
var _e=_b.data[j];
if(_e!==null){
var v=typeof _e=="number"?_e:_e.y,hv=ht(v),_f=hv-_9,w=Math.abs(_f),_10=typeof _e!="number"?t.addMixin(_d,"bar",_e,true):t.post(_d,"bar");
if(w>=1&&_6>=1){
var _11={x:_3.l+(v<_8?hv:_9),y:_2.height-_3.b-vt(j+1.5)+_5+_c,width:w,height:_6};
var _12=this._plotFill(_10.series.fill,_2,_3);
_12=this._shapeFill(_12,_11);
var _13=s.createRect(_11).setFill(_12).setStroke(_10.series.stroke);
_b.dyn.fill=_13.getFill();
_b.dyn.stroke=_13.getStroke();
if(_a){
var o={element:"bar",index:j,run:_b,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:_13,x:v,y:j+1.5};
this._connectEvents(_13,o);
}
if(this.animate){
this._animateBar(_13,_3.l+_9,-_f);
}
}
}
}
_b.dirty=false;
}
this.dirty=false;
return this;
}});
})();
}
