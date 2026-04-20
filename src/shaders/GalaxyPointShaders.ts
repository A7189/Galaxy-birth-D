export const galaxyPointVertexShader = `
varying vec3 vWorldPosition;
uniform float uSizeMin;
uniform float uSizeMax;

void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Ukuran partikel dinamis berdasarkan jarak kamera
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
uniform float uMultiplier;

void main() {
    float dist = length(vWorldPosition);

    // Transisi warna dari tengah ke ujung
    vec3 color = mix(uColorCore, uColorMid, clamp(dist / 25.0, 0.0, 1.0));
    color = mix(color, uColorEdge, clamp((dist - 25.0) / 25.0, 0.0, 1.0));

    // RUMUS ANTI ITEM-ITEM (Soft Glow)
    // Menghitung jarak dari titik tengah partikel
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    
    // Bikin pendaran halus (makin ke pinggir makin transparan)
    float strength = 0.05 / distanceToCenter - 0.1;
    strength = clamp(strength, 0.0, 1.0);

    // Warnanya dikali 2 biar makin nge-jreng pas kena Bloom, strength jadi Alpha-nya
    gl_FragColor = vec4(color * 2.0, strength);
}
`;