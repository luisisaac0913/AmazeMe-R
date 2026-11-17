const ID_CONTENEDOR_GTM = 'GTM-JDPX665M';
const CLAVE_CONSENTIMIENTO = 'AmazeMe_CookiesAccepted';
let analiticaInicializada = false;

export function tieneConsentimientoAnalitica() {
  try {
    return localStorage.getItem(CLAVE_CONSENTIMIENTO) === 'all';
  } catch {
    return false;
  }
}

export function inicializarAnalitica() {
  if (analiticaInicializada || !tieneConsentimientoAnalitica()) {
    return;
  }

  analiticaInicializada = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  if (!document.getElementById('gtm-script-amazeme')) {
    const script = document.createElement('script');
    script.id = 'gtm-script-amazeme';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${ID_CONTENEDOR_GTM}`;
    document.head.appendChild(script);
  }
}

export function registrarVistaPagina(ruta) {
  if (!tieneConsentimientoAnalitica()) {
    return;
  }

  if (!analiticaInicializada) {
    inicializarAnalitica();
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page_path: ruta,
    page_title: document.title
  });
}

