import test from 'node:test';
import assert from 'node:assert/strict';
import { formatTime, seekTime, colorRGB } from './audio-utils.js';
test('unknown audio metadata never yields invalid transport values', () => {
  for (const duration of [NaN, Infinity, 0, -10]) {
    assert.equal(seekTime(50, duration), 0);
    assert.equal(formatTime(duration), '0:00');
  }
});
test('seek clamps to the track boundaries', () => {
  assert.equal(seekTime(-10, 240), 0);
  assert.equal(seekTime(150, 240), 240);
  assert.equal(seekTime(25, 240), 60);
});
test('time and shared color conversion', () => {
  assert.equal(formatTime(125.9), '2:05');
  assert.deepEqual(colorRGB('#ff0080'), [1, 0, 128/255]);
});
