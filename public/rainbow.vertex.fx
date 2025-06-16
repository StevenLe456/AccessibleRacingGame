precision highp float;

// Attributes
attribute vec3 position;

// Uniforms
uniform mat4 worldViewProjection;

// Varyings
varying float factor;

void main(void) {
    factor = -position.z * 0.05 + 0.05;
    gl_Position = worldViewProjection * vec4(position, 1.0);
}
