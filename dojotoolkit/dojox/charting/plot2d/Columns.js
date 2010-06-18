/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.plot2d.Columns"]){
dojo._hasResource["dojox.charting.plot2d.Columns"]=true;
dojo.provide("dojox.charting.plot2d.Columns");
dojo.require("dojox.charting.plot2d.common");
dojo.require("dojox.charting.plot2d.Base");
dojo.require("dojox.gfx.fx");
dojo.require("dojox.lang.utils");
dojo.require("dojox.lang.functional");
dojo.require("dojox.lang.functional.reversed");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_1=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Columns",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",gap:0,animate:null},optionalParams:{minBarSize:1,maxBarSize:1,stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:""},constructor:function(_2,_3){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_3);
du.updateWithPattern(this.opt,_3,this.optionalParams);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.animate=this.opt.animate;
},calculateAxes:function(_4){
var _5=dc.collectSimpleStats(this.series);
_5.hmin-=0.5;
_5.hmax+=0.5;
this._calc(_4,_5);
return this;
},render:function(_6,_7){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(_6,_7);
}
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_1);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(_8){
_8.cleanGroup(s);
});
}
var t=this.chart.theme,f,_9,_a,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_b=Math.max(0,this._vScaler.bounds.lower),_c=vt(_b),_d=this.events();
f=dc.calculateBarSize(this._hScaler.bounds.scale,this.opt);
_9=f.gap;
_a=f.size;
this.resetEvents();
for(var i=this.series.length-1;i>=0;--i){
var _e=this.series[i];
if(!this.dirty&&!_e.dirty){
t.skip();
continue;
}
_e.cleanGroup();
var _f=t.next("column",[this.opt,_e]),s=_e.group;
for(var j=0;j<_e.data.length;++j){
var _10=_e.data[j];
if(_10!==null){
var v=typeof _10=="number"?_10:_10.y,vv=vt(v),_11=vv-_c,h=Math.abs(_11),_12=typeof _10!="number"?t.addMixin(_f,"column",_10,true):t.post(_f,"column");
if(_a>=1&&h>=1){
var _13={x:_7.l+ht(j+0.5)+_9,y:_6.height-_7.b-(v>_b?vv:_c),width:_a,height:h};
var _14=this._plotFill(_12.series.fill,_6,_7);
_14=this._shapeFill(_14,_13);
var _15=s.createRect(_13).setFill(_14).setStroke(_12.series.stroke);
_e.dyn.fill=_15.getFill();
_e.dyn.stroke=_15.getStroke();
if(_d){
var o={element:"column",index:j,run:_e,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:_15,x:j+0.5,y:v};
this._connectEvents(_15,o);
}
if(this.animate){
this._animateColumn(_15,_6.height-_7.b-_c,h);
}
}
}
}
_e.dirty=false;
}
this.dirty=false;
return this;
},_animateColumn:function(_16,_17,_18){
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_16,duration:1200,transform:[{name:"translate",start:[0,_17-(_17/_18)],end:[0,0]},{name:"scale",start:[1,1/_18],end:[1,1]},{name:"original"}]},this.animate)).play();
}});
})();
}
