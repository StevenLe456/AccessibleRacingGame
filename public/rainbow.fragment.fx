precision highp float;

// Varyings
varying float z;

vec3 rainbow(float x)
{
	int i = int(x);
	if ((i % 60) / 10 == 0) {
		return vec3(1.0, 0.0, 0.0);
	}
	else if ((i % 60) / 10 == 1) {
		return vec3(1.0, 0.5, 0.0);
	}
	else if ((i % 60) / 10 == 2) {
		return vec3(1.0, 1.0, 0.0);
	}
	else if ((i % 60) / 10 == 3) {
		return vec3(0.0, 1.0, 0.0);
	}
	else if ((i % 60) / 10 == 4) {
		return vec3(0.0, 0.0, 1.0);
	}
	else {
		return vec3(0.5, 0.0, 0.5);
	}
}

void main(void) {
    gl_FragColor = vec4(rainbow(z), 1.0);
}

