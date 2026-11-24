function dmGetLang() {
  try { var v = localStorage.getItem('dm-lang'); if (v === 'pt' || v === 'en') return v; } catch (x) {}
  var n = (typeof navigator !== 'undefined' && navigator.language || 'pt').toLowerCase();
  return n.indexOf('pt') === 0 ? 'pt' : 'en';
}
function dmSetDocLang(l) { try { document.documentElement.lang = l === 'en' ? 'en' : 'pt-BR'; } catch (x) {} }
function dmLangMount(c) {
  var l = dmGetLang(); dmSetDocLang(l); c.setState({ lang: l });
  c._onLang = function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-lang]') : null;
    if (!b) return;
    e.preventDefault();
    var v = b.getAttribute('data-lang') === 'en' ? 'en' : 'pt';
    try { localStorage.setItem('dm-lang', v); } catch (x) {}
    dmSetDocLang(v); c.setState({ lang: v });
  };
  c._onStore = function (e) { if (e.key === 'dm-lang' && (e.newValue === 'pt' || e.newValue === 'en')) { dmSetDocLang(e.newValue); c.setState({ lang: e.newValue }); } };
  document.addEventListener('click', c._onLang, true);
  window.addEventListener('storage', c._onStore);
}
function dmLangUnmount(c) {
  document.removeEventListener('click', c._onLang, true);
  window.removeEventListener('storage', c._onStore);
}
function dmLangVals(l) {
  var en = l === 'en';
  return {
    langCls: en ? 'lang-en' : '',
    lp: { pt: en ? 'false' : 'true', en: en ? 'true' : 'false', ptColor: en ? '#4A5363' : '#2747C9', enColor: en ? '#2747C9' : '#4A5363', ptWeight: en ? 500 : 700, enWeight: en ? 700 : 500 },
    tx: en
      ? { lang: 'Language', comp: 'Skills', contact: 'Contact', journey: 'Reverse journey', main: 'Main', collage: 'Collage of early-career promotional work' }
      : { lang: 'Idioma', comp: 'Competências', contact: 'Contato', journey: 'Jornada reversa', main: 'Principal', collage: 'Colagem de trabalhos promocionais do início de carreira' }
  };
}
class Component extends DCLogic {
  componentDidMount() { dmLangMount(this); }
  componentWillUnmount() { dmLangUnmount(this); }
  renderVals() {
    var L = dmLangVals((this.state || {}).lang);
    var m = !!this.props.mobile;
    var links = {
      home: m ? 'index.html' : 'index.html',
      bio: m ? 'biografia.html' : 'biografia.html',
      exp: m ? 'experiencia.html' : 'experiencia.html',
      form: m ? 'formacao.html' : 'formacao.html'
    };
    return {
      langCls: L.langCls,
      lp: L.lp,
      tx: L.tx,
      links: links,
      year: new Date().getFullYear(),
      shell: m ? 'height: 844px; display: flex; flex-direction: column; overflow: hidden' : '',
      scroll: m ? 'flex: 1 1 auto; min-height: 0; width: 100%; overflow-y: auto' : ''
    };
  }
}
