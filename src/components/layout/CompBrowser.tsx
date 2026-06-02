import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { COMPONENT_REGISTRY, type ComponentId, type ComponentDef } from '@/types'

const GROUP_ICONS: Record<string, string> = {
  P0: '⚡', P1: '🌸', P2: '🏪', P3: '📄', P4: '🎯', P6: '👥',
}

export default function CompBrowser() {
  const { enterComp } = useApp()
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ P0: false, P4: false })

  const toggle = (key: string) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))

  // 搜索过滤
  if (query.trim()) {
    const q = query.toLowerCase()
    const matched = COMPONENT_REGISTRY.flatMap(g => {
      const items = g.subgroups
        ? g.subgroups.flatMap(sg => sg.items)
        : (g.items || [])
      return items.filter(c => c.name.includes(q) || c.id.includes(q))
    })
    return (
      <div className="flex flex-col h-full">
        <SearchBar query={query} setQuery={setQuery} />
        <div className="flex-1 overflow-y-auto py-1">
          {matched.length === 0
            ? <div className="px-4 py-8 text-center text-xs" style={{ color: 'var(--text-3)' }}>未找到组件</div>
            : matched.map(c => <CompItem key={c.id} comp={c} onClick={() => c.status === 'done' && enterComp(c.id as ComponentId)} />)
          }
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <SearchBar query={query} setQuery={setQuery} />
      <div className="flex-1 overflow-y-auto">
        {COMPONENT_REGISTRY.map(g => {
          const isOpen = expanded[g.group] ?? false
          const allItems = g.subgroups
            ? g.subgroups.flatMap(sg => sg.items)
            : (g.items || [])
          const doneCount = allItems.filter(c => c.status === 'done').length

          return (
            <div key={g.group}>
              {/* 分组标题 */}
              <button
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors hover:opacity-80"
                onClick={() => toggle(g.group)}
              >
                <span className="text-sm">{GROUP_ICONS[g.group] || '📦'}</span>
                <span className="flex-1 text-xs font-medium truncate" style={{ color: 'var(--text-1)' }}>
                  {g.groupLabel}
                </span>
                {doneCount > 0 && (
                  <span className="text-xs shrink-0" style={{ color: '#27D365' }}>{doneCount} 可用</span>
                )}
                <span
                  className="text-xs shrink-0 transition-transform duration-200"
                  style={{ color: 'var(--text-3)', transform: isOpen ? '' : 'rotate(-90deg)' }}
                >▾</span>
              </button>

              {/* 展开内容 */}
              {isOpen && (
                <div className="pb-1">
                  {g.subgroups ? (
                    g.subgroups.map(sg => (
                      <div key={sg.label}>
                        <div className="px-4 py-1 text-xs" style={{ color: 'var(--text-3)', fontSize: 11 }}>
                          {sg.label}
                        </div>
                        {sg.items.map(c => (
                          <CompItem key={c.id} comp={c} indent
                            onClick={() => c.status === 'done' && enterComp(c.id as ComponentId)} />
                        ))}
                      </div>
                    ))
                  ) : (
                    (g.items || []).map(c => (
                      <CompItem key={c.id} comp={c} indent
                        onClick={() => c.status === 'done' && enterComp(c.id as ComponentId)} />
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SearchBar({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  return (
    <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
      <input
        type="text"
        placeholder="搜索组件..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full px-3 py-1.5 text-xs rounded-lg outline-none placeholder-gray-400 transition-colors"
        style={{ background: 'var(--bg-subtle)', color: 'var(--text-1)' }}
      />
    </div>
  )
}

function CompItem({ comp, indent = false, onClick }: {
  comp: ComponentDef; indent?: boolean; onClick: () => void
}) {
  const isDone = comp.status === 'done'
  return (
    <button
      onClick={onClick}
      disabled={!isDone}
      className="w-full text-left flex items-center justify-between transition-colors"
      style={{ padding: `6px ${indent ? '16px' : '16px'} 6px ${indent ? '28px' : '16px'}` }}
    >
      <div className="flex-1 min-w-0">
        <span
          className="text-xs truncate block"
          style={{ color: isDone ? 'var(--text-1)' : 'var(--text-3)' }}
        >
          {comp.name}
        </span>
        {comp.desc && isDone && (
          <span className="text-xs block truncate" style={{ color: 'var(--text-3)', fontSize: 11 }}>
            {comp.desc}
          </span>
        )}
        {!isDone && (
          <span className="text-xs px-1.5 py-0.5 rounded mt-0.5 inline-block"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text-3)', fontSize: 10 }}>
            规划中
          </span>
        )}
      </div>
      {isDone && <span className="text-xs shrink-0 ml-2" style={{ color: 'var(--text-3)' }}>›</span>}
    </button>
  )
}
