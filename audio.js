let audioCtx = null

function initAudio() {
  if (audioCtx) return
  try {
    audioCtx = wx.createWebAudioContext()
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
  } catch (e) {
    console.error('audio init', e)
  }
}

function playHit() {
  try {
    if (!audioCtx) return
    const o = audioCtx.createOscillator()
    const g = audioCtx.createGain()
    o.type = 'square'
    o.frequency.setValueAtTime(1200, audioCtx.currentTime)
    o.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.04)
    g.gain.setValueAtTime(0.08, audioCtx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06)
    o.connect(g).connect(audioCtx.destination)
    o.start(audioCtx.currentTime)
    o.stop(audioCtx.currentTime + 0.06)
  } catch (e) {}
}

function playBreak() {
  try {
    if (!audioCtx) return
    const o1 = audioCtx.createOscillator()
    const g1 = audioCtx.createGain()
    o1.type = 'sawtooth'
    o1.frequency.setValueAtTime(200, audioCtx.currentTime)
    o1.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.35)
    g1.gain.setValueAtTime(0.15, audioCtx.currentTime)
    g1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35)
    o1.connect(g1).connect(audioCtx.destination)
    o1.start(audioCtx.currentTime)
    o1.stop(audioCtx.currentTime + 0.35)
    const o2 = audioCtx.createOscillator()
    const g2 = audioCtx.createGain()
    o2.type = 'triangle'
    o2.frequency.setValueAtTime(500, audioCtx.currentTime + 0.05)
    o2.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.25)
    g2.gain.setValueAtTime(0.08, audioCtx.currentTime + 0.05)
    g2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25)
    o2.connect(g2).connect(audioCtx.destination)
    o2.start(audioCtx.currentTime + 0.05)
    o2.stop(audioCtx.currentTime + 0.25)
  } catch (e) {}
}

module.exports = { playHit, playBreak, initAudio }
