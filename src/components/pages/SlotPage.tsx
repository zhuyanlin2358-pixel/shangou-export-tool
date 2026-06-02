import { useRef, useEffect, useCallback } from 'react'
import { useSlot } from '@/contexts/SlotContext'
import { useApp } from '@/contexts/AppContext'
import { captureElement, downloadCanvas, downloadZip } from '@/utils/exportUtils'

function ExportCard({ children, label, sub, sectionLabel, onExport }: {
  children: React.ReactNode
  label: string
  sub: string
  sectionLabel?: string
  onExport: () => void
}) {
  return (
    <div className="rounded-xl overflow-hidden border"
      style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
      {sectionLabel && (
        <div className="px-4 py-2 text-xs border-b flex items-center gap-2"
          style={{ borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
          {sectionLabel}
        </div>
      )}
      <div className="p-4 flex justify-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {children}
      </div>
      <div className="px-4 py-3 flex items-center justify-between border-t"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div>
          <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{label}</div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{sub}</div>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors"
          style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.06)' }}
        >
          ↓ 导出
        </button>
      </div>
    </div>
  )
}

function SectionNum({ num }: { num: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
        style={{ background: '#FF3060' }}>
        {num}
      </div>
    </div>
  )
}

export default function SlotPage() {
  const { config } = useSlot()
  const { showToast, registerExportAll } = useApp()

  const previewRef = useRef<HTMLDivElement>(null)
  const bgRef      = useRef<HTMLDivElement>(null)
  const emptyRef   = useRef<HTMLDivElement>(null)
  const btnRef     = useRef<HTMLDivElement>(null)
  const linkRef    = useRef<HTMLDivElement>(null)
  const prize0Ref  = useRef<HTMLDivElement>(null)
  const prize1Ref  = useRef<HTMLDivElement>(null)
  const prize2Ref  = useRef<HTMLDivElement>(null)

  const doExport = useCallback(async (
    ref: React.RefObject<HTMLDivElement | null>, name: string, w: number, h: number
  ) => {
    if (!ref.current) return
    showToast(`正在渲染 ${name}…`)
    try {
      const canvas = await captureElement(ref.current, w, h)
      downloadCanvas(canvas, `${name}.png`)
      showToast(`✅ ${name}.png`)
    } catch (e: unknown) {
      showToast(`❌ ${e instanceof Error ? e.message : '导出失败'}`)
    }
  }, [showToast])

  const doExportAll = useCallback(async () => {
    showToast('正在打包所有素材…')
    const tasks = [
      { ref: previewRef, name: 'slot_1_未抽奖状态_750x242',  w: 750, h: 242 },
      { ref: bgRef,      name: 'slot_2_背景_750x242',        w: 750, h: 242 },
      { ref: emptyRef,   name: 'slot_3_空态页_854x284',      w: 854, h: 284 },
      { ref: btnRef,     name: 'slot_4_按钮_194x80',         w: 194, h: 80  },
      { ref: linkRef,    name: 'slot_5_链接文字_109x34',     w: 109, h: 34  },
      { ref: prize0Ref,  name: 'slot_6_奖品1_124x124',       w: 124, h: 124 },
      { ref: prize1Ref,  name: 'slot_6_奖品2_124x124',       w: 124, h: 124 },
      { ref: prize2Ref,  name: 'slot_6_奖品3_124x124',       w: 124, h: 124 },
    ]
    try {
      const files = await Promise.all(
        tasks.filter(t => t.ref.current).map(async t => ({
          canvas: await captureElement(t.ref.current!, t.w, t.h),
          name: `${t.name}.png`,
        }))
      )
      await downloadZip(files, '老虎机_切图包')
      showToast('✅ 已打包：老虎机_切图包.zip')
    } catch (e: unknown) {
      showToast(`❌ ${e instanceof Error ? e.message : '打包失败'}`)
    }
  }, [showToast])

  useEffect(() => {
    registerExportAll(doExportAll)
    return () => registerExportAll(null)
  }, [doExportAll, registerExportAll])

  const vars = {
    '--btn-active-from': config.btnActiveFrom,
    '--btn-active-to':   config.btnActiveTo,
    '--slot-tint-from':  config.slotTintFrom,
    '--slot-tint-to':    config.slotTintTo,
    '--slot-links-color':config.linksColor,
    '--slot-title-color':config.titleColor,
  } as React.CSSProperties

  const prizeRefs = [prize0Ref, prize1Ref, prize2Ref]

  return (
    <div className="p-6 space-y-8" style={vars}>

      {/* Section 1 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <SectionNum num={1} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>老虎机未抽奖状态</div>
            <div className="text-xs" style={{ color: 'var(--text-3)' }}>含标题 + 奖品图 + 按钮 · 750 × 242 px</div>
          </div>
        </div>
        <ExportCard label="老虎机 — 未抽奖状态" sub="750 × 242 px · PNG"
          onExport={() => doExport(previewRef, 'slot_1_未抽奖状态_750x242', 750, 242)}>
          <div ref={previewRef} style={{ width: 750, height: 242, position: 'relative', overflow: 'hidden',
            background: `linear-gradient(120deg, var(--slot-tint-from) 0%, var(--slot-tint-to) 100%)`, borderRadius: 20, flexShrink: 0 }}>
            {/* 标题层 */}
            <div style={{ position: 'absolute', left: 42, top: 25, fontSize: 33, fontWeight: 500,
              color: 'var(--slot-title-color)', fontFamily: "'PingFang SC',sans-serif", whiteSpace: 'nowrap', zIndex: 3 }}>
              {config.titleText}
            </div>
            {/* 链接层 */}
            <div style={{ position: 'absolute', top: 24, right: 48, display: 'flex', alignItems: 'center',
              fontSize: 22, color: 'var(--slot-links-color)', whiteSpace: 'nowrap', zIndex: 3 }}>
              <span>我的奖品</span>
              <span style={{ margin: '0 8px', opacity: 0.6 }}>|</span>
              <span>抽奖规则</span>
            </div>
            {/* 框架层 */}
            <div style={{ position: 'absolute', left: 43, top: 76, width: 441, height: 142,
              borderRadius: 20, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', zIndex: 1 }} />
            {/* 奖品层 */}
            <div style={{ position: 'absolute', left: 43, top: 76, width: 441, height: 142,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 12px', zIndex: 2 }}>
              {config.prizes.map((p, i) => (
                <div key={i} style={{ width: 124, height: 124, borderRadius: 12, overflow: 'hidden',
                  background: p.imageUrl ? 'transparent' : 'rgba(0,0,0,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {p.imageUrl
                    ? <img src={p.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    : <span style={{ fontSize: 12, color: '#aaa' }}>奖品{i+1}</span>}
                </div>
              ))}
            </div>
            {/* 按钮层 */}
            <div style={{ position: 'absolute', right: 46, top: 106, width: 194, height: 80,
              borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(90deg, var(--btn-active-from), var(--btn-active-to))`,
              fontSize: 30, fontWeight: 400, color: '#fff',
              fontFamily: "'PingFang SC',sans-serif", zIndex: 3 }}>
              立即抽奖
            </div>
            {/* 剩余次数 */}
            <div style={{ position: 'absolute', right: 46, bottom: 14, fontSize: 14,
              color: 'var(--slot-links-color)', textAlign: 'center', width: 194, zIndex: 3 }}>
              还剩 999 次抽奖机会
            </div>
          </div>
        </ExportCard>
      </div>

      {/* Section 2 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <SectionNum num={2} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>老虎机背景</div>
            <div className="text-xs" style={{ color: 'var(--text-3)' }}>含主标题，不带商品图 · 750 × 242 px</div>
          </div>
        </div>
        <ExportCard label="老虎机背景（含主标题）" sub="750 × 242 px · PNG"
          onExport={() => doExport(bgRef, 'slot_2_背景_750x242', 750, 242)}>
          <div ref={bgRef} style={{ width: 750, height: 242, position: 'relative', overflow: 'hidden',
            background: `linear-gradient(120deg, var(--slot-tint-from) 0%, var(--slot-tint-to) 100%)`, borderRadius: 20, flexShrink: 0 }}>
            <div style={{ position: 'absolute', left: 42, top: 25, fontSize: 33, fontWeight: 500,
              color: 'var(--slot-title-color)', fontFamily: "'PingFang SC',sans-serif" }}>
              {config.titleText}
            </div>
            <div style={{ position: 'absolute', left: 43, top: 76, width: 441, height: 142,
              borderRadius: 20, background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }} />
          </div>
        </ExportCard>
      </div>

      {/* Section 3 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <SectionNum num={3} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>老虎机空态页</div>
            <div className="text-xs" style={{ color: 'var(--text-3)' }}>854 × 284 px @2x</div>
          </div>
        </div>
        <ExportCard label="老虎机空态页" sub="854 × 284 px · PNG"
          onExport={() => doExport(emptyRef, 'slot_3_空态页_854x284', 854, 284)}>
          <div ref={emptyRef} style={{ width: 854, height: 284, background: config.bgColor || '#FFF5F8',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{ fontSize: 56, lineHeight: 1 }}>😢</div>
            <div style={{ fontSize: 28, color: '#999', textAlign: 'center',
              fontFamily: "'PingFang SC',sans-serif", maxWidth: 600 }}>
              {config.emptyText}
            </div>
          </div>
        </ExportCard>
      </div>

      {/* Section 4 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <SectionNum num={4} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>抽奖按钮</div>
            <div className="text-xs" style={{ color: 'var(--text-3)' }}>194 × 80 px</div>
          </div>
        </div>
        <ExportCard label="抽奖按钮" sub="194 × 80 px · PNG"
          onExport={() => doExport(btnRef, 'slot_4_按钮_194x80', 194, 80)}>
          <div ref={btnRef} style={{ width: 194, height: 80, borderRadius: 40, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(90deg, var(--btn-active-from), var(--btn-active-to))`,
            fontSize: 30, fontWeight: 400, color: '#fff', fontFamily: "'PingFang SC',sans-serif" }}>
            立即抽奖
          </div>
        </ExportCard>
      </div>

      {/* Section 5 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <SectionNum num={5} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>链接文字</div>
            <div className="text-xs" style={{ color: 'var(--text-3)' }}>109 × 34 px</div>
          </div>
        </div>
        <ExportCard label="链接文字" sub="109 × 34 px · PNG"
          onExport={() => doExport(linkRef, 'slot_5_链接文字_109x34', 109, 34)}>
          <div ref={linkRef} style={{ width: 109, height: 34, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, color: 'var(--slot-links-color)', fontFamily: "'PingFang SC',sans-serif" }}>
            查看记录 &gt;
          </div>
        </ExportCard>
      </div>

      {/* Section 6 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <SectionNum num={6} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>奖品图</div>
            <div className="text-xs" style={{ color: 'var(--text-3)' }}>124 × 124 px × 3</div>
          </div>
        </div>
        <div className="flex gap-4">
          {config.prizes.map((p, i) => (
            <ExportCard key={i} label={`奖品图 ${i+1}`} sub="124 × 124 px · PNG"
              onExport={() => doExport(prizeRefs[i], `slot_6_奖品${i+1}_124x124`, 124, 124)}>
              <div ref={prizeRefs[i]} style={{ width: 124, height: 124, borderRadius: 12, flexShrink: 0,
                background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {p.imageUrl
                  ? <img src={p.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  : <span style={{ fontSize: 11, color: '#aaa' }}>奖品{i+1}</span>}
              </div>
            </ExportCard>
          ))}
        </div>
      </div>
    </div>
  )
}
