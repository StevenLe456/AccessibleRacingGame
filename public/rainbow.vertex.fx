precision highp float;

// Attributes
attribute vec3 position;

// Uniforms
uniform mat4 worldViewProjection;

// Varyings
varying float z;

void main(void) {
    z = floor(position.z);
    gl_Position = worldViewProjection * vec4(position, 1.0);
}
