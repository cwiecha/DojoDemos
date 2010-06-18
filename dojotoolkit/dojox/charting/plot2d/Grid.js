/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.plot2d.Grid"]){
dojo._hasResource["dojox.charting.plot2d.Grid"]=true;
dojo.provide("dojox.charting.plot2d.Grid");
dojo.require("dojox.charting.Element");
dojo.require("dojox.charting.plot2d.common");
dojo.require("dojox.lang.functional");
(function(){
var du=dojox.lang.utils;
dojo.declare("dojox.charting.plot2d.Grid",dojox.charting.Element,{defaultParams:{hAxis:"x",vAxis:"y",hMajorLines:true,hMinorLines:false,vMajorLines:true,vMinorLines:false,hStripes:"none",vStripes:"none",animate:null},optionalParams:{},constructor:function(_1,_2){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_2);
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.dirty=true;
this.animate=this.opt.animate;
this.zoom=null,this.zoomQueue=[];
this.lastWindow={vscale:1,hscale:1,xoffset:0,yoffset:0};
},clear:function(){
this._hAxis=null;
this._vAxis=null;
this.dirty=true;
return this;
},setAxis:function(_3){
if(_3){
this[_3.vertical?"_vAxis":"_hAxis"]=_3;
}
return this;
},addSeries:function(_4){
return this;
},calculateAxes:function(_5){
return this;
},isDirty:function(){
return this.dirty||this._hAxis&&this._hAxis.dirty||this._vAxis&&this._vAxis.dirty;
},performZoom:function(_6,_7){
var vs=this._vAxis.scale||1,hs=this._hAxis.scale||1,_8=_6.height-_7.b,_9=this._hAxis.getScaler().bounds,_a=(_9.from-_9.lower)*_9.scale,_b=this._vAxis.getScaler().bounds,_c=(_b.from-_b.lower)*_b.scale;
rVScale=vs/this.lastWindow.vscale,rHScale=hs/this.lastWindow.hscale,rXOffset=(this.lastWindow.xoffset-_a)/((this.lastWindow.hscale==1)?hs:this.lastWindow.hscale),rYOffset=(_c-this.lastWindow.yoffset)/((this.lastWindow.vscale==1)?vs:this.lastWindow.vscale),shape=this.group,anim=dojox.gfx.fx.animateTransform(dojo.delegate({shape:shape,duration:1200,transform:[{name:"translate",start:[0,0],end:[_7.l*(1-rHScale),_8*(1-rVScale)]},{name:"scale",start:[1,1],end:[rHScale,rVScale]},{name:"original"},{name:"translate",start:[0,0],end:[rXOffset,rYOffset]}]},this.zoom));
dojo.mixin(this.lastWindow,{vscale:vs,hscale:hs,xoffset:_a,yoffset:_c});
this.zoomQueue.push(anim);
dojo.connect(anim,"onEnd",this,function(){
this.zoom=null;
this.zoomQueue.shift();
if(this.zoomQueue.length>0){
this.zoomQueue[0].play();
}
});
if(this.zoomQueue.length==1){
this.zoomQueue[0].play();
}
return this;
},getRequiredColors:function(){
return 0;
},render:function(_d,_e){
if(this.zoom){
return this.performZoom(_d,_e);
}
this.dirty=this.isDirty();
if(!this.dirty){
return this;
}
this.cleanGroup();
var s=this.group,ta=this.chart.theme.axis;
try{
var _f=this._vAxis.getScaler(),vt=_f.scaler.getTransformerFromModel(_f),_10=this._vAxis.getTicks();
if(this.opt.hMinorLines){
dojo.forEach(_10.minor,function(_11){
var y=_d.height-_e.b-vt(_11.value);
var _12=s.createLine({x1:_e.l,y1:y,x2:_d.width-_e.r,y2:y}).setStroke(ta.minorTick);
if(this.animate){
this._animateGrid(_12,"h",_e.l,_e.r+_e.l-_d.width);
}
},this);
}
if(this.opt.hMajorLines){
dojo.forEach(_10.major,function(_13){
var y=_d.height-_e.b-vt(_13.value);
var _14=s.createLine({x1:_e.l,y1:y,x2:_d.width-_e.r,y2:y}).setStroke(ta.majorTick);
if(this.animate){
this._animateGrid(_14,"h",_e.l,_e.r+_e.l-_d.width);
}
},this);
}
}
catch(e){
}
try{
var _15=this._hAxis.getScaler(),ht=_15.scaler.getTransformerFromModel(_15),_10=this._hAxis.getTicks();
if(_10&&this.opt.vMinorLines){
dojo.forEach(_10.minor,function(_16){
var x=_e.l+ht(_16.value);
var _17=s.createLine({x1:x,y1:_e.t,x2:x,y2:_d.height-_e.b}).setStroke(ta.minorTick);
if(this.animate){
this._animateGrid(_17,"v",_d.height-_e.b,_d.height-_e.b-_e.t);
}
},this);
}
if(_10&&this.opt.vMajorLines){
dojo.forEach(_10.major,function(_18){
var x=_e.l+ht(_18.value);
var _19=s.createLine({x1:x,y1:_e.t,x2:x,y2:_d.height-_e.b}).setStroke(ta.majorTick);
if(this.animate){
this._animateGrid(_19,"v",_d.height-_e.b,_d.height-_e.b-_e.t);
}
},this);
}
}
catch(e){
}
this.dirty=false;
return this;
},_animateGrid:function(_1a,_1b,_1c,_1d){
var _1e=_1b=="h"?[_1c,0]:[0,_1c];
var _1f=_1b=="h"?[1/_1d,1]:[1,1/_1d];
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_1a,duration:1200,transform:[{name:"translate",start:_1e,end:[0,0]},{name:"scale",start:_1f,end:[1,1]},{name:"original"}]},this.animate)).play();
}});
})();
}
