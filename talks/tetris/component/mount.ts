import { render } from '@barefootjs/client/runtime'
import './components/Tetris.tsx'

function tryMount() {
  const container = document.getElementById('tetris-root') as HTMLElement | null
  if (container && !container.dataset.mounted) {
    container.dataset.mounted = '1'
    render(container, 'Tetris')
  }
}

new MutationObserver(tryMount).observe(document.documentElement, { childList: true, subtree: true })
tryMount()
