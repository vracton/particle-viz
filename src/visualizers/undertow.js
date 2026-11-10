const vertexSource = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;
uniform vec4 uBands;
uniform vec3 uAccent;

void main() {
  // Each depth plane is sampled along the same perspective ray.
  vec2 ray = (2.0 * gl_FragCoord.xy - uResolution) / min(uResolution.x, uResolution.y);
  float t = uTime;
  float bass = uBands.x;
  float lowMid = uBands.y;
  float highMid = uBands.z;
  float treble = uBands.w;

  vec3 ink = vec3(0.010, 0.027, 0.062);
  vec3 jade = mix(vec3(0.025, 0.60, 0.54), uAccent, 0.62);
  vec3 orchid = mix(vec3(0.62, 0.16, 0.70), uAccent.brg, 0.30);
  vec3 coral = mix(vec3(1.0, 0.32, 0.14), uAccent.gbr, 0.22);
  vec3 pearl = vec3(0.48, 0.90, 1.0);
  vec3 light = ink * (1.45 - 0.60 * smoothstep(0.1, 1.8, dot(ray, ray)));

  // Composite six translucent surfaces from far to near. Different rates and
  // projected sizes give depth without rotating or pulsing the camera.
  for (int layer = 0; layer < 6; layer++) {
    float z = float(layer) / 5.0;
    vec2 p = ray * mix(1.42, 0.85, z);
    p = vec2(0.88 * p.x + 0.475 * p.y, -0.475 * p.x + 0.88 * p.y);
    p.y += (z - 0.5) * 0.87;
    float flow = t * (0.40 + 0.16 * z) + z * 5.2;
    float x = p.x;
    float surge = sin(2.45 * x - flow);
    float broadFold = (0.22 + 0.31 * bass) * surge;
    float eddy = sin(6.1 * x + 5.3 * p.y + 1.4 * surge + 1.3 * flow);
    float y = p.y + broadFold + (0.09 + 0.23 * lowMid) * eddy;
    float spread = (0.22 + 0.055 * z) * (0.8 + 0.2 * sin(2.3 * x + flow));
    float section = y / spread;
    float body = exp(-section * section);
    float fold = sin(12.0 * y + 2.9 * x + flow + 1.8 * eddy);
    float ribbons = pow(max(0.0, 0.50 + 0.50 * fold), 5.0);
    float pitch = 26.0 + 18.0 * highMid;
    float threads = sin(pitch * y + 8.5 * x - 2.8 * flow + 2.4 * eddy);
    threads = pow(max(0.0, 0.5 + 0.5 * threads), 9.0);
    float sparks = pow(max(0.0, 0.5 + 0.5 * sin(37.0 * x - 5.0 * flow + 7.0 * eddy)), 14.0);
    float iridescence = 0.5 + 0.5 * sin(3.8 * x - 4.2 * y + flow + 0.8 * fold);
    vec3 tint = mix(jade, orchid, iridescence);
    tint = mix(tint, coral, (0.22 + 0.40 * highMid) * smoothstep(0.05, 0.95, eddy));

    float ends = 1.0 - smoothstep(0.42, 1.86, abs(x + 0.13 * surge));
    float opacity = (0.18 + 0.22 * z) * body * ends;
    vec3 surface = tint * (0.25 + 1.04 * ribbons);
    surface += mix(tint, pearl, 0.67) * threads * (0.12 + 0.88 * highMid);
    surface += pearl * sparks * threads * (0.09 + 1.30 * treble);
    light = mix(light, surface, opacity);
    light += tint * body * ends * (0.045 + 0.09 * ribbons);
  }

  light = 1.0 - exp(-light * 1.55);
  gl_FragColor = vec4(pow(max(light, vec3(0.0)), vec3(0.84)), 1.0);
}
`;

// Peak levels keep a narrow tone visible even inside a broad band. The array
// belongs to this renderer; the host's borrowed spectrum is read only here.
function readBands(bands, spectrum, fftSize, sampleRate) {
  bands.fill(0);
  if (!spectrum || !(fftSize > 0) || !(sampleRate > 0)) return;
  const hzPerBin = sampleRate / fftSize;
  for (let i = 1; i < spectrum.length; i++) {
    const db = spectrum[i];
    if (!Number.isFinite(db) || db <= -74) continue;
    const hz = i * hzPerBin;
    const band = hz < 180 ? 0 : hz < 1100 ? 1 : hz < 4800 ? 2 : 3;
    const level = Math.min(1, (db + 74) / 52);
    bands[band] = Math.max(bands[band], level * level);
  }
}

export const undertow = {
  id: 'undertow',
  name: 'Undertow',
  description: 'Translucent currents fold through a deep field of color.',
  authorModel: 'OpenAI Codex',
  create(canvas) {
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) throw new Error('Undertow requires WebGL.');

    let program = null;
    let buffer = null;
    let disposed = false;
    const shaders = [];
    function dispose() {
      if (disposed) return;
      disposed = true;
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      for (const shader of shaders) gl.deleteShader(shader);
    }
    function compile(type, source) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Undertow could not allocate a shader.');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`Undertow shader: ${gl.getShaderInfoLog(shader) || 'compilation failed'}`);
      }
      return shader;
    }

    try {
      const vertex = compile(gl.VERTEX_SHADER, vertexSource);
      const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
      program = gl.createProgram();
      if (!program) throw new Error('Undertow could not allocate a program.');
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`Undertow program: ${gl.getProgramInfoLog(program) || 'linking failed'}`);
      }

      const position = gl.getAttribLocation(program, 'aPosition');
      const resolution = gl.getUniformLocation(program, 'uResolution');
      const time = gl.getUniformLocation(program, 'uTime');
      const bandsLocation = gl.getUniformLocation(program, 'uBands');
      const accent = gl.getUniformLocation(program, 'uAccent');
      if (position < 0 || resolution === null || time === null || bandsLocation === null || accent === null) {
        throw new Error('Undertow could not bind shader inputs.');
      }

      buffer = gl.createBuffer();
      if (!buffer) throw new Error('Undertow could not allocate geometry.');
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      if (gl.getError() !== gl.NO_ERROR) throw new Error('Undertow could not upload geometry.');

      const bands = new Float32Array(4);
      return {
        render(inputs) {
          if (disposed || gl.isContextLost()) return;
          readBands(bands, inputs.spectrum, inputs.fftSize, inputs.sampleRate);
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.disable(gl.BLEND);
          gl.disable(gl.DEPTH_TEST);
          gl.disable(gl.CULL_FACE);
          gl.disable(gl.SCISSOR_TEST);
          gl.colorMask(true, true, true, true);
          gl.useProgram(program);
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.enableVertexAttribArray(position);
          gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
          gl.uniform2f(resolution, canvas.width, canvas.height);
          gl.uniform1f(time, Number.isFinite(inputs.time) ? inputs.time : 0);
          gl.uniform4fv(bandsLocation, bands);
          gl.uniform3fv(accent, inputs.accent);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        },
        dispose,
      };
    } catch (error) {
      dispose();
      throw error;
    }
  },
};
