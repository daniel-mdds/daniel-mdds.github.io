/* Mini-runtime: renderiza o template da página e mantém o estado (idioma, progresso). */
class DCLogic{constructor(){this.props={mobile:false};this.state={}}setState(o){Object.assign(this.state,o);if(window.__dmSched)window.__dmSched()}}

function dmMount(){
var T=document.getElementById('dm-tpl').innerHTML, app=document.getElementById('app');
function esc(v){return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function get(o,p){return p.split('.').reduce(function(a,k){return a==null?a:a[k]},o)}
function build(vals){
  var h=T.replace(/<sc-for list="\{\{(\w+)\}\}" as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g,function(_,l,as,inner){
    return (vals[l]||[]).map(function(it){var o={};o[as]=it;return inner.replace(/\{\{([\w.]+)\}\}/g,function(m,p){var v=get(o,p);return v==null?m:esc(v)})}).join('')});
  return h.replace(/\{\{([\w.]+)\}\}/g,function(_,p){var v=get(vals,p);return v==null?'':esc(v)});
}
function morph(a,b){
  if(a.nodeType!==b.nodeType||a.nodeName!==b.nodeName||a.childNodes.length!==b.childNodes.length){a.replaceWith(b.cloneNode(true));return}
  if(a.nodeType===3||a.nodeType===8){if(a.nodeValue!==b.nodeValue)a.nodeValue=b.nodeValue;return}
  if(a.nodeType===1){
    Array.prototype.slice.call(b.attributes).forEach(function(at){if(a.getAttribute(at.name)!==at.value)a.setAttribute(at.name,at.value)});
    Array.prototype.slice.call(a.attributes).forEach(function(at){if(!b.hasAttribute(at.name))a.removeAttribute(at.name)});
  }
  for(var i=0;i<a.childNodes.length;i++)morph(a.childNodes[i],b.childNodes[i]);
}
var comp=new Component(), first=true, pending=false;
if(typeof dmGetLang==='function'){comp.state.lang=dmGetLang();if(typeof dmSetDocLang==='function')dmSetDocLang(comp.state.lang)}
function render(){
  pending=false;
  var html=build(comp.renderVals());
  if(first){app.innerHTML=html;first=false;return}
  var d=document.createElement('div');d.innerHTML=html;
  for(var i=0;i<app.childNodes.length;i++)morph(app.childNodes[i],d.childNodes[i]);
}
window.__dmSched=function(){if(!pending){pending=true;requestAnimationFrame(render)}};
render();
if(comp.componentDidMount)comp.componentDidMount();
}
document.addEventListener('DOMContentLoaded',dmMount);
