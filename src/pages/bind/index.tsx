import { createRoot } from 'react-dom/client'
import Bind from './bind';

export default function renderApp() {
  const container = document.getElementById('app')
  if (container) {
    const root = createRoot(container)
    root.render(<Bind />)
  }
}

renderApp()