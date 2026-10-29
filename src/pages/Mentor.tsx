import { useState } from 'react'
import { useDemo } from '../state/DemoProvider'

const STARTERS = [
  'Explain AND like I am in first year',
  'Hint for XOR, not the answer',
  'How should I viva a streetlight?',
]

export function Mentor() {
  const { state } = useDemo()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'explain' | 'hint' | 'viva'>('explain')
  const [log, setLog] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: `Hi ${state.displayName.split(' ')[0]}. I’m a scripted study partner, not a live model. I will not claim I opened your files or probed hardware. Please verify safety and exam answers.`,
    },
  ])

  const send = (text: string) => {
    const t = text.trim()
    if (!t) return
    setLog((l) => [...l, { role: 'user', text: t }, { role: 'ai', text: reply(t, mode) }])
    setInput('')
  }

  return (
    <div>
      <h1>AI Learning Assistant</h1>
      <p>
        Progressive hints beat spoilers. Quiz generation needs a real model — this screen uses templates only.
      </p>
      <div className="flow" role="tablist">
        {(['explain', 'hint', 'viva'] as const).map((m) => (
          <button key={m} className={`btn ${mode === m ? '' : 'secondary'}`} type="button" onClick={() => setMode(m)}>
            {m === 'explain' ? 'Explain' : m === 'hint' ? 'Hint mode' : 'Viva practice'}
          </button>
        ))}
      </div>
      <div className="chat card">
        {log.map((m, i) => (
          <div key={i} className={`bubble ${m.role === 'user' ? 'user' : 'ai'}`}>
            {m.role === 'ai' && <span className="tag amber">Demo AI response</span>} {m.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '12px 0' }}>
        {STARTERS.map((s) => (
          <button key={s} className="btn secondary" type="button" onClick={() => send(s)}>
            {s}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        style={{ display: 'flex', gap: 8 }}
      >
        <label className="sr-only" htmlFor="ask">
          Ask the mentor
        </label>
        <input id="ask" style={{ flex: 1 }} value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="btn" type="submit">
          Send
        </button>
      </form>
    </div>
  )
}

function reply(q: string, mode: 'explain' | 'hint' | 'viva') {
  const s = q.toLowerCase()
  if (mode === 'viva') {
    return 'Demo viva: Explain your streetlight tests out loud — night, dusk, indoor, noon. What fails if the threshold is 80? I cannot grade a real oral.'
  }
  if (s.includes('and') && mode === 'explain') {
    return 'AND is the strict teammate: every input must be 1. Draw 00,01,10,11. Only 11 is 1. If your lamp lights on 10, you wired OR or you inverted something.'
  }
  if (s.includes('xor')) {
    return mode === 'hint'
      ? 'Hint: look at the 11 row. Does your gate still output 1? If yes, you are holding OR in your head.'
      : 'XOR is 1 when bits differ. 11 is 0. People mix it with OR because both like 01 and 10.'
  }
  if (s.includes('hint')) {
    return 'Try the second input before you redesign the whole net. Then compare expected vs actual in the lab table.'
  }
  return 'Demo AI: I matched almost nothing. Name the gate or the mission. I will not invent a file inspection or a SPICE run.'
}
