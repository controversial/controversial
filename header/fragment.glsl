#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  gl_FragColor = vec4(1.0, st.x, sin(u_time * 5.) / 2. + 0.5, 1.0);
}
