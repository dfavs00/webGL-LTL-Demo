 export const basicFragmentShader: string = 
`#version 300 es

precision mediump float;

uniform vec4 uColor;

out vec4 fragColor;

void main() {
    fragColor = uColor;
} 
`

// Uses normals and light to darken colors on the cube where light is less direct
// Ambient light in a given direction
export const lightFragmentShader: string = 
`#version 300 es

precision mediump float;

in vec3 vNormal;
in vec3 vPosition;

uniform vec4 uColor;
uniform vec3 uLightDirection;
uniform vec3 uLightColor;
uniform vec3 uAmbientColor;

out vec4 fragColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDirection = normalize(uLightDirection);

    float diffuseIntensity = max(dot(normal, lightDirection), 0.0);
    vec3 diffuse = uLightColor * diffuseIntensity;

    vec3 ambient = uAmbientColor;

    vec3 finalColor = uColor.rgb * (diffuse + ambient);

    fragColor = vec4(finalColor, uColor.a);
}
`

// Uses normals, light, and texture coordinates to display a texture on an object
export const textureLightFragmentShader: string = 
`#version 300 es
`