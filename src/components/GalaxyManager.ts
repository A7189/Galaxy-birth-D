import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { 
    planetGlowVertexShader, 
    planetGlowFragmentShader, 
    planetNightTextureVertexShader, 
    planetNightTextureFragmentShader 
} from '../shaders/PlanetShaders';
import { galaxyPointVertexShader, galaxyPointFragmentShader } from '../shaders/GalaxyPointShaders';
import { GALAXY_CONFIG } from '../config/AppConfig';

export const galaxyGroup = new THREE.Group();
export let earthSphere: THREE.Mesh;
let atmosphereMesh: THREE.Mesh;

export const pointMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uSizeMin: { value: GALAXY_CONFIG.PARTICLE_SIZE_MIN },
        uSizeMax: { value: GALAXY_CONFIG.PARTICLE_SIZE_MAX },
        uMultiplier: { value: GALAXY_CONFIG.PARTICLE_BASE_MULTIPLIER },
        uColorCore: { value: new THREE.Color(GALAXY_CONFIG.COLOR_CORE) },
        uColorMid: { value: new THREE.Color(GALAXY_CONFIG.COLOR_MID) },
        uColorEdge: { value: new THREE.Color(GALAXY_CONFIG.COLOR_EDGE) }
    },
    vertexShader: galaxyPointVertexShader,
    fragmentShader: galaxyPointFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

let dustParticles: THREE.Points;
let nebulaParticles: THREE.Points;

function createSoftParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d')!;
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
}

export function addSpaceEnvironment(scene: THREE.Scene) {
    const textureLoader = new THREE.TextureLoader();
    const smokeTexture = textureLoader.load('/smoke.png'); 
    const starTexture = createSoftParticleTexture();

    const dustCount = 3000;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for(let i = 0; i < dustCount * 3; i++) {
        dustPositions[i] = (Math.random() - 0.5) * 900;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustMaterial = new THREE.PointsMaterial({
        size: 0.5, 
        color: 0xffffff,
        map: starTexture,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

    const nebulaCount = 150;
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaPositions = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);

    const colorPrimary = new THREE.Color(GALAXY_CONFIG.COLOR_CORE);
    const colorAccent = new THREE.Color(GALAXY_CONFIG.COLOR_MID);
    const colorDeep = new THREE.Color(GALAXY_CONFIG.COLOR_EDGE);

    for(let i = 0; i < nebulaCount; i++) {
        const i3 = i * 3;
        nebulaPositions[i3] = (Math.random() - 0.5) * 1200;
        nebulaPositions[i3+1] = (Math.random() - 0.5) * 1200;
        nebulaPositions[i3+2] = (Math.random() - 0.5) * 1200;

        const mixedColor = colorPrimary.clone().lerp(
            Math.random() > 0.5 ? colorAccent : colorDeep,
            Math.random()
        );

        nebulaColors[i3] = mixedColor.r;
        nebulaColors[i3+1] = mixedColor.g;
        nebulaColors[i3+2] = mixedColor.b;
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    const nebulaMaterial = new THREE.PointsMaterial({
        size: 250, 
        vertexColors: true,
        map: smokeTexture, 
        transparent: true,
        opacity: 0.015, 
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    nebulaParticles = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebulaParticles);
}

export function animateSpaceEnvironment(elapsedTime: number) {
    if(dustParticles) {
        dustParticles.rotation.y = elapsedTime * 0.01;
        dustParticles.rotation.x = elapsedTime * 0.008;
    }
    if(nebulaParticles) {
        nebulaParticles.rotation.y = elapsedTime * 0.003; 
        nebulaParticles.rotation.z = elapsedTime * 0.002;
    }
}

export function loadGalaxy(scene: THREE.Scene): void {
    scene.add(galaxyGroup);
    
    const textureLoader = new THREE.TextureLoader();

    const dayTexture = textureLoader.load('/moon.jpg');
    const nightTexture = textureLoader.load('/moon.jpg'); 

    const earthMaterial = new THREE.ShaderMaterial({
        uniforms: {
            dayTexture: { value: dayTexture },
            nightTexture: { value: nightTexture },
            sunDirection: { value: new THREE.Vector3(5, 2, 3).normalize() },
            uBrightness: { value: 0.6 }
        },
        vertexShader: planetNightTextureVertexShader,
        fragmentShader: planetNightTextureFragmentShader
    });

    const earthGeometry = new THREE.SphereGeometry(15, 64, 64);
    earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);
    earthSphere.position.set(0, 0, 0);
    galaxyGroup.add(earthSphere);

    const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            fresnelBias: { value: 0.05 }, 
            fresnelScale: { value: 3.0 }, 
            fresnelPower: { value: 25.0 }, 
            color1: { value: new THREE.Color(0x6084b4) }, 
            color2: { value: new THREE.Color(0x000000) }  
        },
        vertexShader: planetGlowVertexShader,
        fragmentShader: planetGlowFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide 
    });

    atmosphereMesh = new THREE.Mesh(new THREE.SphereGeometry(15.1, 64, 64), atmosphereMaterial);
    galaxyGroup.add(atmosphereMesh);

    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
        '/galaxy.glb',
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(GALAXY_CONFIG.SCALE, GALAXY_CONFIG.SCALE, GALAXY_CONFIG.SCALE);

            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            model.position.set(-center.x, -center.y, -center.z);

            model.traverse((child) => {
                if ((child as THREE.Points).isPoints) {
                    const points = child as THREE.Points;
                    points.material = pointMaterial;
                } else if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    const points = new THREE.Points(mesh.geometry, pointMaterial);
                    points.position.copy(mesh.position);
                    points.rotation.copy(mesh.rotation);
                    points.scale.copy(mesh.scale);
                    galaxyGroup.add(points);
                    mesh.visible = false;
                }
            });

            galaxyGroup.add(model);
            galaxyGroup.rotation.set(0, 0, 0); 
        }
    );

    addSpaceEnvironment(scene);
}

export function updateGalaxy(elapsedTime: number): void {
    if (galaxyGroup) {
        galaxyGroup.rotation.y = elapsedTime * GALAXY_CONFIG.ROTATION_SPEED; 
    }
    if (earthSphere) {
        earthSphere.rotation.y = elapsedTime * 0.1;
        if (atmosphereMesh) atmosphereMesh.rotation.y = earthSphere.rotation.y;
    }
    if (pointMaterial) {
        pointMaterial.uniforms.uTime.value = elapsedTime;
    }

    animateSpaceEnvironment(elapsedTime);
}