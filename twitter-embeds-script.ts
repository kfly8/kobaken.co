// A <blockquote class="twitter-tweet"> from dangerouslySetInnerHTML
// markdown never runs its own embedded <script> (browsers don't execute
// script tags injected via innerHTML), and widgets.js — loaded once,
// globally, in renderer.tsx — only auto-scans the DOM on its own load,
// not on a later Router navigation that swaps in a different post's
// content without a full page reload.
//
// This is a plain script (not a BarefootJS component): the router morphs
// the DOM rather than replacing it, so a component whose own output never
// changes has its scope preserved rather than torn down and remounted —
// its onMount only fires once, on the very first page of the session,
// which isn't enough here. A MutationObserver watches the actual DOM
// instead, independent of any component lifecycle.
export const twitterEmbedsScript = `(function(){
  function scan(){ if(window.twttr&&window.twttr.widgets) window.twttr.widgets.load() }
  function start(){
    new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        if(muts[i].addedNodes.length){ scan(); return }
      }
    }).observe(document.body, {childList:true, subtree:true})
  }
  if(document.body) start()
  else document.addEventListener('DOMContentLoaded', start)
})()`
