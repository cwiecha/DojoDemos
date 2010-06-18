/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.Chart2D"]){
dojo._hasResource["dojox.charting.Chart2D"]=true;
dojo.provide("dojox.charting.Chart2D");
dojo.require("dojox.gfx");
dojo.require("dojox.lang.functional");
dojo.require("dojox.lang.functional.fold");
dojo.require("dojox.lang.functional.reversed");
dojo.require("dojox.charting.Theme");
dojo.require("dojox.charting.Series");
dojo.require("dojox.charting.axis2d.Default");
dojo.require("dojox.charting.plot2d.Default");
dojo.require("dojox.charting.plot2d.Lines");
dojo.require("dojox.charting.plot2d.Areas");
dojo.require("dojox.charting.plot2d.Markers");
dojo.require("dojox.charting.plot2d.MarkersOnly");
dojo.require("dojox.charting.plot2d.Scatter");
dojo.require("dojox.charting.plot2d.Stacked");
dojo.require("dojox.charting.plot2d.StackedLines");
dojo.require("dojox.charting.plot2d.StackedAreas");
dojo.require("dojox.charting.plot2d.Columns");
dojo.require("dojox.charting.plot2d.StackedColumns");
dojo.require("dojox.charting.plot2d.ClusteredColumns");
dojo.require("dojox.charting.plot2d.Bars");
dojo.require("dojox.charting.plot2d.StackedBars");
dojo.require("dojox.charting.plot2d.ClusteredBars");
dojo.require("dojox.charting.plot2d.Grid");
dojo.require("dojox.charting.plot2d.Pie");
dojo.require("dojox.charting.plot2d.Bubble");
dojo.require("dojox.charting.plot2d.Candlesticks");
dojo.require("dojox.charting.plot2d.OHLC");
(function(){
var df=dojox.lang.functional,dc=dojox.charting,_1=df.lambda("item.clear()"),_2=df.lambda("item.purgeGroup()"),_3=df.lambda("item.destroy()"),_4=df.lambda("item.dirty = false"),_5=df.lambda("item.dirty = true");
dojo.declare("dojox.charting.Chart2D",null,{constructor:function(_6,_7){
if(!_7){
_7={};
}
this.margins=_7.margins?_7.margins:{l:10,t:10,r:10,b:10};
this.stroke=_7.stroke;
this.fill=_7.fill;
this.theme=null;
this.axes={};
this.stack=[];
this.plots={};
this.series=[];
this.runs={};
this.dirty=true;
this.coords=null;
this.node=dojo.byId(_6);
var _8=dojo.marginBox(_6);
this.surface=dojox.gfx.createSurface(this.node,_8.w||400,_8.h||300);
},destroy:function(){
dojo.forEach(this.series,_3);
dojo.forEach(this.stack,_3);
df.forIn(this.axes,_3);
this.surface.destroy();
},getCoords:function(){
if(!this.coords){
this.coords=dojo.coords(this.node,true);
}
return this.coords;
},setTheme:function(_9){
this.theme=_9.clone();
this.dirty=true;
return this;
},addAxis:function(_a,_b){
var _c;
if(!_b||!("type" in _b)){
_c=new dc.axis2d.Default(this,_b);
}else{
_c=typeof _b.type=="string"?new dc.axis2d[_b.type](this,_b):new _b.type(this,_b);
}
_c.name=_a;
_c.dirty=true;
if(_a in this.axes){
this.axes[_a].destroy();
}
this.axes[_a]=_c;
this.dirty=true;
return this;
},getAxis:function(_d){
return this.axes[_d];
},removeAxis:function(_e){
if(_e in this.axes){
this.axes[_e].destroy();
delete this.axes[_e];
this.dirty=true;
}
return this;
},addPlot:function(_f,_10){
var _11;
if(!_10||!("type" in _10)){
_11=new dc.plot2d.Default(this,_10);
}else{
_11=typeof _10.type=="string"?new dc.plot2d[_10.type](this,_10):new _10.type(this,_10);
}
_11.name=_f;
_11.dirty=true;
if(_f in this.plots){
this.stack[this.plots[_f]].destroy();
this.stack[this.plots[_f]]=_11;
}else{
this.plots[_f]=this.stack.length;
this.stack.push(_11);
}
this.dirty=true;
return this;
},removePlot:function(_12){
if(_12 in this.plots){
var _13=this.plots[_12];
delete this.plots[_12];
this.stack[_13].destroy();
this.stack.splice(_13,1);
df.forIn(this.plots,function(idx,_14,_15){
if(idx>_13){
_15[_14]=idx-1;
}
});
this.dirty=true;
}
return this;
},addSeries:function(_16,_17,_18){
var run=new dc.Series(this,_17,_18);
if(_16 in this.runs){
this.series[this.runs[_16]].destroy();
this.series[this.runs[_16]]=run;
}else{
this.runs[_16]=this.series.length;
this.series.push(run);
}
run.name=_16;
this.dirty=true;
if(!("ymin" in run)&&"min" in run){
run.ymin=run.min;
}
if(!("ymax" in run)&&"max" in run){
run.ymax=run.max;
}
return this;
},removeSeries:function(_19){
if(_19 in this.runs){
var _1a=this.runs[_19],_1b=this.series[_1a].plot;
delete this.runs[_19];
this.series[_1a].destroy();
this.series.splice(_1a,1);
df.forIn(this.runs,function(idx,_1c,_1d){
if(idx>_1a){
_1d[_1c]=idx-1;
}
});
this.dirty=true;
}
return this;
},updateSeries:function(_1e,_1f){
if(_1e in this.runs){
var run=this.series[this.runs[_1e]];
run.data=_1f;
run.dirty=true;
this._invalidateDependentPlots(run.plot,false);
this._invalidateDependentPlots(run.plot,true);
}
return this;
},resize:function(_20,_21){
var box;
switch(arguments.length){
case 0:
box=dojo.marginBox(this.node);
break;
case 1:
box=_20;
break;
default:
box={w:_20,h:_21};
break;
}
dojo.marginBox(this.node,box);
this.surface.setDimensions(box.w,box.h);
this.dirty=true;
this.coords=null;
return this.render();
},getGeometry:function(){
var ret={};
df.forIn(this.axes,function(_22){
if(_22.initialized()){
ret[_22.name]={name:_22.name,vertical:_22.vertical,scaler:_22.scaler,ticks:_22.ticks};
}
});
return ret;
},setAxisWindow:function(_23,_24,_25,_26){
var _27=this.axes[_23];
if(_27){
_27.setWindow(_24,_25);
dojo.forEach(this.stack,function(_28){
if(_28.hAxis==_23||_28.vAxis==_23){
_28.zoom=_26;
}
});
}
return this;
},setWindow:function(sx,sy,dx,dy,_29){
if(!("plotArea" in this)){
this.calculateGeometry();
}
df.forIn(this.axes,function(_2a){
var _2b,_2c,_2d=_2a.getScaler().bounds,s=_2d.span/(_2d.upper-_2d.lower);
if(_2a.vertical){
_2b=sy;
_2c=dy/s/_2b;
}else{
_2b=sx;
_2c=dx/s/_2b;
}
_2a.setWindow(_2b,_2c);
});
dojo.forEach(this.stack,function(_2e){
_2e.zoom=_29;
});
return this;
},zoomIn:function(_2f,_30){
var _31=this.axes[_2f];
if(_31){
var _32,_33,_34=_31.getScaler().bounds;
var _35=Math.min(_30[0],_30[1]);
var _36=Math.max(_30[0],_30[1]);
_35=_30[0]<_34.lower?_34.lower:_35;
_36=_30[1]>_34.upper?_34.upper:_36;
_32=(_34.upper-_34.lower)/(_36-_35);
_33=_35-_34.lower;
this.setAxisWindow(_2f,_32,_33);
this.render();
}
},calculateGeometry:function(){
if(this.dirty){
return this.fullGeometry();
}
dojo.forEach(this.stack,function(_37){
if(_37.dirty||(_37.hAxis&&this.axes[_37.hAxis].dirty)||(_37.vAxis&&this.axes[_37.vAxis].dirty)){
_37.calculateAxes(this.plotArea);
}
},this);
return this;
},fullGeometry:function(){
this._makeDirty();
dojo.forEach(this.stack,_1);
if(!this.theme){
this.setTheme(new dojox.charting.Theme(dojox.charting._def));
}
dojo.forEach(this.series,function(run){
if(!(run.plot in this.plots)){
var _38=new dc.plot2d.Default(this,{});
_38.name=run.plot;
this.plots[run.plot]=this.stack.length;
this.stack.push(_38);
}
this.stack[this.plots[run.plot]].addSeries(run);
},this);
dojo.forEach(this.stack,function(_39){
if(_39.hAxis){
_39.setAxis(this.axes[_39.hAxis]);
}
if(_39.vAxis){
_39.setAxis(this.axes[_39.vAxis]);
}
},this);
var dim=this.dim=this.surface.getDimensions();
dim.width=dojox.gfx.normalizedLength(dim.width);
dim.height=dojox.gfx.normalizedLength(dim.height);
df.forIn(this.axes,_1);
dojo.forEach(this.stack,function(p){
p.calculateAxes(dim);
});
var _3a=this.offsets={l:0,r:0,t:0,b:0};
df.forIn(this.axes,function(_3b){
df.forIn(_3b.getOffsets(),function(o,i){
_3a[i]+=o;
});
});
df.forIn(this.margins,function(o,i){
_3a[i]+=o;
});
this.plotArea={width:dim.width-_3a.l-_3a.r,height:dim.height-_3a.t-_3a.b};
df.forIn(this.axes,_1);
dojo.forEach(this.stack,function(_3c){
_3c.calculateAxes(this.plotArea);
},this);
return this;
},render:function(){
if(this.theme){
this.theme.clear();
}
if(this.dirty){
return this.fullRender();
}
this.calculateGeometry();
df.forEachRev(this.stack,function(_3d){
_3d.render(this.dim,this.offsets);
},this);
df.forIn(this.axes,function(_3e){
_3e.render(this.dim,this.offsets);
},this);
this._makeClean();
if(this.surface.render){
this.surface.render();
}
return this;
},fullRender:function(){
this.fullGeometry();
var _3f=this.offsets,dim=this.dim;
dojo.forEach(this.series,_2);
df.forIn(this.axes,_2);
dojo.forEach(this.stack,_2);
this.surface.clear();
var t=this.theme,_40=t.plotarea&&t.plotarea.fill,_41=t.plotarea&&t.plotarea.stroke;
if(_40){
this.surface.createRect({x:_3f.l-1,y:_3f.t-1,width:dim.width-_3f.l-_3f.r+2,height:dim.height-_3f.t-_3f.b+2}).setFill(_40);
}
if(_41){
this.surface.createRect({x:_3f.l,y:_3f.t,width:dim.width-_3f.l-_3f.r+1,height:dim.height-_3f.t-_3f.b+1}).setStroke(_41);
}
df.foldr(this.stack,function(z,_42){
return _42.render(dim,_3f),0;
},0);
_40=this.fill!==undefined?this.fill:(t.chart&&t.chart.fill);
_41=this.stroke!==undefined?this.stroke:(t.chart&&t.chart.stroke);
if(_40=="inherit"){
var _43=this.node,_40=new dojo.Color(dojo.style(_43,"backgroundColor"));
while(_40.a==0&&_43!=document.documentElement){
_40=new dojo.Color(dojo.style(_43,"backgroundColor"));
_43=_43.parentNode;
}
}
if(_40){
if(_3f.l){
this.surface.createRect({width:_3f.l,height:dim.height+1}).setFill(_40);
}
if(_3f.r){
this.surface.createRect({x:dim.width-_3f.r,width:_3f.r+1,height:dim.height+2}).setFill(_40);
}
if(_3f.t){
this.surface.createRect({width:dim.width+1,height:_3f.t}).setFill(_40);
}
if(_3f.b){
this.surface.createRect({y:dim.height-_3f.b,width:dim.width+1,height:_3f.b+2}).setFill(_40);
}
}
if(_41){
this.surface.createRect({width:dim.width-1,height:dim.height-1}).setStroke(_41);
}
df.forIn(this.axes,function(_44){
_44.render(dim,_3f);
});
this._makeClean();
if(this.surface.render){
this.surface.render();
}
return this;
},connectToPlot:function(_45,_46,_47){
return _45 in this.plots?this.stack[this.plots[_45]].connect(_46,_47):null;
},_makeClean:function(){
dojo.forEach(this.axes,_4);
dojo.forEach(this.stack,_4);
dojo.forEach(this.series,_4);
this.dirty=false;
},_makeDirty:function(){
dojo.forEach(this.axes,_5);
dojo.forEach(this.stack,_5);
dojo.forEach(this.series,_5);
this.dirty=true;
},_invalidateDependentPlots:function(_48,_49){
if(_48 in this.plots){
var _4a=this.stack[this.plots[_48]],_4b,_4c=_49?"vAxis":"hAxis";
if(_4a[_4c]){
_4b=this.axes[_4a[_4c]];
if(_4b&&_4b.dependOnData()){
_4b.dirty=true;
dojo.forEach(this.stack,function(p){
if(p[_4c]&&p[_4c]==_4a[_4c]){
p.dirty=true;
}
});
}
}else{
_4a.dirty=true;
}
}
}});
})();
}
