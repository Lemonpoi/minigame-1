const { LAYERS, PICK_BASE, PICK_GROW, SAVE_INT, OFF_EFF, CHAR_SKINS, PICK_SKINS } = require('./data')

const state = {
  gold: 5,
  ore: 0,
  pickLv: 1,
  layer: 0,
  maxLayer: 0,
  bonusLv: 0,
  offlineCap: 1,
  saveTime: Date.now(),
  offline: null,
  swingSpd: 1,
  skins: { char: [0, 0, 0, 0, 0, 0], pick: [0, 0, 0, 0, 0, 0, 0], charEq: 0, pickEq: 0 },
  tutorialDone: false,
  gachaPulls: 0,
  gachaFirst10: true,
  gachaHistory: [],
}

const ui = {
  swing: 0,
  particles: [],
  coinTexts: [],
  prog: 0,
  swingTimer: 0,
  showLayers: false,
  showShop: false,
  firefly: null,
  dragon: null,
  buffAtk: 1,
  buffSpd: 1,
  buffTimer: 0,
  activeBuffs: [],
  flyTimer: 0,
  bgTime: 0,
  drips: [],
  toasts: [],
  debugTouch: null,
  _toastY: 0,
  btns: [],
  layerRows: null,
  closeLayerBtn: null,
  claim: null,
  shopPw: 0, shopPy: 0, shopPx: 0,
  shopTab: 0,
  shopRows: null,
  shopClose: null,
  shopScroll: 0,
  offlineAnim: null,
  offlineReward: null,
  rockShake: 0,
  shockwave: null,
  confirm: null,
  showTutorial: false,
  tutorialStep: 0,
  showGacha: false,
  showGachaHistory: false,
  gachaAnim: null,
  _lastBreak: 0,
  excalibur: null,
  drinkTimer: 0,
  isDrinking: false,
}

function skinBonus(type) {
  const s = CHAR_SKINS[state.skins.charEq] || CHAR_SKINS[0]
  const p = PICK_SKINS[state.skins.pickEq] || PICK_SKINS[0]
  if (type === 'atk') return (s.atk + p.atk) / 100
  if (type === 'spd') return (s.spd + p.spd) / 100
  if (type === 'inc') return (s.inc + p.inc) / 100
  return 0
}

function pickPower() {
  return (2.5 + (state.pickLv - 1) * 0.5) * (1 + skinBonus('atk')) * ui.buffAtk
}

function rockReward() {
  return Math.floor(LAYERS[state.layer].rockGold * bonusMult())
}

function bonusMult() {
  return (1 + state.bonusLv * 0.05) * (1 + skinBonus('inc'))
}

function bonusCost() {
  return Math.floor(15 * Math.pow(1.2, state.bonusLv))
}

function upgradeBonus() {
  if (state.bonusLv >= 200) { return false }
  const c = bonusCost()
  if (state.gold >= c) { state.gold -= c; state.bonusLv++; return true }
  return false
}

function offlineCapSec() {
  return (2 + (state.offlineCap - 1) * 0.5) * 3600
}

function offlineCapCost() {
  return Math.floor(50 * Math.pow(1.3, state.offlineCap - 1))
}

function upgradeOfflineCap() {
  if (state.offlineCap >= 200) return false
  const c = offlineCapCost()
  if (state.gold >= c) { state.gold -= c; state.offlineCap++; return true }
  return false
}

function pickCost() {
  return Math.floor(PICK_BASE * Math.pow(PICK_GROW, state.pickLv - 1))
}

function swingSpeed() {
  return (0.4 + (state.swingSpd - 1) * 0.1) * (1 + skinBonus('spd')) * ui.buffSpd
}

function swingSpdCost() {
  return Math.floor(8 * Math.pow(1.15, state.swingSpd - 1))
}

function upgradeSwingSpd() {
  if (state.swingSpd >= 200) return false
  const c = swingSpdCost()
  if (state.gold >= c) { state.gold -= c; state.swingSpd++; return true }
  return false
}

function unlockLayer(idx) {
  const l = LAYERS[idx]
  if (!l || idx !== state.maxLayer + 1) return false
  if (state.gold >= l.unlockGold) { state.gold -= l.unlockGold; state.maxLayer = idx; return true }
  return false
}

function upgradePick() {
  if (state.pickLv >= 200) return false
  const c = pickCost()
  if (state.gold >= c) { state.gold -= c; state.pickLv++; return true }
  return false
}

function claimOffline() {
  if (state.offline) {
    state.gold += state.offline.gold
    state.ore += state.offline.ore
    state.offline = null
  }
}

function calcOffline() {
  if (state.offline) return
  const sec = Math.min(Math.floor((Date.now() - state.saveTime) / 1000), offlineCapSec())
  if (sec <= 5) return
  const l = LAYERS[state.layer]
  const swings = Math.floor(sec * swingSpeed() * OFF_EFF)
  const rocks = Math.floor(swings * pickPower() / l.rockHP)
  const gold = rocks * l.rockGold
  const ore = l.rockOre > 0 ? Math.floor(rocks * 0.6 * l.rockOre) : 0
  if (gold > 0 || ore > 0) state.offline = { gold, ore, sec }
}

const SAVE_KEYS = ['gold','ore','pickLv','layer','maxLayer','bonusLv','offlineCap','saveTime','swingSpd','skins','tutorialDone']

function save() {
  try {
    state.saveTime = Date.now()
    const data = {}
    for (const k of SAVE_KEYS) data[k] = state[k]
    wx.setStorage({ key: 'miner_data', data: JSON.stringify(data) })
  } catch (e) {
    console.error('save', e)
  }
}

function load() {
  try {
    const raw = wx.getStorageSync('miner_data')
    if (raw) {
      const d = JSON.parse(raw)
      if (d && typeof d.pickLv === 'number' && d.pickLv > 0 && d.pickLv < 1000) {
        for (const k of SAVE_KEYS) {
          if (k in d) state[k] = d[k]
        }
      }
    }
  } catch (e) {
    console.error('load', e)
  }
  if (!state.maxLayer || state.maxLayer < 0 || state.maxLayer > 8) state.maxLayer = 0
  if (!state.skins || typeof state.skins.charEq !== 'number') {
    state.skins = { char: [0, 0, 0, 0, 0, 0], pick: [0, 0, 0, 0, 0, 0, 0], charEq: 0, pickEq: 0 }
  }
  if (typeof state.bonusLv !== 'number' || state.bonusLv < 0) state.bonusLv = 0
  if (typeof state.offlineCap !== 'number' || state.offlineCap < 1) state.offlineCap = 1
  if (typeof state.swingSpd !== 'number' || state.swingSpd < 1) state.swingSpd = 1
  if (typeof state.layer !== 'number' || state.layer < 0 || state.layer > 8) state.layer = 0
  if (!Array.isArray(state.gachaHistory)) state.gachaHistory = []
  state.offline = null
  Object.assign(ui, {
    particles: [], coinTexts: [], swing: 0, prog: 0, bgTime: 0,
    swingTimer: 0, showLayers: false, showShop: false,
    firefly: null, dragon: null, flyTimer: 0, buffTimer: 0, buffAtk: 1, buffSpd: 1, activeBuffs: [], _lastBreak: 0, shopScroll: 0,
    showGacha: false, showGachaHistory: false, gachaHistoryPage: 0, gachaAnim: null,
    rockShake: 0, shockwave: null, confirm: null, excalibur: null, drinkTimer: 0, isDrinking: false,
  })
}

function addToast(text, life) {
  ui.toasts.push({ text, life: life || 1.2, y: ui._toastY || 0 })
}

function updToasts(dt) {
  for (let i = ui.toasts.length - 1; i >= 0; i--) {
    ui.toasts[i].life -= dt
    if (ui.toasts[i].life <= 0) ui.toasts.splice(i, 1)
  }
}

function recalcBuffs() {
  let a = 1, s = 1
  for (const b of ui.activeBuffs) { a *= b.atk; s *= b.spd }
  ui.buffAtk = a
  ui.buffSpd = s
  ui.buffTimer = ui.activeBuffs.length > 0 ? Math.max(...ui.activeBuffs.map(b => b.rem)) : 0
}

module.exports = {
  state, ui,
  skinBonus, pickPower, rockReward, bonusMult, bonusCost,
  upgradeBonus, offlineCapSec, offlineCapCost, upgradeOfflineCap,
  pickCost, swingSpeed, swingSpdCost, upgradeSwingSpd,
  unlockLayer, upgradePick, claimOffline, calcOffline,
  save, load, addToast, updToasts,
  recalcBuffs,
}
