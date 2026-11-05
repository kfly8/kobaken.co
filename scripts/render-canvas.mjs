import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const SIDES = ['top', 'bottom', 'left', 'right']
const ENDS = ['none', 'arrow']
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char])
const fail = (message) => { throw new Error(`JSON Canvas: ${message}`) }

function validate(canvas) {
  if (!canvas || !Array.isArray(canvas.nodes) || !Array.isArray(canvas.edges)) fail('nodes and edges must be arrays')
  const nodes = new Map(), ids = new Set()
  for (const node of canvas.nodes) {
    if (!node || typeof node.id !== 'string' || !node.id || ids.has(node.id)) fail('node IDs must be unique nonempty strings')
    ids.add(node.id)
    if (node.type !== 'text') fail(`node ${node.id}: only text nodes are supported`)
    if (typeof node.text !== 'string') fail(`node ${node.id}: text must be a string`)
    if (!['x', 'y', 'width', 'height'].every((key) => typeof node[key] === 'number' && Number.isFinite(node[key]))) fail(`node ${node.id}: coordinates must be finite numbers`)
    if (node.width <= 0 || node.height <= 0) fail(`node ${node.id}: dimensions must be positive`)
    if (node.color !== undefined) fail(`node ${node.id}: colors are not supported`)
    nodes.set(node.id, node)
  }
  for (const edge of canvas.edges) {
    if (!edge || typeof edge.id !== 'string' || !edge.id || ids.has(edge.id)) fail('edge IDs must be unique nonempty strings')
    ids.add(edge.id)
    for (const end of ['from', 'to']) {
      if (!nodes.has(edge[`${end}Node`])) fail(`edge ${edge.id}: unknown ${end}Node`)
      if (!SIDES.includes(edge[`${end}Side`])) fail(`edge ${edge.id}: unsupported ${end}Side`)
      if (edge[`${end}End`] !== undefined && !ENDS.includes(edge[`${end}End`])) fail(`edge ${edge.id}: unsupported ${end}End`)
    }
    if (edge.label !== undefined && typeof edge.label !== 'string') fail(`edge ${edge.id}: label must be a string`)
    if (edge.color !== undefined) fail(`edge ${edge.id}: colors are not supported`)
    if (edge.fromNode === edge.toNode) fail(`edge ${edge.id}: self connections are not supported`)
  }
  return nodes
}

function wrap(text, width, size) {
  const limit = Math.max(1, Math.floor(width / (size * 0.53)))
  return text.split('\n').flatMap((paragraph) => {
    if (!paragraph.trim()) return ['']
    const lines = []
    let line = ''
    for (const word of paragraph.trim().split(/\s+/)) {
      if (line && line.length + word.length + 1 > limit) { lines.push(line); line = '' }
      let remaining = word
      while (remaining.length > limit) {
        if (line) { lines.push(line); line = '' }
        lines.push(remaining.slice(0, limit)); remaining = remaining.slice(limit)
      }
      line = line ? `${line} ${remaining}` : remaining
    }
    if (line) lines.push(line)
    return lines
  })
}

function nodeMarkup(node) {
  const lines = node.text.split('\n').flatMap((line) => {
    const heading = line.startsWith('# ')
    const size = heading ? 28 : 24
    return wrap(heading ? line.slice(2) : line, node.width - 40, size).map((text) => ({ text, size, heading }))
  })
  const totalHeight = lines.reduce((sum, line) => sum + (line.text ? line.size * 1.35 : 16), 0)
  if (totalHeight + 40 > node.height) fail(`node ${node.id}: text does not fit; increase width or height`)
  let baseline = node.y + (node.height - totalHeight) / 2
  const text = lines.map((line) => {
    baseline += line.text ? line.size * 1.35 : 16
    return line.text ? `<text x="${node.x + node.width / 2}" y="${baseline - line.size * 0.25}" font-size="${line.size}" font-weight="${line.heading ? 700 : 400}" text-anchor="middle">${escape(line.text)}</text>` : ''
  }).join('\n')
  return `<g id="node-${escape(node.id)}"><rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="12" fill="#ffffff" stroke="#d9d5cf" stroke-width="1.5"/>\n${text}</g>`
}

function endpoint(node, side, fraction) {
  if (side === 'top') return [node.x + node.width * fraction, node.y]
  if (side === 'bottom') return [node.x + node.width * fraction, node.y + node.height]
  if (side === 'left') return [node.x, node.y + node.height * fraction]
  return [node.x + node.width, node.y + node.height * fraction]
}

function route(from, to, fromSide, toSide) {
  const horizontal = (side) => side === 'left' || side === 'right'
  if (from[0] === to[0] || from[1] === to[1]) return [from, to]
  if (horizontal(fromSide) !== horizontal(toSide)) return [from, horizontal(fromSide) ? [to[0], from[1]] : [from[0], to[1]], to]
  if (horizontal(fromSide)) { const middle = (from[0] + to[0]) / 2; return [from, [middle, from[1]], [middle, to[1]], to] }
  const middle = (from[1] + to[1]) / 2
  return [from, [from[0], middle], [to[0], middle], to]
}

function edgeMarkup(edge, points) {
  const start = edge.fromEnd ?? 'none', end = edge.toEnd ?? 'arrow'
  const markers = `${start === 'arrow' ? ' marker-start="url(#arrow)"' : ''}${end === 'arrow' ? ' marker-end="url(#arrow)"' : ''}`
  const path = `<path id="edge-${escape(edge.id)}" d="${points.map((point, index) => `${index ? 'L' : 'M'}${point.join(' ')}`).join(' ')}" fill="none" stroke="#64748b" stroke-width="2.5"${markers}/>`
  if (!edge.label) return path
  const segments = points.slice(1).map((point, index) => ({ a: points[index], b: point, length: Math.abs(point[0] - points[index][0]) + Math.abs(point[1] - points[index][1]) }))
  const segment = segments.reduce((best, current) => current.length > best.length ? current : best)
  const horizontal = segment.a[1] === segment.b[1]
  const width = horizontal ? Math.max(40, segment.length - 24) : 210
  const lines = wrap(edge.label, width - 12, 20)
  const labelWidth = Math.min(width, Math.max(...lines.map((line) => line.length)) * 20 * 0.53 + 12)
  const labelHeight = lines.length * 25 + 10
  const centerX = (segment.a[0] + segment.b[0]) / 2, centerY = (segment.a[1] + segment.b[1]) / 2
  const x = centerX - labelWidth / 2, y = centerY - labelHeight / 2
  const label = `<g><rect x="${x}" y="${y}" width="${labelWidth}" height="${labelHeight}" rx="4" fill="#fbfaf8"/>${lines.map((line, index) => `<text x="${centerX}" y="${y + 23 + index * 25}" font-size="20" text-anchor="middle" fill="#52677b">${escape(line)}</text>`).join('')}</g>`
  return path + label
}

export function renderCanvas(canvas) {
  const nodes = validate(canvas)
  if (!nodes.size) fail('at least one text node is required')
  const ports = new Map()
  for (const edge of canvas.edges) for (const end of ['from', 'to']) {
    const key = `${edge[`${end}Node`]}\0${edge[`${end}Side`]}`
    if (!ports.has(key)) ports.set(key, [])
    ports.get(key).push(`${edge.id}\0${end}`)
  }
  const edges = canvas.edges.map((edge) => {
    const point = (end) => {
      const key = `${edge[`${end}Node`]}\0${edge[`${end}Side`]}`
      const list = ports.get(key)
      return endpoint(nodes.get(edge[`${end}Node`]), edge[`${end}Side`], (list.indexOf(`${edge.id}\0${end}`) + 1) / (list.length + 1))
    }
    return edgeMarkup(edge, route(point('from'), point('to'), edge.fromSide, edge.toSide))
  })
  const values = [...nodes.values()]
  const minX = Math.min(...values.map((node) => node.x)) - 32, minY = Math.min(...values.map((node) => node.y)) - 32
  const width = Math.max(...values.map((node) => node.x + node.width)) - minX + 32
  const height = Math.max(...values.map((node) => node.y + node.height)) - minY + 32
  return `<!-- Generated from JSON Canvas. Edit the .canvas source. -->\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX} ${minY} ${width} ${height}" role="img" aria-labelledby="canvas-title"><title id="canvas-title">${escape(values.map((node) => node.text.split('\n')[0].replace(/^# /, '')).join(' · '))}</title><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M1 1 L7 4 L1 7" fill="none" stroke="#64748b" stroke-width="1.5"/></marker></defs><rect x="${minX}" y="${minY}" width="${width}" height="${height}" rx="16" fill="#fbfaf8"/><g font-family="Arial, sans-serif" fill="#292524">${edges.join('\n')}\n${values.map(nodeMarkup).join('\n')}</g></svg>\n`
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [, , source, destination] = process.argv
  if (!source || !destination) throw new Error('Usage: node scripts/render-canvas.mjs source.canvas destination.svg')
  writeFileSync(destination, renderCanvas(JSON.parse(readFileSync(source, 'utf8'))))
}
