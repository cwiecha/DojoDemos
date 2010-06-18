/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.plot2d.Scatter"]){
dojo._hasResource["dojox.charting.plot2d.Scatter"]=true;
dojo.provide("dojox.charting.plot2d.Scatter");
dojo.require("dojox.charting.plot2d.common");
dojo.require("dojox.charting.plot2d.Base");
dojo.require("dojox.lang.utils");
dojo.require("dojox.lang.functional");
dojo.require("dojox.lang.functional.reversed");
dojo.require("dojox.gfx.gradutils");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_1=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Scatter",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",shadows:null,animate:null},optionalParams:{markerStroke:{},markerOutline:{},markerShadow:{},markerFill:{},markerFont:"",markerFontColor:""},constructor:function(_2,_3){
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
var t=this.chart.theme,_8=this.events();
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
var _a=t.next("marker",[this.opt,_9]),s=_9.group,_b,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler);
if(typeof _9.data[0]=="number"){
_b=dojo.map(_9.data,function(v,i){
return {x:ht(i+1)+_6.l,y:_5.height-_6.b-vt(v)};
},this);
}else{
_b=dojo.map(_9.data,function(v,i){
return {x:ht(v.x)+_6.l,y:_5.height-_6.b-vt(v.y)};
},this);
}
var _c=new Array(_b.length),_d=new Array(_b.length),_e=new Array(_b.length);
dojo.forEach(_b,function(c,i){
var _f=typeof _9.data[i]=="number"?t.post(_a,"marker"):t.addMixin(_a,"marker",_9.data[i],true),_10="M"+c.x+" "+c.y+" "+_f.symbol;
if(_f.marker.shadow){
_c[i]=s.createPath("M"+(c.x+_f.marker.shadow.dx)+" "+(c.y+_f.marker.shadow.dy)+" "+_f.symbol).setStroke(_f.marker.shadow).setFill(_f.marker.shadow.color);
if(this.animate){
this._animateScatter(_c[i],_5.height-_6.b);
}
}
if(_f.marker.outline){
var _11=dc.makeStroke(_f.marker.outline);
_11.width=2*_11.width+_f.marker.stroke.width;
_e[i]=s.createPath(_10).setStroke(_11);
if(this.animate){
this._animateScatter(_e[i],_5.height-_6.b);
}
}
var _12=dc.makeStroke(_f.marker.stroke),_13=this._plotFill(_f.marker.fill,_5,_6);
if(_13&&(_13.type==="linear"||_13.type=="radial")){
var _14=dojox.gfx.gradutils.getColor(_13,{x:c.x,y:c.y});
if(_12){
_12.color=_14;
}
_d[i]=s.createPath(_10).setStroke(_12).setFill(_14);
}else{
_d[i]=s.createPath(_10).setStroke(_12).setFill(_13);
}
if(this.animate){
this._animateScatter(_d[i],_5.height-_6.b);
}
},this);
if(_d.length){
_9.dyn.stroke=_d[_d.length-1].getStroke();
_9.dyn.fill=_d[_d.length-1].getFill();
}
if(_8){
dojo.forEach(_d,function(s,i){
var o={element:"marker",index:i,run:_9,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:s,outline:_e&&_e[i]||null,shadow:_c&&_c[i]||null,cx:_b[i].x,cy:_b[i].y};
if(typeof _9.data[0]=="number"){
o.x=i+1;
o.y=_9.data[i];
}else{
o.x=_9.data[i].x;
o.y=_9.data[i].y;
}
this._connectEvents(s,o);
},this);
}
_9.dirty=false;
}
this.dirty=false;
return this;
},_animateScatter:function(_15,_16){
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_15,duration:1200,transform:[{name:"translate",start:[0,_16],end:[0,0]},{name:"scale",start:[0,0],end:[1,1]},{name:"original"}]},this.animate)).play();
}});
})();
}
