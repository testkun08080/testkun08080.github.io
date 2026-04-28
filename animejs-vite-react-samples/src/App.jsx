import { useEffect, useState } from 'react'
import { set } from 'animejs'
import './App.css'

const animationItems = [
  { id: 'anim-01', label: '01 Fade In' },
  { id: 'anim-02', label: '02 Slide Up' },
  { id: 'anim-03', label: '03 Pop Scale' },
  { id: 'anim-04', label: '04 Letter Stagger' },
  { id: 'anim-05', label: '05 Rotate In' },
  { id: 'anim-06', label: '06 Wave Loop' },
  { id: 'anim-07', label: '07 Pulse Loop' },
  { id: 'anim-08', label: '08 Color Shift' },
  { id: 'anim-09', label: '09 Tracking In' },
  { id: 'anim-10', label: '10 Scroll Linked' },
]

function App() {
  const [debug, setDebug] = useState({
    scrollY: 0,
    maxScroll: 0,
    progress: 0,
    activeDemo: 1,
  })

  useEffect(() => {
    const handleScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      const clamped = Math.min(Math.max(progress, 0), 1)

      set('.anim-01 .sample', { opacity: clamped, y: (1 - clamped) * 28 })
      set('.anim-02 .sample', { y: 36 - clamped * 36, opacity: clamped })
      set('.anim-03 .sample', { scale: 0.72 + clamped * 0.28, opacity: clamped })
      set('.anim-04 .sample', { x: (clamped - 0.5) * 120, letterSpacing: `${clamped * 0.2}em` })
      set('.anim-05 .sample', { rotate: -12 + clamped * 12, opacity: clamped })
      set('.anim-06 .sample', { x: Math.sin(clamped * Math.PI * 10) * 18 })
      set('.anim-07 .sample', { scale: 1 + Math.sin(clamped * Math.PI * 12) * 0.08 })
      set('.anim-08 .sample', { color: clamped < 0.5 ? '#2563eb' : '#7c3aed' })
      set('.anim-09 .sample', { letterSpacing: `${0.02 + clamped * 0.22}em`, opacity: clamped })
      set('.anim-10-bar', { scaleX: clamped })
      set('.anim-10 .sample', { x: clamped * 120 })

      const activeDemo = Math.min(10, Math.max(1, Math.ceil(clamped * 10)))
      setDebug({
        scrollY: Math.round(window.scrollY),
        maxScroll: Math.max(0, Math.round(max)),
        progress: clamped,
        activeDemo,
      })
    }

    handleScroll()
    const previousOnScroll = window.onscroll
    window.onscroll = handleScroll
    return () => {
      window.onscroll = previousOnScroll
    }
  }, [])

  return (
    <main className="container">
      <h1>Vite + React + animejs (Simple 10 Samples)</h1>
      <p className="sub">
        1ページで10個のアニメーションを確認できます。すべてスクロール連動です。
      </p>
      <aside className="debug-panel">
        <strong>Debug (onscroll)</strong>
        <span>scrollY: {debug.scrollY}px</span>
        <span>maxScroll: {debug.maxScroll}px</span>
        <span>progress: {debug.progress.toFixed(3)}</span>
        <span>activeDemo: {debug.activeDemo}/10</span>
      </aside>
      <div className="grid">
        {animationItems.map((item) => (
          <section key={item.id} className={`card ${item.id}`}>
            {item.id === 'anim-10' ? (
              <>
                <h2>{item.label}</h2>
                <p className="sample">Scroll Linked</p>
                <div className="anim-10-track">
                  <div className="anim-10-bar" />
                </div>
                <p className="scroll-note">スクロールでバーとテキストが進みます。</p>
              </>
            ) : (
              <>
                <h2>{item.label}</h2>
                <p className="sample">{item.label.replace(/^\d+\s/, '')}</p>
              </>
            )}
          </section>
        ))}
      </div>
      <div className="spacer" />
    </main>
  )
}

export default App
