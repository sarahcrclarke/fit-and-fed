import type { BodyArea } from '../data/types'

/**
 * Geometry for the body heatmaps on Body Focus.
 *
 * Both figures come out of one builder driven by a table of half-widths at fixed heights,
 * so the male and female bodies stay anatomically consistent with each other — only the
 * proportions differ. Outlines are authored as points and smoothed by a spline rather than
 * written as beziers by hand, which is what keeps them tunable.
 *
 * Everything is drawn on a 120 × 260 canvas with the spine at x = 60. Only the viewer's-left
 * half of each paired muscle is authored; `mirror` reflects the group about the spine at
 * render time.
 */

export const CANVAS = { width: 120, height: 260 }

/** The spine. */
const CX = CANVAS.width / 2

export type FigureSex = 'male' | 'female'

export type Shape =
  | { kind: 'path'; d: string }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number; rotate?: number }
  | { kind: 'rect'; x: number; y: number; w: number; h: number; r: number }

/** One shaded region of the map. Several muscles can map to the same body area. */
export interface Muscle {
  area: BodyArea
  /** Anatomical name, shown on hover. */
  label: string
  shapes: Shape[]
  /** Draw a reflected copy for the other side of the body. */
  mirror?: boolean
}

export interface Figure {
  /** Neutral body shape drawn under the muscles. */
  silhouette: Shape[]
  /** Hairline detail drawn over the muscles — ab separations, the spine. */
  detail: string[]
  muscles: Muscle[]
}

type Point = [x: number, y: number]

/** A cross-section of a limb or the torso: how wide the body is at this height. */
interface Station {
  y: number
  /** Distance from the part's centreline to its edge. */
  w: number
  /** Centreline offset from the spine. Torso stations leave this at 0. */
  x?: number
}

interface Proportions {
  /** Torso cross-sections, shoulders down to the crotch. */
  torso: Station[]
  /** One arm, shoulder down to the fingertips. */
  arm: Station[]
  /** One leg, hip down to the toes. */
  leg: Station[]
  head: { cy: number; rx: number; ry: number }
  neck: { top: number; bottom: number; w: number }
}

/** Stations shared by both figures, so the two bodies stay the same height. */
const HEAD = { cy: 20, rx: 12, ry: 15 }
const NECK = { top: 30, bottom: 46, w: 6.5 }

const MALE: Proportions = {
  head: HEAD,
  neck: NECK,
  torso: [
    { y: 47, w: 13 },
    { y: 54, w: 21 },
    { y: 61, w: 25 },
    { y: 76, w: 23 },
    { y: 91, w: 19 },
    { y: 105, w: 16.5 },
    { y: 118, w: 18 },
    { y: 130, w: 19 },
    { y: 139, w: 18.5 },
  ],
  arm: [
    { y: 58, w: 7.4, x: -30.5 },
    { y: 74, w: 6.8, x: -30 },
    { y: 92, w: 5.8, x: -29.5 },
    { y: 104, w: 5, x: -29.5 },
    { y: 122, w: 5.2, x: -29 },
    { y: 136, w: 4, x: -28.5 },
    { y: 143, w: 5, x: -28 },
    { y: 152, w: 3.5, x: -28 },
  ],
  leg: [
    { y: 133, w: 10.5, x: -9.5 },
    { y: 152, w: 10.2, x: -9.5 },
    { y: 172, w: 8.6, x: -9 },
    { y: 188, w: 6.8, x: -8 },
    { y: 202, w: 7, x: -7.5 },
    { y: 224, w: 4.6, x: -6.5 },
    { y: 240, w: 3.6, x: -6 },
    { y: 250, w: 5.5, x: -6.5 },
  ],
}

const FEMALE: Proportions = {
  head: { ...HEAD, rx: 11.2 },
  neck: { ...NECK, w: 5.6 },
  torso: [
    { y: 47, w: 11.5 },
    { y: 54, w: 17.5 },
    { y: 61, w: 20.5 },
    { y: 76, w: 18.5 },
    { y: 91, w: 15 },
    { y: 105, w: 13 },
    { y: 118, w: 18.5 },
    { y: 130, w: 20.5 },
    { y: 139, w: 20 },
  ],
  arm: [
    { y: 58, w: 6.2, x: -26.2 },
    { y: 74, w: 5.8, x: -25.8 },
    { y: 92, w: 5, x: -25.4 },
    { y: 104, w: 4.4, x: -25.2 },
    { y: 122, w: 4.6, x: -25 },
    { y: 136, w: 3.5, x: -24.6 },
    { y: 143, w: 4.4, x: -24.2 },
    { y: 152, w: 3, x: -24.2 },
  ],
  leg: [
    { y: 133, w: 10.6, x: -10.5 },
    { y: 152, w: 10, x: -10 },
    { y: 172, w: 8.4, x: -9 },
    { y: 188, w: 6.5, x: -8 },
    { y: 202, w: 6.6, x: -7.5 },
    { y: 224, w: 4.4, x: -6.5 },
    { y: 240, w: 3.4, x: -6 },
    { y: 250, w: 5.2, x: -6.5 },
  ],
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * A closed Catmull-Rom spline through `points`, emitted as cubic béziers. Authoring the
 * body as points and smoothing it here is what keeps the outlines editable — nudging a
 * shoulder is one number, not a pair of control handles.
 */
function spline(points: Point[]): string {
  const n = points.length
  const at = (i: number) => points[(i + n) % n]
  let d = `M${round(points[0][0])},${round(points[0][1])}`
  for (let i = 0; i < n; i++) {
    const [x0, y0] = at(i - 1)
    const [x1, y1] = at(i)
    const [x2, y2] = at(i + 1)
    const [x3, y3] = at(i + 2)
    const c1: Point = [x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6]
    const c2: Point = [x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6]
    d += ` C${round(c1[0])},${round(c1[1])} ${round(c2[0])},${round(c2[1])} ${round(x2)},${round(y2)}`
  }
  return `${d} Z`
}

/** Outline of a part: down its left edge, around the bottom, back up its right edge. */
function outline(stations: Station[]): Point[] {
  const centre = (s: Station) => CX + (s.x ?? 0)
  const left: Point[] = stations.map((s) => [centre(s) - s.w, s.y])
  const right: Point[] = [...stations].reverse().map((s) => [centre(s) + s.w, s.y])
  return [...left, ...right]
}

/** Linear interpolation along a station table — used to hang muscles off the same skeleton. */
function sample(stations: Station[], y: number): { x: number; w: number } {
  const first = stations[0]
  const last = stations[stations.length - 1]
  if (y <= first.y) return { x: CX + (first.x ?? 0), w: first.w }
  if (y >= last.y) return { x: CX + (last.x ?? 0), w: last.w }
  for (let i = 1; i < stations.length; i++) {
    const a = stations[i - 1]
    const b = stations[i]
    if (y > b.y) continue
    const t = (y - a.y) / (b.y - a.y)
    return {
      x: CX + (a.x ?? 0) + ((b.x ?? 0) - (a.x ?? 0)) * t,
      w: a.w + (b.w - a.w) * t,
    }
  }
  return { x: CX + (last.x ?? 0), w: last.w }
}

function silhouette(p: Proportions): Shape[] {
  const arm = spline(outline(p.arm))
  const leg = spline(outline(p.leg))
  return [
    { kind: 'ellipse', cx: CX, cy: p.head.cy, rx: p.head.rx, ry: p.head.ry },
    {
      kind: 'rect',
      x: CX - p.neck.w,
      y: p.neck.top,
      w: p.neck.w * 2,
      h: p.neck.bottom - p.neck.top,
      r: p.neck.w * 0.7,
    },
    { kind: 'path', d: arm },
    { kind: 'path', d: mirrorPath(arm) },
    { kind: 'path', d: leg },
    { kind: 'path', d: mirrorPath(leg) },
    { kind: 'path', d: spline(outline(p.torso)) },
  ]
}

/**
 * Mirrors an absolute-coordinate path about the spine. Every path here is generated by
 * `spline`, which emits nothing but absolute commands and explicit `x,y` pairs — that is
 * what makes a textual reflection safe.
 */
function mirrorPath(d: string): string {
  return d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) =>
    `${round(CANVAS.width - Number(x))},${y}`,
  )
}

/** An ellipse hung on a limb's centreline at height `y`, inset from its edge. */
function onLimb(
  stations: Station[],
  y: number,
  ry: number,
  inset = 1.2,
  rotate?: number,
): Shape {
  const { x, w } = sample(stations, y)
  return { kind: 'ellipse', cx: round(x), cy: y, rx: round(Math.max(2, w - inset)), ry, rotate }
}

function frontMuscles(p: Proportions, sex: FigureSex): Muscle[] {
  const shoulder = sample(p.torso, 61)
  const chest = sample(p.torso, 76)
  const waist = sample(p.torso, 103)
  // A woman's pecs sit slightly higher and read narrower under the bust line.
  const pecY = sex === 'female' ? 73 : 76
  const pecRy = sex === 'female' ? 6.5 : 8

  return [
    {
      area: 'shoulders',
      label: 'Deltoids',
      mirror: true,
      shapes: [
        {
          kind: 'ellipse',
          cx: round(shoulder.x - shoulder.w + 1.5),
          cy: 64,
          rx: 8.4,
          ry: 11,
          rotate: -18,
        },
      ],
    },
    {
      area: 'chest',
      label: 'Pectorals',
      mirror: true,
      shapes: [
        {
          kind: 'ellipse',
          cx: round(CX - chest.w * 0.47),
          cy: pecY,
          rx: round(chest.w * 0.44),
          ry: pecRy,
          rotate: -8,
        },
      ],
    },
    {
      area: 'core',
      label: 'Abdominals',
      shapes: [
        {
          kind: 'path',
          // A shield rather than a box — wide under the ribs, tapering into the pelvis.
          d: spline([
            [round(CX - waist.w * 0.52), 88],
            [CX, 86],
            [round(CX + waist.w * 0.52), 88],
            [round(CX + waist.w * 0.44), 108],
            [CX, 119],
            [round(CX - waist.w * 0.44), 108],
          ]),
        },
      ],
    },
    {
      area: 'core',
      label: 'Obliques',
      mirror: true,
      shapes: [
        { kind: 'ellipse', cx: round(CX - waist.w * 0.78), cy: 101, rx: round(waist.w * 0.24), ry: 12.5 },
      ],
    },
    { area: 'arms', label: 'Biceps', mirror: true, shapes: [onLimb(p.arm, 82, 13)] },
    { area: 'arms', label: 'Forearms', mirror: true, shapes: [onLimb(p.arm, 117, 14)] },
    { area: 'legs', label: 'Quadriceps', mirror: true, shapes: [onLimb(p.leg, 157, 25)] },
    { area: 'legs', label: 'Shins', mirror: true, shapes: [onLimb(p.leg, 208, 16, 2)] },
  ]
}

function backMuscles(p: Proportions): Muscle[] {
  const shoulder = sample(p.torso, 61)
  const chest = sample(p.torso, 76)
  const waist = sample(p.torso, 103)
  const hip = sample(p.torso, 124)

  // Trapezius: base of the neck, out to each shoulder, down to a point between the blades.
  const traps = spline([
    [CX, 48],
    [round(CX - shoulder.w * 0.62), 61],
    [round(CX - chest.w * 0.26), 79],
    [CX, 86],
    [round(CX + chest.w * 0.26), 79],
    [round(CX + shoulder.w * 0.62), 61],
  ])

  // Latissimus: wide under the armpit, tapering into the small of the back.
  const lat = spline([
    [round(CX - chest.w * 0.92), 73],
    [round(CX - chest.w * 0.86), 88],
    [round(CX - waist.w * 0.86), 101],
    [round(CX - waist.w * 0.28), 103],
    [round(CX - chest.w * 0.16), 88],
    [round(CX - chest.w * 0.4), 76],
  ])

  const lowerBack = spline([
    [round(CX - waist.w * 0.52), 106],
    [round(CX + waist.w * 0.52), 106],
    [round(CX + waist.w * 0.42), 120],
    [round(CX - waist.w * 0.42), 120],
  ])

  return [
    {
      area: 'shoulders',
      label: 'Rear deltoids',
      mirror: true,
      shapes: [
        {
          kind: 'ellipse',
          cx: round(shoulder.x - shoulder.w + 1.5),
          cy: 64,
          rx: 8.4,
          ry: 11,
          rotate: -18,
        },
      ],
    },
    { area: 'back', label: 'Trapezius', shapes: [{ kind: 'path', d: traps }] },
    { area: 'back', label: 'Latissimus dorsi', mirror: true, shapes: [{ kind: 'path', d: lat }] },
    { area: 'back', label: 'Lower back', shapes: [{ kind: 'path', d: lowerBack }] },
    { area: 'arms', label: 'Triceps', mirror: true, shapes: [onLimb(p.arm, 82, 13)] },
    { area: 'arms', label: 'Forearms', mirror: true, shapes: [onLimb(p.arm, 117, 14)] },
    {
      area: 'glutes',
      label: 'Glutes',
      mirror: true,
      shapes: [
        { kind: 'ellipse', cx: round(CX - hip.w * 0.46), cy: 128, rx: round(hip.w * 0.43), ry: 11 },
      ],
    },
    { area: 'legs', label: 'Hamstrings', mirror: true, shapes: [onLimb(p.leg, 159, 24)] },
    { area: 'legs', label: 'Calves', mirror: true, shapes: [onLimb(p.leg, 203, 17, 1.4)] },
  ]
}

function frontDetail(p: Proportions): string[] {
  const waist = sample(p.torso, 103)
  const half = round(waist.w * 0.34)
  return [
    `M${CX},92 L${CX},113`,
    `M${CX - half},97 L${CX + half},97`,
    `M${CX - half},105 L${CX + half},105`,
  ]
}

function backDetail(): string[] {
  return [`M${CX},62 L${CX},120`]
}

export function buildFigure(sex: FigureSex, view: 'front' | 'back'): Figure {
  const p = sex === 'male' ? MALE : FEMALE
  return {
    silhouette: silhouette(p),
    detail: view === 'front' ? frontDetail(p) : backDetail(),
    muscles: view === 'front' ? frontMuscles(p, sex) : backMuscles(p),
  }
}
