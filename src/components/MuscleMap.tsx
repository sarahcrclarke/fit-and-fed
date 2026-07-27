import { useId } from 'react'
import type { BodyArea } from '../data/types'
import { BODY_AREAS } from '../data/types'
import { CANVAS, buildFigure, type FigureSex, type Shape } from './anatomy'

/**
 * Sequential ramp for training volume — one hue, light to dark. Validated for lightness
 * monotonicity and a light end that still clears 2:1 against the white card behind it.
 * The app is light-mode only, so there is no second set of steps.
 */
const RAMP = ['#86be9a', '#5fa878', '#3c8a5a', '#245c3d', '#163826']

/** Untrained muscles are neutral, deliberately outside the ramp — absence, not a low value. */
const UNTRAINED = '#eef0f1'
const BODY_FILL = '#f7f8f8'
const BODY_EDGE = '#dde1e3'

const RAMP_STEPS = RAMP.length

/** Which fifth of the busiest area's volume this area falls in. 0 means nothing logged. */
function intensityLevel(minutes: number, max: number): number {
  if (minutes <= 0 || max <= 0) return 0
  return Math.min(RAMP_STEPS, Math.ceil((minutes / max) * RAMP_STEPS))
}

function fillFor(level: number): string {
  return level === 0 ? UNTRAINED : RAMP[level - 1]
}

function renderShape(shape: Shape, key: number) {
  switch (shape.kind) {
    case 'ellipse':
      return (
        <ellipse
          key={key}
          cx={shape.cx}
          cy={shape.cy}
          rx={shape.rx}
          ry={shape.ry}
          transform={shape.rotate ? `rotate(${shape.rotate} ${shape.cx} ${shape.cy})` : undefined}
        />
      )
    case 'rect':
      return <rect key={key} x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.r} />
    case 'path':
      return <path key={key} d={shape.d} />
  }
}

function BodyView({
  sex,
  view,
  minutesByArea,
  maxMinutes,
}: {
  sex: FigureSex
  view: 'front' | 'back'
  minutesByArea: Map<BodyArea, number>
  maxMinutes: number
}) {
  const figure = buildFigure(sex, view)
  const titleId = useId()

  return (
    <figure className="flex flex-col items-center gap-1.5">
      <svg
        viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
        className="h-52 w-auto sm:h-60"
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>
          {view === 'front' ? 'Front' : 'Back'} of the body, shaded by minutes trained this week
        </title>

        <g fill={BODY_FILL} stroke={BODY_EDGE} strokeWidth={1} strokeLinejoin="round">
          {figure.silhouette.map(renderShape)}
        </g>

        {figure.muscles.map((muscle, i) => {
          const minutes = minutesByArea.get(muscle.area) ?? 0
          const level = intensityLevel(minutes, maxMinutes)
          const areaLabel = BODY_AREAS.find((a) => a.id === muscle.area)?.label ?? muscle.area
          const shapes = muscle.shapes.map(renderShape)
          return (
            <g
              key={`${muscle.label}-${i}`}
              fill={fillFor(level)}
              // A hairline of the card colour keeps neighbouring muscles from merging into
              // one blob when they are shaded the same. Untrained muscles get a grey edge
              // instead, so an area with nothing logged still reads as a region.
              stroke={level === 0 ? BODY_EDGE : '#ffffff'}
              strokeWidth={1.4}
              strokeLinejoin="round"
            >
              <title>
                {muscle.label} · {areaLabel} — {minutes > 0 ? `${minutes} min` : 'nothing logged'}
              </title>
              {shapes}
              {muscle.mirror && <g transform={`translate(${CANVAS.width},0) scale(-1,1)`}>{shapes}</g>}
            </g>
          )
        })}

        <g stroke="#ffffff" strokeWidth={1} strokeLinecap="round" opacity={0.65} fill="none">
          {figure.detail.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>
      <figcaption className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
        {view === 'front' ? 'Front' : 'Back'}
      </figcaption>
    </figure>
  )
}

/**
 * Front and back heatmaps of one person's body, shaded by how many minutes each muscle
 * group got this week. `maxMinutes` is passed in rather than derived so two people shown
 * side by side are shaded on the same scale.
 */
export function MuscleMap({
  sex,
  name,
  minutesByArea,
  maxMinutes,
}: {
  sex: FigureSex
  name: string
  minutesByArea: Map<BodyArea, number>
  maxMinutes: number
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-semibold text-ink-600">{name}</p>
      <div className="flex items-start gap-1 sm:gap-3">
        <BodyView sex={sex} view="front" minutesByArea={minutesByArea} maxMinutes={maxMinutes} />
        <BodyView sex={sex} view="back" minutesByArea={minutesByArea} maxMinutes={maxMinutes} />
      </div>
    </div>
  )
}

/** Key for the ramp — the shading is meaningless without the scale it was built from. */
export function MuscleMapLegend({ maxMinutes }: { maxMinutes: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-ink-400">
      <span className="flex items-center gap-1.5">
        <span
          className="h-3 w-3 rounded-[3px] ring-1 ring-inset ring-ink-200"
          style={{ background: UNTRAINED }}
        />
        None
      </span>
      <span className="flex items-center gap-1.5">
        <span>Less</span>
        <span className="flex gap-0.5">
          {RAMP.map((step) => (
            <span key={step} className="h-3 w-3 rounded-[3px]" style={{ background: step }} />
          ))}
        </span>
        <span>More</span>
      </span>
      <span>Darkest = {maxMinutes} min</span>
    </div>
  )
}
