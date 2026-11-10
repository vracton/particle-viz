export const orbitField = {
  id: 'orbit-field',
  name: 'Orbit Field',
  description: 'A particle orbit responding to low-frequency energy.',
  authorModel: 'GPT-6 (Codex)',
  create(canvas) {
    const gl = canvas.getContext('webgl', { alpha: false, antialias: true });
    if (!gl) throw new Error('WebGL is unavailable. Try a browser with hardware acceleration.');
    const shaders = [];
    let program, buffer;
    try {
      const shader = (type, source) => {
        const s = gl.createShader(type);
        shaders.push(s);
        gl.shaderSource(s, source); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('Visualizer shader failed to compile.');
        return s;
      };
      program = gl.createProgram();
      gl.attachShader(program, shader(gl.VERTEX_SHADER, `
        attribute vec3 aPoint;
        uniform float uTime, uEnergy, uAspect, uDpr;
        varying float vGlow;
        void main() {
          float angle = aPoint.x + uTime * (0.045 + aPoint.z * 0.02);
          float radius = aPoint.y * (1.0 + uEnergy * 0.25);
          vec2 p = vec2(cos(angle)*radius, sin(angle)*radius*0.48);
          float tilt = -0.38;
          p = mat2(cos(tilt), -sin(tilt), sin(tilt), cos(tilt))*p;
          p.x = p.x/uAspect + 0.34;
          gl_Position = vec4(p, 0.0, 1.0);
          gl_PointSize = (1.2 + aPoint.z*1.8 + uEnergy*2.0)*uDpr;
          vGlow = 0.2 + aPoint.z*0.6;
        }`));
      gl.attachShader(program, shader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        uniform vec3 uColor;
        varying float vGlow;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if(d > 0.5) discard;
          gl_FragColor = vec4(uColor, vGlow * (1.0-smoothstep(0.1,0.5,d)));
        }`));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Visualizer shader failed to link.');
      const points = new Float32Array(2400 * 3);
      // Deterministic distribution keeps idle frames reproducible.
      for (let i = 0; i < 2400; i++) {
        points[i*3] = i * 2.399963;
        points[i*3+1] = 0.38 + ((i*73)%1000)/1000*0.85;
        points[i*3+2] = ((i*37)%100)/100;
      }
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
      gl.useProgram(program);
      const pos = gl.getAttribLocation(program, 'aPoint');
      gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
      const uniforms = Object.fromEntries(['Time','Energy','Aspect','Dpr','Color'].map(n => [n, gl.getUniformLocation(program, `u${n}`)]));
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      return {
        render({ time, energy, accent, dpr }) {
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.clearColor(0.025, 0.035, 0.04, 1); gl.clear(gl.COLOR_BUFFER_BIT);
          gl.uniform1f(uniforms.Time, time); gl.uniform1f(uniforms.Energy, energy);
          gl.uniform1f(uniforms.Aspect, canvas.width / canvas.height);
          gl.uniform1f(uniforms.Dpr, dpr); gl.uniform3fv(uniforms.Color, accent);
          gl.drawArrays(gl.POINTS, 0, 2400);
        },
        dispose() { gl.deleteBuffer(buffer); gl.deleteProgram(program); shaders.forEach(s => gl.deleteShader(s)); },
      };
    } catch (error) {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      shaders.forEach(s => gl.deleteShader(s));
      throw error;
    }
  },
};
