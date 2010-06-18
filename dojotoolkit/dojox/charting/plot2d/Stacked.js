/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.plot2d.Stacked"]){
dojo._hasResource["dojox.charting.plot2d.Stacked"]=true;
dojo.provide("dojox.charting.plot2d.Stacked");
dojo.require("dojox.charting.plot2d.common");
dojo.require("dojox.charting.plot2d.Default");
dojo.require("dojox.lang.functional");
dojo.require("dojox.lang.functional.sequence");
dojo.require("dojox.lang.functional.reversed");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_1=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Stacked",dojox.charting.plot2d.Default,{calculateAxes:function(_2){
var _3=dc.collectStackedStats(this.series);
this._maxRunLength=_3.hmax;
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
var v=_7.data[j];
if(v!==null){
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
df.forEachRev(this.series,function(_8){
_8.cleanGroup(s);
});
}
var t=this.chart.theme,_9=this.events(),ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler);
this.resetEvents();
for(var i=this.series.length-1;i>=0;--i){
var _7=this.series[i];
if(!this.dirty&&!_7.dirty){
t.skip();
continue;
}
_7.cleanGroup();
var _a=t.next(this.opt.areas?"area":"line",[this.opt,_7],true),s=_7.group,_b,_c=dojo.map(_6,function(v,i){
return {x:ht(i+1)+_5.l,y:_4.height-_5.b-vt(v)};
},this);
var _d=this.opt.tension?dc.curve(_c,this.opt.tension):"";
if(this.opt.areas){
var _e=dojo.clone(_c);
if(this.opt.tension){
var p=dc.curve(_e,this.opt.tension);
p+=" L"+_c[_c.length-1].x+","+(_4.height-_5.b)+" L"+_c[0].x+","+(_4.height-_5.b)+" L"+_c[0].x+","+_c[0].y;
_7.dyn.fill=s.createPath(p).setFill(_a.series.fill).getFill();
}else{
_e.push({x:_c[_c.length-1].x,y:_4.height-_5.b});
_e.push({x:_c[0].x,y:_4.height-_5.b});
_e.push(_c[0]);
_7.dyn.fill=s.createPolyline(_e).setFill(_a.series.fill).getFill();
}
}
if(this.opt.lines||this.opt.markers){
if(_a.series.outline){
_b=dc.makeStroke(_a.series.outline);
_b.width=2*_b.width+_a.series.stroke.width;
}
}
if(this.opt.markers){
_7.dyn.marker=_a.symbol;
}
var _f,_10,_11;
if(_a.series.shadow&&_a.series.stroke){
var _12=_a.series.shadow,_13=dojo.map(_c,function(c){
return {x:c.x+_12.dx,y:c.y+_12.dy};
});
if(this.opt.lines){
if(this.opt.tension){
_7.dyn.shadow=s.createPath(dc.curve(_13,this.opt.tension)).setStroke(_12).getStroke();
}else{
_7.dyn.shadow=s.createPolyline(_13).setStroke(_12).getStroke();
}
}
if(this.opt.markers){
_12=_a.marker.shadow;
_11=dojo.map(_13,function(c){
return s.createPath("M"+c.x+" "+c.y+" "+_a.symbol).setStroke(_12).setFill(_12.color);
},this);
}
}
if(this.opt.lines){
if(_b){
if(this.opt.tension){
_7.dyn.outline=s.createPath(_d).setStroke(_b).getStroke();
}else{
_7.dyn.outline=s.createPolyline(_c).setStroke(_b).getStroke();
}
}
if(this.opt.tension){
_7.dyn.stroke=s.createPath(_d).setStroke(_a.series.stroke).getStroke();
}else{
_7.dyn.stroke=s.createPolyline(_c).setStroke(_a.series.stroke).getStroke();
}
}
if(this.opt.markers){
_f=new Array(_c.length);
_10=new Array(_c.length);
_b=null;
if(_a.marker.outline){
_b=dc.makeStroke(_a.marker.outline);
_b.width=2*_b.width+(_a.marker.stroke?_a.marker.stroke.width:0);
}
dojo.forEach(_c,function(c,i){
var _14="M"+c.x+" "+c.y+" "+_a.symbol;
if(_b){
_10[i]=s.createPath(_14).setStroke(_b);
}
_f[i]=s.createPath(_14).setStroke(_a.marker.stroke).setFill(_a.marker.fill);
},this);
if(_9){
dojo.forEach(_f,function(s,i){
var o={element:"marker",index:i,run:_7,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:s,outline:_10[i]||null,shadow:_11&&_11[i]||null,cx:_c[i].x,cy:_c[i].y,x:i+1,y:_7.data[i]};
this._connectEvents(s,o);
},this);
}
}
_7.dirty=false;
for(var j=0;j<_7.data.length;++j){
var v=_7.data[j];
if(v!==null){
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
