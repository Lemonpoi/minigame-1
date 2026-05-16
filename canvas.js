const canvas = wx.createCanvas()
const ctx = canvas.getContext('2d')
const sys = wx.getSystemInfoSync()
const W = sys.windowWidth
const H = sys.windowHeight
const dpr = sys.pixelRatio
canvas.width = W * dpr
canvas.height = H * dpr
ctx.scale(dpr, dpr)

module.exports = { canvas, ctx, W, H, dpr }
