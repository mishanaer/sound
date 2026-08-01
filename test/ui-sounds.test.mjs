import assert from "node:assert/strict";
import test from "node:test";

let importCount = 0;

async function loadSound({ reduce = false, state = "running", throws = false } = {}) {
  const instances = [];

  globalThis.window = {
    matchMedia: () => ({ matches: reduce }),
  };

  globalThis.AudioContext = class AudioContext {
    constructor() {
      if (throws) throw new Error("Web Audio unavailable");
      this.sampleRate = 48_000;
      this.currentTime = 1;
      this.destination = {};
      this.state = state;
      this.resumed = false;
      this.sources = [];
      this.started = 0;
      instances.push(this);
    }

    createBuffer(_channels, sampleCount) {
      return { getChannelData: () => new Float32Array(sampleCount) };
    }

    createBiquadFilter() {
      const filter = { frequency: {}, Q: {}, disconnect() {} };
      filter.connect = () => filter;
      return filter;
    }

    createGain() {
      const gain = { gain: {}, disconnect() {} };
      gain.connect = () => gain;
      return gain;
    }

    createBufferSource() {
      const source = { disconnect() {}, start: () => { this.started += 1; } };
      source.connect = () => source;
      this.sources.push(source);
      return source;
    }

    resume() {
      this.resumed = true;
    }
  };

  const module = await import(`../assets/ui-sounds.js?test=${importCount++}`);
  return { instances, playUISound: module.playUISound };
}

test("plays every bundled preset with one lazy audio context", async () => {
  const { instances, playUISound } = await loadSound();

  for (const preset of ["press", "click", "tap", "hover", "select", "toggle", "tick"]) {
    playUISound(preset);
  }

  assert.equal(instances.length, 1);
  assert.equal(instances[0].sources.length, 9);
  assert.equal(instances[0].started, 9);
});

test("does not play when reduced motion is enabled", async () => {
  const { instances, playUISound } = await loadSound({ reduce: true });

  playUISound("tap");

  assert.equal(instances.length, 0);
});

test("resumes a suspended context", async () => {
  const { instances, playUISound } = await loadSound({ state: "suspended" });

  playUISound("click");

  assert.equal(instances[0].resumed, true);
});

test("swallows unavailable Web Audio failures", async () => {
  const { playUISound } = await loadSound({ throws: true });

  assert.doesNotThrow(() => playUISound("tap"));
});
