var DM_PAL = [
  { bg: '#FFFFFF', hdr: 'rgba(255,255,255,0.92)', ink: '#11151C', muted: '#4A5363', accent: '#2747C9', line: '#DDE2EA' },
  { bg: '#FFFFFF', hdr: 'rgba(255,255,255,0.92)', ink: '#11151C', muted: '#4A5363', accent: '#2747C9', line: '#DDE2EA' },
  { bg: '#FFFFFF', hdr: 'rgba(255,255,255,0.92)', ink: '#11151C', muted: '#4A5363', accent: '#2747C9', line: '#DDE2EA' },
  { bg: '#FFFFFF', hdr: 'rgba(255,255,255,0.92)', ink: '#11151C', muted: '#4A5363', accent: '#2747C9', line: '#DDE2EA' },
  { bg: '#FFFFFF', hdr: 'rgba(255,255,255,0.92)', ink: '#11151C', muted: '#4A5363', accent: '#2747C9', line: '#DDE2EA' },
  { bg: '#FFFFFF', hdr: 'rgba(255,255,255,0.92)', ink: '#11151C', muted: '#4A5363', accent: '#2747C9', line: '#DDE2EA' },
  { bg: '#FFFFFF', hdr: 'rgba(255,255,255,0.92)', ink: '#11151C', muted: '#4A5363', accent: '#2747C9', line: '#DDE2EA' },
  { bg: '#FFFFFF', hdr: 'rgba(255,255,255,0.92)', ink: '#11151C', muted: '#4A5363', accent: '#2747C9', line: '#DDE2EA' },
  { bg: '#FFFFFF', hdr: 'rgba(255,255,255,0.92)', ink: '#11151C', muted: '#4A5363', accent: '#2747C9', line: '#DDE2EA' }
];
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
var DM_STEPS = [
  { id: 'cap-hoje', year: 'Hoje', yearEn: 'Today', label: 'Product Owner', labelEn: 'Product Owner' },
  { id: 'cap-anima', year: '2022', label: 'UX Designer na Ânima', labelEn: 'UX Designer at Ânima' },
  { id: 'cap-mba', year: '2021', label: 'MBA em UX', labelEn: 'MBA in UX' },
  { id: 'cap-fiocruz', year: '2014', label: 'Designer na Fiocruz', labelEn: 'Designer at Fiocruz' },
  { id: 'cap-uff', year: '2014', label: 'Processos Gerenciais', labelEn: 'Management Processes' },
  { id: 'cap-web', year: '2013', label: 'HTML5 e CSS3', labelEn: 'HTML5 and CSS3' },
  { id: 'cap-cinema', year: '2009', label: 'Designer no cinema', labelEn: 'Designer in cinema' },
  { id: 'cap-inicio', year: '2004', label: 'O começo', labelEn: 'The beginning' }
];
class Component extends DCLogic {
  componentDidMount() {
    this._onScroll = (e) => this.track(e);
    this._onClick = (e) => this.jump(e);
    document.addEventListener('click', this._onClick, true);
    document.addEventListener('scroll', this._onScroll, true);
    window.addEventListener('resize', this._onScroll);
    dmLangMount(this);
    this.track();
  }
  componentWillUnmount() {
    document.removeEventListener('click', this._onClick, true);
    document.removeEventListener('scroll', this._onScroll, true);
    dmLangUnmount(this);
    window.removeEventListener('resize', this._onScroll);
  }
  jump(e) {
    // Âncoras internas (#cap-..., #inicio): rola o contêiner certo, inclusive o scroller interno do mobile.
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var root = a.closest('.dm-root') || document;
    var el = id && root.querySelector('[id="' + id + '"]');
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    var sc = el.parentElement;
    while (sc && sc !== document.body && sc !== document.documentElement) {
      var oy = getComputedStyle(sc).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && sc.scrollHeight > sc.clientHeight) break;
      sc = sc.parentElement;
    }
    var top;
    if (id === 'inicio') top = 0;
    if (sc && sc !== document.body && sc !== document.documentElement) {
      if (top === undefined) top = sc.scrollTop + el.getBoundingClientRect().top - sc.getBoundingClientRect().top;
      sc.scrollTo({ top: top, behavior: 'smooth' });
    } else {
      if (top === undefined) top = window.scrollY + el.getBoundingClientRect().top - 72;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  }
  track(e) {
    var t = e && e.target && e.target.nodeType === 1 ? e.target : null;
    var box = t ? t.getBoundingClientRect() : { top: 0, height: window.innerHeight };
    var mark = box.top + box.height * 0.4;
    var secs = Array.prototype.slice.call(document.querySelectorAll('[data-chapter]'));
    if (!secs.length) return;
    var active = 0;
    secs.forEach(function (s) { if (s.getBoundingClientRect().top <= mark) active = Number(s.getAttribute('data-chapter')); });
    // Preenchimento por trecho: cada intervalo entre dois pontos avança conforme os pixels da sua própria sessão.
    var segs = secs.length - 1;
    var p = 0;
    if (segs > 0) {
      var i = Math.min(active, segs);
      if (i >= segs) {
        p = 100;
      } else {
        var a = secs[i].getBoundingClientRect().top;
        var b = secs[i + 1].getBoundingClientRect().top;
        var frac = Math.max(0, Math.min(1, (mark - a) / Math.max(1, b - a)));
        if (i === 0 && mark < a) frac = 0;
        p = Math.round((i + frac) / segs * 1000) / 10;
      }
    }
    var s = this.state || {};
    if (s.active !== active || s.progress !== p) this.setState({ active: active, progress: p });
  }
  renderVals() {
    var m = !!this.props.mobile;
    var links = {
      home: m ? 'index.html' : 'index.html',
      bio: m ? 'biografia.html' : 'biografia.html',
      exp: m ? 'experiencia.html' : 'experiencia.html',
      form: m ? 'formacao.html' : 'formacao.html'
    };
    var s = this.state || {};
    var L = dmLangVals(s.lang);
    var en = s.lang === 'en';
    var Y = function (st) { return en && st.yearEn ? st.yearEn : st.year; };
    var T = function (st) { return en ? st.labelEn : st.label; };
    var n = DM_STEPS.length;
    var active = Math.min(s.active || 0, n - 1);
    var pal = DM_PAL[0];
    var prog = s.progress || 0;
    var steps = DM_STEPS.map(function (st, i) {
      var done = i < active;
      var on = i === active;
      return {
        href: '#' + st.id,
        year: Y(st),
        label: T(st),
        aria: Y(st) + ': ' + T(st),
        ring: done || on ? pal.accent : pal.line,
        fill: done ? pal.accent : pal.bg,
        weight: on ? 800 : 500,
        yearColor: on ? pal.accent : pal.muted,
        labelColor: on ? pal.ink : pal.muted
      };
    });
    var hsteps = DM_STEPS.map(function (st, i) {
      var on = i === active;
      var older = i > active;
      return {
        href: '#' + st.id,
        aria: Y(st) + ': ' + T(st),
        size: on ? '16px' : '12px',
        ring: on || older ? pal.accent : '#C9D0DC',
        fill: older ? pal.accent : '#FFFFFF'
      };
    }).reverse();
    var j = n - 1 - active;
    var hl = {
      text: Y(DM_STEPS[active]) + ' · ' + T(DM_STEPS[active]),
      left: j <= 1 ? '0%' : (j >= n - 2 ? '100%' : ((j + 0.5) / n * 100).toFixed(2) + '%'),
      tx: j <= 1 ? 'translateX(0)' : (j >= n - 2 ? 'translateX(-100%)' : 'translateX(-50%)')
    };
    var span = 100 - 100 / n;
    return {
      langCls: L.langCls,
      lp: L.lp,
      tx: L.tx,
      links: links,
      year: new Date().getFullYear(),
      shell: m ? 'height: 844px; display: flex; flex-direction: column; overflow: hidden' : '',
      scroll: m ? 'flex: 1 1 auto; min-height: 0; width: 100%; overflow-y: auto' : '',
      pal: pal,
      steps: steps,
      progress: prog + '%',
      progf: (prog / 100).toFixed(4),
      hsteps: hsteps,
      hl: hl,
      hstart: (50 / n).toFixed(2) + '%',
      hfill: (span * (1 - prog / 100)).toFixed(2) + '%'
    };
  }
}
