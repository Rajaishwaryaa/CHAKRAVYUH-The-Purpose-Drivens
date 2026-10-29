import { type ReactNode, useEffect, useId, useRef } from 'react'

export function DemoTag({ children }: { children?: ReactNode }) {
  return <span className="tag amber">{children ?? 'Demo data'}</span>
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  )
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const headingId = useId()
  useEffect(() => {
    const node = ref.current
    const prev = document.activeElement as HTMLElement | null
    const focusables = () =>
      node?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    focusables()?.[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !node) return
      const list = [...(focusables() ?? [])]
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prev?.focus()
    }
  }, [onClose])
  return (
    <div className="modal-back" onClick={onClose}>
      <div
        className="card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 480, width: '100%' }}
      >
        <h2 id={headingId}>{title}</h2>
        {children}
      </div>
    </div>
  )
}

export function Bit({ v }: { v: boolean | null | undefined }) {
  if (v == null) return <span className="tag locked">—</span>
  return <span className={v ? 'tag ok' : 'tag'}>{v ? '1' : '0'}</span>
}
