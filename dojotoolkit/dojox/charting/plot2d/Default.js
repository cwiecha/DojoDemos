/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.plot2d.Default"]){
dojo._hasResource["dojox.charting.plot2d.Default"]=true;
dojo.provide("dojox.charting.plot2d.Default");
dojo.require("dojox.charting.plot2d.common");
dojo.require("dojox.charting.plot2d.Base");
dojo.require("dojox.lang.utils");
dojo.require("dojox.lang.functional");
dojo.require("dojox.lang.functional.reversed");
dojo.require("dojox.gfx.fx");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_1=df.lambda("item.purgeGroup()");
var _2=1200;
dojo.declare("dojox.charting.plot2d.Default",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",lines:true,areas:false,markers:false,tension:"",animate:false},optionalParams:{stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:"",markerStroke:{},markerOutline:{},markerShadow:{},markerFill:{},markerFont:"",markerFontColor:""},constructor:function(_3,_4){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_4);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.animate=this.opt.animate;
},calculateAxes:function(_5){
this._calc(_5,dc.collectSimpleStats(this.series));
return this;
},render:function(_6,_7){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(_6,_7);
}
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_1);
this.cleanGroup();
this.group.setTransform(null);
var s=this.group;
df.forEachRev(this.series,function(_8){
_8.cleanGroup(s);
});
}
var t=this.chart.theme,_9,_a,_b,_c=this.events();
this.resetEvents();
for(var i=this.series.length-1;i>=0;--i){
var _d=this.series[i];
if(!this.dirty&&!_d.dirty){
t.skip();
continue;
}
_d.cleanGroup();
if(!_d.data.length){
_d.dirty=false;
t.skip();
continue;
}
var _e=t.next(this.opt.areas?"area":"line",[this.opt,_d],true),s=_d.group,_f=[],_10=[],_11=null,_12,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler);
for(var j=0;j<_d.data.length;j++){
if(_d.data[j]!=null){
if(!_11){
_11=[];
_10.push(j);
_f.push(_11);
}
_11.push(_d.data[j]);
}else{
_11=null;
}
}
for(var seg=0;seg<_f.length;seg++){
if(typeof _f[seg][0]=="number"){
_12=dojo.map(_f[seg],function(v,i){
return {x:ht(i+_10[seg]+1)+_7.l,y:_6.height-_7.b-vt(v)};
},this);
}else{
_12=dojo.map(_f[seg],function(v,i){
return {x:ht(v.x)+_7.l,y:_6.height-_7.b-vt(v.y)};
},this);
}
var _13=this.opt.tension?dc.curve(_12,this.opt.tension):"";
if(this.opt.areas&&_12.length>1){
var _14=_e.series.fill;
var _15=dojo.clone(_12);
if(this.opt.tension){
var _16="L"+_15[_15.length-1].x+","+(_6.height-_7.b)+" L"+_15[0].x+","+(_6.height-_7.b)+" L"+_15[0].x+","+_15[0].y;
_d.dyn.fill=s.createPath(_13+" "+_16).setFill(_14).getFill();
}else{
_15.push({x:_12[_12.length-1].x,y:_6.height-_7.b});
_15.push({x:_12[0].x,y:_6.height-_7.b});
_15.push(_12[0]);
_d.dyn.fill=s.createPolyline(_15).setFill(_14).getFill();
}
}
if(this.opt.lines||this.opt.markers){
_9=_e.series.stroke;
if(_e.series.outline){
_a=_d.dyn.outline=dc.makeStroke(_e.series.outline);
_a.width=2*_a.width+_9.width;
}
}
if(this.opt.markers){
_d.dyn.marker=_e.symbol;
}
var _17=null,_18=null,_19=null;
if(_9&&_e.series.shadow&&_12.length>1){
var _1a=_e.series.shadow,_1b=dojo.map(_12,function(c){
return {x:c.x+_1a.dx,y:c.y+_1a.dy};
});
if(this.opt.lines){
if(this.opt.tension){
_d.dyn.shadow=s.createPath(dc.curve(_1b,this.opt.tension)).setStroke(_1a).getStroke();
}else{
_d.dyn.shadow=s.createPolyline(_1b).setStroke(_1a).getStroke();
}
}
if(this.opt.markers&&_e.marker.shadow){
_1a=_e.marker.shadow;
_19=dojo.map(_1b,function(c){
return s.createPath("M"+c.x+" "+c.y+" "+_e.symbol).setStroke(_1a).setFill(_1a.color);
},this);
}
}
if(this.opt.lines&&_12.length>1){
if(_a){
if(this.opt.tension){
_d.dyn.outline=s.createPath(_13).setStroke(_a).getStroke();
}else{
_d.dyn.outline=s.createPolyline(_12).setStroke(_a).getStroke();
}
}
if(this.opt.tension){
_d.dyn.stroke=s.createPath(_13).setStroke(_9).getStroke();
}else{
_d.dyn.stroke=s.createPolyline(_12).setStroke(_9).getStroke();
}
}
if(this.opt.markers){
_17=new Array(_12.length);
_18=new Array(_12.length);
_a=null;
if(_e.marker.outline){
_a=dc.makeStroke(_e.marker.outline);
_a.width=2*_a.width+(_e.marker.stroke?_e.marker.stroke.width:0);
}
dojo.forEach(_12,function(c,i){
var _1c="M"+c.x+" "+c.y+" "+_e.symbol;
if(_a){
_18[i]=s.createPath(_1c).setStroke(_a);
}
_17[i]=s.createPath(_1c).setStroke(_e.marker.stroke).setFill(_e.marker.fill);
},this);
if(_c){
dojo.forEach(_17,function(s,i){
var o={element:"marker",index:i,run:_d,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:s,outline:_18[i]||null,shadow:_19&&_19[i]||null,cx:_12[i].x,cy:_12[i].y};
if(typeof _f[seg][0]=="number"){
o.x=i+1;
o.y=_f[seg][i];
}else{
o.x=_f[seg][i].x;
o.y=_f[seg][i].y;
}
this._connectEvents(s,o);
},this);
}
}
}
_d.dirty=false;
}
if(this.animate){
var _1d=this.group;
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_1d,duration:_2,transform:[{name:"translate",start:[0,_6.height-_7.b],end:[0,0]},{name:"scale",start:[1,0],end:[1,1]},{name:"original"}]},this.animate)).play();
}
this.dirty=false;
return this;
}});
})();
}
