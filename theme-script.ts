// Runs synchronously in <head>, before <body> renders, so the page never
// paints in the wrong theme and then flips — the flip is what showed up as
// a "fade" from dark to light. script.js (deferred, runs after body parses)
// only wires up the toggle button; it never decides the initial theme.
export const themeInitScript = `(function(){
  var t=null;
  try{t=localStorage.getItem('theme')}catch(e){}
  if(t!=='dark'&&t!=='light'){
    t=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':null
  }
  if(t){document.documentElement.setAttribute('data-theme',t)}
})()`
