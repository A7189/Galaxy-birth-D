export const galaxyPointVertexShader = `
varying vec3 vWorldPosition;
uniform float uSizeMin;
uniform float uSizeMax;

void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    float baseSize = 50.0 * (1.0 / -mvPosition.z);
    gl_PointSize = clamp(baseSize, uSizeMin, uSizeMax);
    
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const galaxyPointFragmentShader = `
varying vec3 vWorldPosition;
uniform float uTime;
uniform vec3 uColorCore;
uniform vec3 uColorMid;
uniform vec3 uColorEdge;

void main() {
    float dist = length(vWorldPosition);

    vec3 color = mix(uColorCore, uColorMid, clamp(dist / 25.0, 0.0, 1.0));
    color = mix(color, uColorEdge, clamp((dist - 25.0) / 25.0, 0.0, 1.0));

    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float ll = length(xy);
    if(ll > 0.5) discard;

    gl_FragColor = vec4(color * 3.0, 1.0);
}
`;