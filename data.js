const LAYERS = [
  { name: '地表层', oreName: '碎石', bg: '#4a7a3a', rock: '#8B7355', vein: '#A0896C', unlockGold: 0, mult: 1, oChance: 0.05, rockHP: 30, rockGold: 4, rockOre: 1 },
  { name: '青石浅层', oreName: '青石碎片', bg: '#3a5a6a', rock: '#6B7B8B', vein: '#8EB0C0', unlockGold: 500, mult: 2, oChance: 0.08, rockHP: 168, rockGold: 10, rockOre: 1 },
  { name: '灰铁岩层', oreName: '铁矿石', bg: '#2a2a2a', rock: '#7A6A5A', vein: '#C0B0A0', unlockGold: 2000, mult: 3, oChance: 0.12, rockHP: 312, rockGold: 25, rockOre: 2 },
  { name: '月光晶层', oreName: '月光晶石', bg: '#1a1a3a', rock: '#5A6A8A', vein: '#A0C0E0', unlockGold: 8000, mult: 5, oChance: 0.18, rockHP: 456, rockGold: 55, rockOre: 2 },
  { name: '水晶矿层', oreName: '水晶', bg: '#0a1a2a', rock: '#7AB8D4', vein: '#E0F0FF', unlockGold: 30000, mult: 8, oChance: 0.25, rockHP: 600, rockGold: 120, rockOre: 3 },
  { name: '烈焰矿层', oreName: '烈焰之心', bg: '#1a0a0a', rock: '#B8441A', vein: '#FF8040', unlockGold: 100000, mult: 12, oChance: 0.33, rockHP: 744, rockGold: 280, rockOre: 3 },
  { name: '星纹远古层', oreName: '远古星石', bg: '#0a0a1a', rock: '#4A3A6A', vein: '#C080FF', unlockGold: 350000, mult: 18, oChance: 0.42, rockHP: 888, rockGold: 650, rockOre: 4 },
  { name: '虚空深岩层', oreName: '虚空碎片', bg: '#050510', rock: '#2A2A4A', vein: '#6060C0', unlockGold: 1200000, mult: 25, oChance: 0.52, rockHP: 1032, rockGold: 1500, rockOre: 5 },
  { name: '地心终极层', oreName: '地心熔核', bg: '#0a0505', rock: '#5A2A0A', vein: '#FF6030', unlockGold: 5000000, mult: 35, oChance: 0.65, rockHP: 1176, rockGold: 4000, rockOre: 6 },
]
const PICK_BASE = 5
const PICK_GROW = 1.15
const SAVE_INT = 5000
const OFF_EFF = 0.5

const BUFFS = [
  { atk: 1, spd: 2, label: '挖矿速度×2' },
  { atk: 2, spd: 1, label: '攻击力×2' },
  { atk: 1, spd: 5, label: '挖矿速度×5' },
  { atk: 1, spd: 10, label: '挖矿速度×10' },
  { atk: 5, spd: 1, label: '攻击力×5' },
  { atk: 10, spd: 1, label: '攻击力×10' },
]

const CHAR_SKINS = [
  { name: '普通矿工', cost: 0, atk: 0, spd: 0, inc: 0, color: '#4A90D9' },
  { name: '青石矿工', cost: 1000, atk: 3, spd: 0, inc: 0, color: '#5A8AAA' },
  { name: '月光矿工', cost: 2500, atk: 0, spd: 3, inc: 0, color: '#8AB0D0' },
  { name: '烈焰矿工', cost: 5000, atk: 3, spd: 0, inc: 2, color: '#D06030' },
  { name: '星纹矿工', cost: 10000, atk: 0, spd: 2, inc: 3, color: '#9070C0' },
  { name: '虚空矿工', cost: 20000, atk: 2, spd: 2, inc: 2, color: '#6040A0' },
]
const PICK_SKINS = [
  { name: '普通稿子', cost: 0, atk: 0, spd: 0, inc: 0, color: '#A0A0A0' },
  { name: '青石镐', cost: 1000, atk: 3, spd: 0, inc: 0, color: '#7A9AAA' },
  { name: '月光镐', cost: 2500, atk: 0, spd: 3, inc: 0, color: '#A0C8E8' },
  { name: '水晶镐', cost: 5000, atk: 0, spd: 0, inc: 3, color: '#C0E8F8' },
  { name: '烈焰镐', cost: 10000, atk: 2, spd: 2, inc: 0, color: '#E08040' },
  { name: '地心镐', cost: 20000, atk: 3, spd: 0, inc: 2, color: '#E0B040' },
  { name: 'EX咖喱棒', cost: 88888888, atk: 50, spd: 50, inc: 50, color: '#FFD700' },
]

const CHAR_COLORS = [
  { body: '#4A90D9', bodyS: '#3a7ac9', bodyP: '#3a6aa9', hat: '#8B4513', hatS: '#6B3510', pants: '#4a3a2a', boots: '#3a2a1a' },
  { body: '#3A7A8A', bodyS: '#2A6A7A', bodyP: '#2A5A6A', hat: '#4A6A7A', hatS: '#3A5A6A', pants: '#3a3a3a', boots: '#2a2a2a' },
  { body: '#6AA0C0', bodyS: '#5A90B0', bodyP: '#4A80A0', hat: '#8AB8D8', hatS: '#7AA8C8', pants: '#4a4a5a', boots: '#3a3a4a' },
  { body: '#D06030', bodyS: '#C05020', bodyP: '#A04010', hat: '#A04020', hatS: '#803010', pants: '#4a2a1a', boots: '#3a1a0a' },
  { body: '#7050A0', bodyS: '#604090', bodyP: '#503080', hat: '#503080', hatS: '#402070', pants: '#3a2a4a', boots: '#2a1a3a' },
  { body: '#403070', bodyS: '#302060', bodyP: '#201050', hat: '#302050', hatS: '#201040', pants: '#2a1a3a', boots: '#1a0a2a' },
]
const PICK_COLORS = [
  { handle: '#8B4513', wrap: '#6B3510', head: '#A0A0A0', tip: '#C0C0C0', flat: '#909090' },
  { handle: '#5A7A6A', wrap: '#4A6A5A', head: '#7A9AAA', tip: '#9ABACA', flat: '#6A8A9A' },
  { handle: '#6A8A9A', wrap: '#5A7A8A', head: '#A0C8E8', tip: '#C0E8FF', flat: '#90B8D8' },
  { handle: '#7AAAAA', wrap: '#6A9A9A', head: '#C0E8F8', tip: '#E0F8FF', flat: '#B0D8E8' },
  { handle: '#8A4020', wrap: '#7A3010', head: '#E08040', tip: '#F09050', flat: '#D07030' },
  { handle: '#7A5020', wrap: '#6A4010', head: '#E0B040', tip: '#F0C050', flat: '#D0A030' },
  { handle: '#8B6914', wrap: '#6B4914', head: '#FFD700', tip: '#FFF8DC', flat: '#DAA520' },
]

const GROUND_COLORS = [
  ['#5a7a3a','#6a8a4a','#4a6a2a'],
  ['#2a3a4a','#3a5a6a','#2a4a5a'],
  ['#2a2a2a','#4a4a4a','#3a3a3a'],
  ['#1a2a3a','#3a5a7a','#2a4a6a'],
  ['#1a2a3a','#4a7a9a','#2a5a7a'],
  ['#1a0a0a','#3a1a0a','#2a1008'],
  ['#1a102a','#3a2a5a','#2a1a3a'],
  ['#0a0a15','#1a1a3a','#101025'],
  ['#0a0505','#2a1008','#1a0805'],
]

const DUST_COLORS = ['#c8b89a','#8EB0C0','#C0B0A0','#A0C0E0','#E0F0FF','#FF8040','#C080FF','#6060C0','#FF6030']

const VEIN_RGB = LAYERS.map(l => {
  const r = parseInt(l.vein.slice(1, 3), 16)
  const g = parseInt(l.vein.slice(3, 5), 16)
  const b = parseInt(l.vein.slice(5, 7), 16)
  return { r, g, b }
})

module.exports = {
  LAYERS, PICK_BASE, PICK_GROW, SAVE_INT, OFF_EFF,
  BUFFS, CHAR_SKINS, PICK_SKINS, CHAR_COLORS, PICK_COLORS,
  GROUND_COLORS, DUST_COLORS, VEIN_RGB,
}
