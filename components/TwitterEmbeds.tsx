'use client'

import { onMount } from '@barefootjs/client'

declare global {
  interface Window {
    twttr?: { widgets?: { load: (el?: HTMLElement) => void } }
  }
}

// A <blockquote class="twitter-tweet"> from dangerouslySetInnerHTML
// markdown never runs its own embedded <script> (browsers don't execute
// script tags injected via innerHTML), and widgets.js — loaded once,
// globally, in renderer.tsx — only auto-scans the DOM on its own load.
// This re-triggers that scan on every mount, i.e. every client-side
// navigation into a page with tweet embeds, once widgets.js is already
// loaded from an earlier page.
export function TwitterEmbeds() {
  onMount(() => {
    window.twttr?.widgets?.load()
  })
  return <></>
}
