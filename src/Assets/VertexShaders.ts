export const basicVertexShader: string = 
`#version 300 es

in vec3 aPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
}
`

export const lightVertexShader: string = 
`#version 300 es

in vec3 aPosition;
in vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

out vec3 vNormal;
out vec3 vPosition;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    vNormal = mat3(uModelMatrix) * aNormal;
    vPosition = vec3(uModelMatrix * vec4(aPosition, 1.0));
}
`