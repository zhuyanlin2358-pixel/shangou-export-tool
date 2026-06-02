import { useApp } from '@/contexts/AppContext'
import { COMPONENT_REGISTRY, type ComponentId, type ComponentDef } from '@/types'

export default function HomePage() {
  const { enterComp } = useApp()

  return (
    <div style={{ padding: '48px 56px 40px' }}>
      {/* 大标题 */}
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>
        闪购会场组件库
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24 }}>
        运营自助配置组件参数，一键导出切图素材
      </p>

      {/* 3步引导 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36 }}>
        {[['1', '选组件'], ['2', '配置参数'], ['3', '导出切图']].map(([num, text], i) => (
          <div key={num} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', borderRadius: 8,
              background: 'var(--bg-subtle)', border: '1px solid var(--border)',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: '#FF3060', color: '#fff',
                fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{num}</div>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)', whiteSpace: 'nowrap' }}>
                {text}
              </span>
            </div>
            {i < 2 && (
              <span style={{ fontSize: 14, color: 'var(--border)', padding: '0 6px' }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* AI 预留卡片 — 横向布局 */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
        borderRadius: 12, padding: '20px 24px', marginBottom: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        cursor: 'pointer',
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#60A5FA', letterSpacing: '0.5px', marginBottom: 6 }}>
            ✦ AI 能力预留
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            上传商品图，一键生成资源位
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
            上传商品主图，AI 自动适配各尺寸资源位规范，批量输出可用素材
          </div>
        </div>
        <div style={{
          flexShrink: 0, padding: '8px 16px',
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 8, fontSize: 12, color: '#fff', whiteSpace: 'nowrap',
        }}>
          即将上线 →
        </div>
      </div>

      {/* 分组卡片区 */}
      {COMPONENT_REGISTRY.map(g => {
        const allItems = g.subgroups
          ? g.subgroups.flatMap(sg => sg.items)
          : (g.items || [])
        const doneCount = allItems.filter(c => c.status === 'done').length

        return (
          <div key={g.group} style={{ marginBottom: 36 }}>
            {/* 分组标题 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>
                {g.groupLabel}
              </span>
              {doneCount > 0 && (
                <span style={{
                  fontSize: 12, color: '#27D365',
                  background: 'rgba(39,211,101,0.1)',
                  borderRadius: 4, padding: '1px 7px', fontWeight: 500,
                }}>
                  {doneCount} 个可用
                </span>
              )}
            </div>

            {/* 卡片网格 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 10,
            }}>
              {allItems.map(comp => (
                <CompCard
                  key={comp.id}
                  comp={comp}
                  onEnter={() => enterComp(comp.id as ComponentId)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CompCard({ comp, onEnter }: { comp: ComponentDef; onEnter: () => void }) {
  const isDone = comp.status === 'done'
  return (
    <button
      onClick={isDone ? onEnter : undefined}
      style={{
        textAlign: 'left', padding: '14px 16px',
        borderRadius: 10,
        background: isDone ? 'var(--bg)' : 'var(--bg-subtle)',
        border: isDone ? '1px solid var(--border)' : '1px dashed var(--border)',
        cursor: isDone ? 'pointer' : 'default',
        display: 'flex', flexDirection: 'column', gap: 4,
        position: 'relative', overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.15s',
      }}
      onMouseEnter={e => { if (isDone) (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = ''}
    >
      {/* 规划中的锁图标 */}
      {!isDone && (
        <svg style={{ position: 'absolute', top: 10, right: 10, opacity: 0.2, width: 14, height: 14 }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x={3} y={11} width={18} height={11} rx={2} />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )}

      <div style={{
        fontSize: 14, fontWeight: 600, lineHeight: 1.4,
        color: isDone ? 'var(--text-1)' : 'var(--text-3)',
      }}>
        {comp.name}
      </div>

      {comp.desc && isDone && (
        <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{comp.desc}</div>
      )}

      {isDone ? (
        <div style={{
          display: 'inline-block', marginTop: 4, fontSize: 12, fontWeight: 600,
          color: '#27D365', background: 'rgba(39,211,101,0.1)',
          borderRadius: 4, padding: '1px 6px',
        }}>
          可用
        </div>
      ) : (
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>规划中</div>
      )}
    </button>
  )
}
