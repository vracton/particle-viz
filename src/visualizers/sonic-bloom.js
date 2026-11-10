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
uniform float uEnergy;
uniform vec3 uAccent;

mat2 turn(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

// Three bounded domain folds create flowing membranes rather than rigid shells.
vec3 foldSpace(vec3 p, float t) {
  float scale = 1.0;
  for (int j = 0; j < 3; j++) {
    p += (0.16 + 0.07 * uEnergy) / scale *
      sin(p.yzx * (2.8 * scale) + t * vec3(0.63, -0.47, 0.38));
    p.xy = turn(0.36) * p.xy;
    scale *= 1.65;
  }
  return p;
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - uResolution) / max(uResolution.y, 1.0);
  float t = uTime * 0.28;
  vec3 ray = normalize(vec3(uv, -2.65));
  vec3 origin = vec3(0.0, 0.0, 4.15);
  vec3 color = vec3(0.003, 0.005, 0.016);
  float transmission = 1.0;
  float stepSize = 0.105;
  float expansion = 1.0 + 0.19 * uEnergy;
  vec3 base = max(uAccent, vec3(0.025));
  vec3 companion = mix(base.brg, vec3(0.16, 0.42, 0.95), 0.45);

  // Fixed front-to-back volume integration: no unstable distance-field steps.
  for (int i = 0; i < 36; i++) {
    float travel = 2.25 + float(i) * stepSize;
    vec3 p = (origin + ray * travel) / expansion;
    p.xz = turn(t * 0.22) * p.xz;
    p.yz = turn(-0.22) * p.yz;
    vec3 q = foldSpace(p, t);
    float radius = length(p);
    float angle = atan(q.y, q.x);
    float swirl = 3.0 * angle + 2.5 * q.z - t;
    float petal = sin(swirl + 1.4 * sin(q.z * 3.0 + t * 0.7));
    float shell = length(q) - (0.92 + 0.16 * petal);
    float crease = sin(10.0 * shell + 1.5 * sin(swirl));
    float membrane = exp(-abs(shell) * 22.0);
    float innerFold = exp(-abs(shell + 0.25 + 0.10 * crease) * 35.0) * 0.48;
    float envelope = 1.0 - smoothstep(1.22, 1.68, radius);
    float density = (membrane + innerFold) * envelope;
    float veins = pow(0.5 + 0.5 * sin(36.0 * shell + swirl * 2.0 + t), 6.0);
    float hue = 0.5 + 0.5 * sin(swirl * 0.7 + q.z * 3.0 + shell * 9.0);
    vec3 ink = mix(base, companion, hue * 0.82);
    // Near-white grazing threads give the folds a wet, translucent edge.
    ink += vec3(0.38, 0.48, 0.58) * veins * (0.45 + uEnergy);
    float light = 0.65 + 0.65 * smoothstep(-1.0, 1.0, q.y - q.z);
    float opacity = 1.0 - exp(-density * stepSize * 4.5);
    color += transmission * opacity * ink * light * (1.3 + 1.6 * uEnergy);
    transmission *= 1.0 - opacity * 0.82;
    // Broad low-density glow joins the separated folds into a luminous volume.
    color += transmission * ink * exp(-radius * radius * 2.5) * 0.007;
  }
  float halo = exp(-dot(uv, uv) * 1.1);
  color += base * halo * 0.024;
  color = vec3(1.0) - exp(-color * 1.35);
  color = pow(max(color, vec3(0.0)), vec3(0.88));
  color *= 1.0 - 0.22 * smoothstep(0.4, 2.1, length(uv));
  gl_FragColor = vec4(color, 1.0);
}
`;

export const sonicBloom = {
  id: 'sonic-bloom',
  name: 'Sonic Bloom',
  description: 'Luminous liquid folds bloom through an iridescent volume.',
  authorModel: 'GPT-6.1 Sol',
  create(canvas) {
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) throw new Error('Sonic Bloom requires WebGL.');

    let program = null;
    let buffer = null;
    const shaders = [];
    let disposed = false;
    function dispose() {
      if (disposed) return;
      disposed = true;
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      for (const shader of shaders) gl.deleteShader(shader);
    }
    function compile(type, source) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Sonic Bloom could not allocate a shader.');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`Sonic Bloom shader: ${gl.getShaderInfoLog(shader) || 'compilation failed'}`);
      }
      return shader;
    }

    try {
      const vertex = compile(gl.VERTEX_SHADER, vertexSource);
      const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
      program = gl.createProgram();
      if (!program) throw new Error('Sonic Bloom could not allocate a program.');
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`Sonic Bloom program: ${gl.getProgramInfoLog(program) || 'linking failed'}`);
      }
      const position = gl.getAttribLocation(program, 'aPosition');
      const resolution = gl.getUniformLocation(program, 'uResolution');
      const time = gl.getUniformLocation(program, 'uTime');
      const energy = gl.getUniformLocation(program, 'uEnergy');
      const accent = gl.getUniformLocation(program, 'uAccent');
      if (position < 0 || resolution === null || time === null || energy === null || accent === null) {
        throw new Error('Sonic Bloom could not bind shader inputs.');
      }
      buffer = gl.createBuffer();
      if (!buffer) throw new Error('Sonic Bloom could not allocate geometry.');
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      if (gl.getError() !== gl.NO_ERROR) throw new Error('Sonic Bloom could not upload geometry.');

      return {
        render(inputs) {
          if (disposed || gl.isContextLost()) return;
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
          gl.uniform1f(energy, Math.min(1, Math.max(0, inputs.energy || 0)));
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
