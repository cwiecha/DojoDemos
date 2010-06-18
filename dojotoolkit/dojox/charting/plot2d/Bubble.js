/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.plot2d.Bubble"]){
dojo._hasResource["dojox.charting.plot2d.Bubble"]=true;
dojo.provide("dojox.charting.plot2d.Bubble");
dojo.require("dojox.charting.plot2d.Base");
dojo.require("dojox.lang.functional");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_1=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Bubble",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",animate:null},optionalParams:{stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:""},constructor:function(_2,_3){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_3);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.animate=this.opt.animate;
},calculateAxes:function(_4){
this._calc(_4,dc.collectSimpleStats(this.series));
return this;
},render:function(_5,_6){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(_5,_6);
}
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_1);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(_7){
_7.cleanGroup(s);
});
}
var t=this.chart.theme,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_8=this.events();
this.resetEvents();
for(var i=this.series.length-1;i>=0;--i){
var _9=this.series[i];
if(!this.dirty&&!_9.dirty){
t.skip();
continue;
}
_9.cleanGroup();
if(!_9.data.length){
_9.dirty=false;
t.skip();
continue;
}
if(typeof _9.data[0]=="number"){
console.warn("dojox.charting.plot2d.Bubble: the data in the following series cannot be rendered as a bubble chart; ",_9);
continue;
}
var _a=t.next("circle",[this.opt,_9]),s=_9.group,_b=dojo.map(_9.data,function(v,i){
return v?{x:ht(v.x)+_6.l,y:_5.height-_6.b-vt(v.y),radius:this._vScaler.bounds.scale*(v.size/2)}:null;
},this);
var _c=null,_d=null,_e=null;
if(_a.series.shadow){
_e=dojo.map(_b,function(_f){
if(_f!==null){
var _10=t.addMixin(_a,"circle",_f,true),_11=_10.series.shadow;
var _12=s.createCircle({cx:_f.x+_11.dx,cy:_f.y+_11.dy,r:_f.radius}).setStroke(_11).setFill(_11.color);
if(this.animate){
this._animateBubble(_12,_5.height-_6.b,_f.radius);
}
return _12;
}
return null;
},this);
if(_e.length){
_9.dyn.shadow=_e[_e.length-1].getStroke();
}
}
if(_a.series.outline){
_d=dojo.map(_b,function(_13){
if(_13!==null){
var _14=t.addMixin(_a,"circle",_13,true),_15=dc.makeStroke(_14.series.outline);
_15.width=2*_15.width+_a.series.stroke.width;
var _16=s.createCircle({cx:_13.x,cy:_13.y,r:_13.radius}).setStroke(_15);
if(this.animate){
this._animateBubble(_16,_5.height-_6.b,_13.radius);
}
return _16;
}
return null;
},this);
if(_d.length){
_9.dyn.outline=_d[_d.length-1].getStroke();
}
}
_c=dojo.map(_b,function(_17){
if(_17!==null){
var _18=t.addMixin(_a,"circle",_17,true),_19={x:_17.x-_17.radius,y:_17.y-_17.radius,width:2*_17.radius,height:2*_17.radius};
var _1a=this._plotFill(_18.series.fill,_5,_6);
_1a=this._shapeFill(_1a,_19);
var _1b=s.createCircle({cx:_17.x,cy:_17.y,r:_17.radius}).setFill(_1a).setStroke(_18.series.stroke);
if(this.animate){
this._animateBubble(_1b,_5.height-_6.b,_17.radius);
}
return _1b;
}
return null;
},this);
if(_c.length){
_9.dyn.fill=_c[_c.length-1].getFill();
_9.dyn.stroke=_c[_c.length-1].getStroke();
}
if(_8){
dojo.forEach(_c,function(s,i){
if(s!==null){
var o={element:"circle",index:i,run:_9,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:s,outline:_d&&_d[i]||null,shadow:_e&&_e[i]||null,x:_9.data[i].x,y:_9.data[i].y,r:_9.data[i].size/2,cx:_b[i].x,cy:_b[i].y,cr:_b[i].radius};
this._connectEvents(s,o);
}
},this);
}
_9.dirty=false;
}
this.dirty=false;
return this;
},_animateBubble:function(_1c,_1d,_1e){
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_1c,duration:1200,transform:[{name:"translate",start:[0,_1d],end:[0,0]},{name:"scale",start:[0,1/_1e],end:[1,1]},{name:"original"}]},this.animate)).play();
}});
})();
}
