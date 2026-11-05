import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderCanvas } from './render-canvas.mjs'

const fixture = () => ({
  nodes: [
    { id: 'a', type: 'text', x: -40, y: 0, width: 260, height: 180, text: '# App\nPreview' },
    { id: 'b', type: 'text', x: 500, y: 0, width: 260, height: 180, text: '# Agent\nEdit' },
  ],
  edges: [
    { id: 'out', fromNode: 'a', fromSide: 'right', toNode: 'b', toSide: 'left', label: 'Comment' },
    { id: 'back', fromNode: 'b', fromSide: 'left', toNode: 'a', toSide: 'right', label: 'Reply' },
  ],
})

test('canvas text, labels, and positions determine the output', () => {
  const original = renderCanvas(fixture())
  for (const mutate of [
    (canvas) => { canvas.nodes[0].text = '# Changed\nPreview' },
    (canvas) => { canvas.edges[0].label = 'Different label' },
    (canvas) => { canvas.nodes[0].x -= 20 },
  ]) {
    const canvas = fixture(); mutate(canvas)
    assert.notEqual(renderCanvas(canvas), original)
  }
  assert.equal(renderCanvas(fixture()), original)
  assert.match(original, /viewBox="-72 -32/)
})

test('opposite edges use separate ports and default arrow direction', () => {
  const svg = renderCanvas(fixture())
  assert.match(svg, /id="edge-out" d="M220 60 L500 60"/)
  assert.match(svg, /id="edge-back" d="M500 120 L220 120"/)
  assert.equal((svg.match(/marker-end="url\(#arrow\)"/g) ?? []).length, 2)
})

test('XML characters are escaped in node text, edge labels, and IDs', () => {
  const canvas = fixture()
  canvas.nodes[0].text = '# A < B & C\n"quoted"'
  canvas.edges[0].label = '<script>&"'
  const svg = renderCanvas(canvas)
  assert.match(svg, /A &lt; B &amp; C/)
  assert.match(svg, /&lt;script&gt;&amp;&quot;/)
  assert.doesNotMatch(svg, /<script>/)
})

test('invalid or unsupported input fails with actionable errors', () => {
  for (const [mutate, message] of [
    [(canvas) => { canvas.nodes[0].type = 'file' }, /only text nodes/],
    [(canvas) => { canvas.nodes[0].x = Infinity }, /finite numbers/],
    [(canvas) => { canvas.nodes[0].width = 0 }, /dimensions must be positive/],
    [(canvas) => { canvas.nodes[0].height = 10 }, /text does not fit/],
    [(canvas) => { canvas.nodes[1].id = 'a' }, /IDs must be unique/],
    [(canvas) => { canvas.edges[0].toNode = 'missing' }, /unknown toNode/],
    [(canvas) => { canvas.edges[0].fromSide = 'diagonal' }, /unsupported fromSide/],
    [(canvas) => { canvas.edges[0].toEnd = 'circle' }, /unsupported toEnd/],
  ]) {
    const canvas = fixture(); mutate(canvas)
    assert.throws(() => renderCanvas(canvas), message)
  }
  assert.throws(() => renderCanvas({ nodes: [], edges: [] }), /at least one text node/)
})
