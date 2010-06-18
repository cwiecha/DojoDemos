/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.plot2d.Candlesticks"]){
dojo._hasResource["dojox.charting.plot2d.Candlesticks"]=true;
dojo.provide("dojox.charting.plot2d.Candlesticks");
dojo.require("dojox.charting.plot2d.common");
dojo.require("dojox.charting.plot2d.Base");
dojo.require("dojox.lang.utils");
dojo.require("dojox.lang.functional");
dojo.require("dojox.lang.functional.reversed");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_1=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Candlesticks",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",gap:2,animate:null},optionalParams:{minBarSize:1,maxBarSize:1,stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:""},constructor:function(_2,_3){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_3);
du.updateWithPattern(this.opt,_3,this.optionalParams);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.animate=this.opt.animate;
},collectStats:function(_4){
var _5=dojo.clone(dc.defaultStats);
for(var i=0;i<_4.length;i++){
var _6=_4[i];
if(!_6.data.length){
continue;
}
var _7=_5.vmin,_8=_5.vmax;
if(!("ymin" in _6)||!("ymax" in _6)){
dojo.forEach(_6.data,function(_9,_a){
if(_9!==null){
var x=_9.x||_a+1;
_5.hmin=Math.min(_5.hmin,x);
_5.hmax=Math.max(_5.hmax,x);
_5.vmin=Math.min(_5.vmin,_9.open,_9.close,_9.high,_9.low);
_5.vmax=Math.max(_5.vmax,_9.open,_9.close,_9.high,_9.low);
}
});
}
if("ymin" in _6){
_5.vmin=Math.min(_7,_6.ymin);
}
if("ymax" in _6){
_5.vmax=Math.max(_8,_6.ymax);
}
}
return _5;
},calculateAxes:function(_b){
var _c=this.collectStats(this.series),t;
_c.hmin-=0.5;
_c.hmax+=0.5;
this._calc(_b,_c);
return this;
},render:function(_d,_e){
if(this.zoom&&!this.isDataDirty()){
return this.performZoom(_d,_e);
}
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_1);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(_f){
_f.cleanGroup(s);
});
}
var t=this.chart.theme,f,gap,_10,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_11=Math.max(0,this._vScaler.bounds.lower),_12=vt(_11),_13=this.events();
f=dc.calculateBarSize(this._hScaler.bounds.scale,this.opt);
gap=f.gap;
_10=f.size;
this.resetEvents();
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
t.skip();
continue;
}
run.cleanGroup();
var _14=t.next("candlestick",[this.opt,run]),s=run.group;
for(var j=0;j<run.data.length;++j){
var v=run.data[j];
if(v!==null){
var _15=t.addMixin(_14,"candlestick",v,true);
var x=ht(v.x||(j+0.5))+_e.l+gap,y=_d.height-_e.b,_16=vt(v.open),_17=vt(v.close),_18=vt(v.high),low=vt(v.low);
if("mid" in v){
var mid=vt(v.mid);
}
if(low>_18){
var tmp=_18;
_18=low;
low=tmp;
}
if(_10>=1){
var _19=_16>_17;
var _1a={x1:_10/2,x2:_10/2,y1:y-_18,y2:y-low},_1b={x:0,y:y-Math.max(_16,_17),width:_10,height:Math.max(_19?_16-_17:_17-_16,1)};
shape=s.createGroup();
shape.setTransform({dx:x,dy:0});
var _1c=shape.createGroup();
_1c.createLine(_1a).setStroke(_15.series.stroke);
_1c.createRect(_1b).setStroke(_15.series.stroke).setFill(_19?_15.series.fill:"white");
if("mid" in v){
_1c.createLine({x1:(_15.series.stroke.width||1),x2:_10-(_15.series.stroke.width||1),y1:y-mid,y2:y-mid}).setStroke(_19?"white":_15.series.stroke);
}
run.dyn.fill=_15.series.fill;
run.dyn.stroke=_15.series.stroke;
if(_13){
var o={element:"candlestick",index:j,run:run,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:_1c,x:x,y:y-Math.max(_16,_17),cx:_10/2,cy:(y-Math.max(_16,_17))+(Math.max(_19?_16-_17:_17-_16,1)/2),width:_10,height:Math.max(_19?_16-_17:_17-_16,1),data:v};
this._connectEvents(shape,o);
}
}
if(this.animate){
this._animateCandlesticks(shape,y-low,_18-low);
}
}
}
run.dirty=false;
}
this.dirty=false;
return this;
},_animateCandlesticks:function(_1d,_1e,_1f){
dojox.gfx.fx.animateTransform(dojo.delegate({shape:_1d,duration:1200,transform:[{name:"translate",start:[0,_1e-(_1e/_1f)],end:[0,0]},{name:"scale",start:[1,1/_1f],end:[1,1]},{name:"original"}]},this.animate)).play();
}});
})();
}
