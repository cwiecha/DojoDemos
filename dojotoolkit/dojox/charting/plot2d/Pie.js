/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.plot2d.Pie"]){
dojo._hasResource["dojox.charting.plot2d.Pie"]=true;
dojo.provide("dojox.charting.plot2d.Pie");
dojo.require("dojox.charting.Element");
dojo.require("dojox.charting.axis2d.common");
dojo.require("dojox.charting.plot2d.common");
dojo.require("dojox.lang.functional");
dojo.require("dojox.lang.utils");
dojo.require("dojox.gfx");
dojo.require("dojo.number");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,da=dojox.charting.axis2d.common,g=dojox.gfx,m=g.matrix,_1=0.2;
dojo.declare("dojox.charting.plot2d.Pie",dojox.charting.Element,{defaultParams:{labels:true,ticks:false,fixed:true,precision:1,labelOffset:20,labelStyle:"default",htmlLabels:true,radGrad:"native",fanSize:5,startAngle:0},optionalParams:{radius:0,stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:""},constructor:function(_2,_3){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_3);
du.updateWithPattern(this.opt,_3,this.optionalParams);
this.run=null;
this.dyn=[];
},destroy:function(){
this.resetEvents();
this.inherited(arguments);
},clear:function(){
this.dirty=true;
this.dyn=[];
this.run=null;
return this;
},setAxis:function(_4){
return this;
},addSeries:function(_5){
this.run=_5;
return this;
},calculateAxes:function(_6){
return this;
},getRequiredColors:function(){
return this.run?this.run.data.length:0;
},plotEvent:function(o){
},connect:function(_7,_8){
this.dirty=true;
return dojo.connect(this,"plotEvent",_7,_8);
},events:function(){
var ls=this.plotEvent._listeners;
if(!ls||!ls.length){
return false;
}
for(var i in ls){
if(!(i in Array.prototype)){
return true;
}
}
return false;
},resetEvents:function(){
this.plotEvent({type:"onplotreset",plot:this});
},_connectEvents:function(_9,o){
_9.connect("onmouseover",this,function(e){
o.type="onmouseover";
o.event=e;
this.plotEvent(o);
});
_9.connect("onmouseout",this,function(e){
o.type="onmouseout";
o.event=e;
this.plotEvent(o);
});
_9.connect("onclick",this,function(e){
o.type="onclick";
o.event=e;
this.plotEvent(o);
});
},render:function(_a,_b){
if(!this.dirty){
return this;
}
this.dirty=false;
this.cleanGroup();
var s=this.group,t=this.chart.theme;
this.resetEvents();
if(!this.run||!this.run.data.length){
return this;
}
var rx=(_a.width-_b.l-_b.r)/2,ry=(_a.height-_b.t-_b.b)/2,r=Math.min(rx,ry),_c="font" in this.opt?this.opt.font:t.axis.font,_d=_c?g.normalizedLength(g.splitFontString(_c).size):0,_e="fontColor" in this.opt?this.opt.fontColor:t.axis.fontColor,_f=m._degToRad(this.opt.startAngle),_10=_f,_11,_12,_13,_14,_15,_16,run=this.run.data,_17=this.events();
if(typeof run[0]=="number"){
_12=df.map(run,"x ? Math.max(x, 0) : 0");
if(df.every(_12,"<= 0")){
return this;
}
_13=df.map(_12,"/this",df.foldl(_12,"+",0));
if(this.opt.labels){
_14=dojo.map(_13,function(x){
return x>0?this._getLabel(x*100)+"%":"";
},this);
}
}else{
_12=df.map(run,"x ? Math.max(x.y, 0) : 0");
if(df.every(_12,"<= 0")){
return this;
}
_13=df.map(_12,"/this",df.foldl(_12,"+",0));
if(this.opt.labels){
_14=dojo.map(_13,function(x,i){
if(x<=0){
return "";
}
var v=run[i];
return "text" in v?v.text:this._getLabel(x*100)+"%";
},this);
}
}
var _18=df.map(run,function(v,i){
if(v===null||typeof v=="number"){
return t.next("slice",[this.opt,this.run],true);
}
return t.next("slice",[this.opt,this.run,v],true);
},this);
if(this.opt.labels){
_15=df.foldl1(df.map(_14,function(_19,i){
var _1a=_18[i].series.font;
return dojox.gfx._base._getTextBox(_19,{font:_1a}).w;
},this),"Math.max(a, b)")/2;
if(this.opt.labelOffset<0){
r=Math.min(rx-2*_15,ry-_d)+this.opt.labelOffset;
}
_16=r-this.opt.labelOffset;
}
if("radius" in this.opt){
r=this.opt.radius;
_16=r-this.opt.labelOffset;
}
var _1b={cx:_b.l+rx,cy:_b.t+ry,r:r};
this.dyn=[];
dojo.some(_13,function(_1c,i){
if(_1c<=0){
return false;
}
var v=run[i],_1d=_18[i],_1e;
if(_1c>=1){
_1e=this._plotFill(_1d.series.fill,_a,_b);
_1e=this._shapeFill(_1e,{x:_1b.cx-_1b.r,y:_1b.cy-_1b.r,width:2*_1b.r,height:2*_1b.r});
_1e=this._pseudoRadialFill(_1e,{x:_1b.cx,y:_1b.cy},_1b.r);
var _1f=s.createCircle(_1b).setFill(_1e).setStroke(_1d.series.stroke);
this.dyn.push({fill:_1e,stroke:_1d.series.stroke});
if(_17){
var o={element:"slice",index:i,run:this.run,plot:this,shape:_1f,x:i,y:typeof v=="number"?v:v.y,cx:_1b.cx,cy:_1b.cy,cr:r};
this._connectEvents(_1f,o);
}
return true;
}
var end=_10+_1c*2*Math.PI;
if(i+1==_13.length){
end=_f+2*Math.PI;
}
var _20=end-_10,x1=_1b.cx+r*Math.cos(_10),y1=_1b.cy+r*Math.sin(_10),x2=_1b.cx+r*Math.cos(end),y2=_1b.cy+r*Math.sin(end);
var _21=m._degToRad(this.opt.fanSize);
if(_1d.series.fill&&_1d.series.fill.type==="radial"&&this.opt.radGrad==="fan"&&_20>_21){
var _22=s.createGroup(),_23=Math.ceil(_20/_21),_24=_20/_23;
_1e=this._shapeFill(_1d.series.fill,{x:_1b.cx-_1b.r,y:_1b.cy-_1b.r,width:2*_1b.r,height:2*_1b.r});
for(var j=0;j<_23;++j){
var _25=j==0?x1:_1b.cx+r*Math.cos(_10+(j-_1)*_24),_26=j==0?y1:_1b.cy+r*Math.sin(_10+(j-_1)*_24),_27=j==_23-1?x2:_1b.cx+r*Math.cos(_10+(j+1+_1)*_24),_28=j==_23-1?y2:_1b.cy+r*Math.sin(_10+(j+1+_1)*_24),fan=_22.createPath({}).moveTo(_1b.cx,_1b.cy).lineTo(_25,_26).arcTo(r,r,0,_24>Math.PI,true,_27,_28).lineTo(_1b.cx,_1b.cy).closePath().setFill(this._pseudoRadialFill(_1e,{x:_1b.cx,y:_1b.cy},r,_10+(j+0.5)*_24,_10+(j+0.5)*_24));
}
_22.createPath({}).moveTo(_1b.cx,_1b.cy).lineTo(x1,y1).arcTo(r,r,0,_20>Math.PI,true,x2,y2).lineTo(_1b.cx,_1b.cy).closePath().setStroke(_1d.series.stroke);
_1f=_22;
}else{
_1f=s.createPath({}).moveTo(_1b.cx,_1b.cy).lineTo(x1,y1).arcTo(r,r,0,_20>Math.PI,true,x2,y2).lineTo(_1b.cx,_1b.cy).closePath().setStroke(_1d.series.stroke);
var _1e=_1d.series.fill;
if(_1e&&_1e.type==="radial"){
_1e=this._shapeFill(_1e,{x:_1b.cx-_1b.r,y:_1b.cy-_1b.r,width:2*_1b.r,height:2*_1b.r});
if(this.opt.radGrad==="linear"){
_1e=this._pseudoRadialFill(_1e,{x:_1b.cx,y:_1b.cy},r,_10,end);
}
}else{
if(_1e&&_1e.type==="linear"){
_1e=this._plotFill(_1e,_a,_b);
_1e=this._shapeFill(_1e,_1f.getBoundingBox());
}
}
_1f.setFill(_1e);
}
this.dyn.push({fill:_1e,stroke:_1d.series.stroke});
if(_17){
var o={element:"slice",index:i,run:this.run,plot:this,shape:_1f,x:i,y:typeof v=="number"?v:v.y,cx:_1b.cx,cy:_1b.cy,cr:r};
this._connectEvents(_1f,o);
}
_10=end;
return false;
},this);
if(this.opt.labels){
_10=_f;
dojo.some(_13,function(_29,i){
if(_29<=0){
return false;
}
var _2a=_18[i];
if(_29>=1){
var v=run[i],_2b=da.createText[this.opt.htmlLabels&&dojox.gfx.renderer!="vml"?"html":"gfx"](this.chart,s,_1b.cx,_1b.cy+_d/2,"middle",_14[i],_2a.series.font,_2a.series.fontColor);
if(this.opt.htmlLabels){
this.htmlElements.push(_2b);
}
return true;
}
var end=_10+_29*2*Math.PI,v=run[i];
if(i+1==_13.length){
end=_f+2*Math.PI;
}
var _2c=(_10+end)/2,x=_1b.cx+_16*Math.cos(_2c),y=_1b.cy+_16*Math.sin(_2c)+_d/2;
var _2b=da.createText[this.opt.htmlLabels&&dojox.gfx.renderer!="vml"?"html":"gfx"](this.chart,s,x,y,"middle",_14[i],_2a.series.font,_2a.series.fontColor);
if(this.opt.htmlLabels){
this.htmlElements.push(_2b);
}
_10=end;
return false;
},this);
}
return this;
},_getLabel:function(_2d){
return this.opt.fixed?dojo.number.format(_2d,{places:this.opt.precision}):_2d.toString();
}});
})();
}
