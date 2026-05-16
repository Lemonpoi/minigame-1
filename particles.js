const { state, ui } = require('./state')
const { LAYERS } = require('./data')

// shared PRNG seeded once
let rngState = Date.now() & 0x7fffffff
function fastRand() {
  rngState = (rngState * 1664525 + 1013904223) & 0x7fffffff
  return rngState / 0x7fffffff
}

const POOL_SIZE = 800
const pool = []

function allocParticle() {
  return pool.length > 0 ? pool.pop() : {}
}

function freeParticle(p) {
  if (pool.length < POOL_SIZE) pool.push(p)
}

function spawnP(x, y, c, n) {
  for (let i = 0; i < (n || 3); i++) {
    const p = allocParticle()
    p.x = x + (fastRand() - 0.5) * 30
    p.y = y + (fastRand() - 0.5) * 20
    p.vx = (fastRand() - 0.5) * 3
    p.vy = -fastRand() * 4 - 1
    p.life = 1
    p.color = c || LAYERS[state.layer].vein
    p.size = 2 + fastRand() * 3
    ui.particles.push(p)
  }
}

function spawnCoin(x, y, a) {
  ui.coinTexts.push({
    x: x + (fastRand() - 0.5) * 40,
    y: y - 10,
    vy: -1.5 - fastRand(),
    text: '+' + Math.floor(a),
    life: 1,
  })
}

function spawnRockBreak(rx, ry, rs, scale) {
  if (ui.particles.length >= 400) return
  scale = scale || 1
  const c = LAYERS[state.layer]
  const cx = rx + rs / 2
  const cy = ry + rs / 2

  // shockwave ring
  ui.shockwave = { x: cx, y: cy, r: 0, maxR: 90, life: 0.6 }

  // 0) large mineral chunks tumbling outward
  for (let i = 0; i < Math.ceil(30 * scale); i++) {
    const a = fastRand() * Math.PI * 2
    const spd = 1.5 + fastRand() * 5
    const p = allocParticle()
    p.x = cx + (fastRand() - 0.5) * rs * 0.3
    p.y = cy + (fastRand() - 0.5) * rs * 0.3
    p.vx = Math.cos(a) * spd
    p.vy = Math.sin(a) * spd - 1.5
    p.life = 0.6 + fastRand() * 0.8
    p.color = LAYERS[state.layer].rock
    p.size = 7 + fastRand() * 7
    p.w2 = 2 + fastRand() * 4
    p.w3 = fastRand() * Math.PI * 2
    ui.particles.push(p)
  }

  // 1) rock fragments flying outward
  for (let i = 0; i < Math.ceil(80 * scale); i++) {
    const a = fastRand() * Math.PI * 2
    const spd = 2 + fastRand() * 8
    const p = allocParticle()
    p.x = cx + (fastRand() - 0.5) * rs * 0.5
    p.y = cy + (fastRand() - 0.5) * rs * 0.5
    p.vx = Math.cos(a) * spd
    p.vy = Math.sin(a) * spd - 2
    p.life = 0.4 + fastRand() * 0.7
    p.color = c.rock
    p.size = 2 + fastRand() * 5
    ui.particles.push(p)
  }

  // 2) vein glow particles burst outward
  for (let i = 0; i < Math.ceil(60 * scale); i++) {
    const a = fastRand() * Math.PI * 2
    const spd = 1 + fastRand() * 6
    const p = allocParticle()
    p.x = cx + (fastRand() - 0.5) * rs * 0.4
    p.y = cy + (fastRand() - 0.5) * rs * 0.4
    p.vx = Math.cos(a) * spd
    p.vy = Math.sin(a) * spd - 1.5
    p.life = 0.3 + fastRand() * 0.5
    p.color = c.vein
    p.size = 1 + fastRand() * 3
    ui.particles.push(p)
  }

  // 3) bright sparks (white/gold)
  for (let i = 0; i < Math.ceil(50 * scale); i++) {
    const a = fastRand() * Math.PI * 2
    const spd = 2 + fastRand() * 10
    const p = allocParticle()
    p.x = cx + (fastRand() - 0.5) * rs * 0.3
    p.y = cy + (fastRand() - 0.5) * rs * 0.3
    p.vx = Math.cos(a) * spd
    p.vy = Math.sin(a) * spd - 3
    p.life = 0.2 + fastRand() * 0.4
    p.color = fastRand() > 0.5 ? '#FFF' : '#FFD700'
    p.size = 1 + fastRand() * 2
    ui.particles.push(p)
  }

  // 4) dust cloud (slow floating)
  for (let i = 0; i < Math.ceil(50 * scale); i++) {
    const p = allocParticle()
    p.x = cx + (fastRand() - 0.5) * rs
    p.y = cy + (fastRand() - 0.5) * rs * 0.7
    p.vx = (fastRand() - 0.5) * 1.5
    p.vy = -fastRand() * 2 - 0.5
    p.life = 0.5 + fastRand() * 0.6
    p.color = 'rgba(180,160,140,0.4)'
    p.size = 4 + fastRand() * 6
    ui.particles.push(p)
  }

  // 5) ring burst — evenly spaced fast particles
  for (let i = 0; i < Math.ceil(40 * scale); i++) {
    const a = (i / 20) * Math.PI * 2 + fastRand() * 0.15
    const spd = 6 + fastRand() * 4
    const p = allocParticle()
    p.x = cx
    p.y = cy
    p.vx = Math.cos(a) * spd
    p.vy = Math.sin(a) * spd
    p.life = 0.15 + fastRand() * 0.15
    p.color = fastRand() > 0.5 ? c.vein : '#FFF'
    p.size = 2 + fastRand() * 2
    ui.particles.push(p)
  }
}

function updParticles(dt) {
  const ps = ui.particles
  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i]
    p.x += p.vx
    p.y += p.vy
    if (p.grav !== 0) p.vy += 0.15
    p.life -= dt * 2.5
    if (p.life <= 0) {
      ps.splice(i, 1)
      freeParticle(p)
    }
  }
  for (let i = ui.coinTexts.length - 1; i >= 0; i--) {
    const c = ui.coinTexts[i]
    c.y += c.vy
    c.life -= dt * 1.5
    if (c.life <= 0) ui.coinTexts.splice(i, 1)
  }
}

module.exports = { allocParticle, spawnP, spawnCoin, spawnRockBreak, updParticles }
