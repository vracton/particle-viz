import './style.css';
import { orbitField } from './visualizers/orbit-field.js';
import { formatTime, seekTime, colorRGB } from './audio-utils.js';

const $ = id => document.getElementById(id);
const audio = $('audio'), canvas = $('canvas');
// Day 1 uses one trusted module. The host owns audio; modules only render.
const visualizers = [orbitField];
const selected = visualizers[0];
$('model').textContent = selected.authorModel;
let renderer, context, analyser, source, bins, objectURL, frame, failed = false;
let accent = colorRGB($('accent').value);
let visualTime = 0, previousTime, trackGeneration = 0;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const status = text => { $('status').textContent = text; };
function updateTransport() {
  $('play').textContent = audio.paused ? '▶' : 'Ⅱ';
  $('play').setAttribute('aria-label', audio.paused ? 'Play' : 'Pause');
  $('mode').textContent = audio.paused ? 'IDLE FIELD' : 'AUDIO REACTIVE';
}
function updateProgress() {
  const valid = Number.isFinite(audio.duration) && audio.duration > 0;
  $('seek').disabled = !valid;
  $('seek').value = valid ? audio.currentTime / audio.duration * 100 : 0;
  $('elapsed').textContent = formatTime(audio.currentTime);
  $('duration').textContent = formatTime(audio.duration);
}
$('file').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  trackGeneration++;
  audio.pause();
  audio.removeAttribute('src'); audio.load();
  if (objectURL) URL.revokeObjectURL(objectURL);
  objectURL = URL.createObjectURL(file); audio.src = objectURL;
  $('track-name').textContent = file.name;
  $('play').disabled = true;
  status('Loading local audio…'); updateProgress(); updateTransport();
  event.target.value = '';
});
audio.addEventListener('loadedmetadata', () => {
  $('play').disabled = false; updateProgress(); status('Ready. Your audio stays on this device.');
});
audio.addEventListener('error', () => {
  $('play').disabled = true; $('seek').disabled = true;
  status('This file could not be played. Open another audio file.');
});
$('play').addEventListener('click', async () => {
  if (!audio.paused) {
    audio.pause(); updateTransport();
    status('Paused. Press Play to continue.');
    return;
  }
  const generation = trackGeneration;
  $('play').disabled = true;
  try {
    if (!context) {
      context = new AudioContext();
      analyser = context.createAnalyser(); analyser.fftSize = 256;
      source = context.createMediaElementSource(audio);
      source.connect(analyser); analyser.connect(context.destination);
      bins = new Uint8Array(analyser.frequencyBinCount);
    }
    await context.resume();
    if (generation !== trackGeneration) return;
    await audio.play();
    if (generation !== trackGeneration) return;
    status('Playing locally. Nothing is uploaded.');
  } catch {
    if (generation === trackGeneration) status('Playback could not start. Try Play again or open another file.');
  } finally {
    if (generation === trackGeneration) {
      $('play').disabled = Boolean(audio.error) || audio.readyState < HTMLMediaElement.HAVE_METADATA;
      updateTransport();
    }
  }
});
for (const name of ['play', 'pause', 'ended']) audio.addEventListener(name, updateTransport);
// Status follows explicit user intent; queued media events can belong to an old source.
audio.addEventListener('ended', () => status('Track finished. Press Play to listen again.'));
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('durationchange', updateProgress);
$('seek').addEventListener('input', event => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) audio.currentTime = seekTime(Number(event.target.value), audio.duration);
  updateProgress();
});
$('accent').addEventListener('input', event => {
  accent = colorRGB(event.target.value);
  document.documentElement.style.setProperty('--accent', event.target.value);
  $('hex').textContent = event.target.value.toUpperCase();
});
function rendererError(message) {
  failed = true; cancelAnimationFrame(frame);
  $('renderer').textContent = 'WEBGL UNAVAILABLE';
  $('hint').textContent = message;
}
try { renderer = selected.create(canvas); }
catch (error) { rendererError(error.message); }
canvas.addEventListener('webglcontextlost', event => {
  event.preventDefault(); rendererError('Graphics context lost. Waiting for the browser to restore it…');
});
canvas.addEventListener('webglcontextrestored', () => {
  try {
    renderer?.dispose();
    renderer = selected.create(canvas);
    failed = false; previousTime = undefined;
    $('renderer').textContent = 'WEBGL / PARTICLE STUDY';
    $('hint').textContent = 'Open a track to bring the field to life.';
    frame = requestAnimationFrame(render);
  } catch (error) { rendererError(error.message); }
});
function render(now) {
  if (failed) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(canvas.clientWidth*dpr));
  const height = Math.max(1, Math.round(canvas.clientHeight*dpr));
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const delta = previousTime === undefined ? 0 : Math.min((now-previousTime)/1000, 0.1);
  previousTime = now;
  if (!reducedMotion.matches) visualTime += delta;
  let energy = 0;
  if (analyser && !audio.paused) {
    analyser.getByteFrequencyData(bins);
    energy = bins.subarray(0, 12).reduce((a, b) => a+b, 0) / (12*255);
  }
  renderer.render({ time: visualTime, energy: reducedMotion.matches ? 0 : energy, accent, dpr });
  frame = requestAnimationFrame(render);
}
if (!failed) frame = requestAnimationFrame(render);
window.addEventListener('pagehide', event => {
  audio.pause();
  if (event.persisted) return;
  cancelAnimationFrame(frame); renderer?.dispose();
  context?.close(); if (objectURL) URL.revokeObjectURL(objectURL);
});
