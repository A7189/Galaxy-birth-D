import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { galaxyPointVertexShader, galaxyPointFragmentShader } from '../shaders/GalaxyPointShaders';
import { GALAXY_CONFIG } from '../config/AppConfig';

export const galaxyGroup = new THREE.Group();

export const pointMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uSizeMin: { value: GALAXY_CONFIG.PARTICLE_SIZE_MIN },
        uSizeMax: { value: GALAXY_CONFIG.PARTICLE_SIZE_MAX },
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

export function loadGalaxy(scene: THREE.Scene): void {
    scene.add(galaxyGroup);
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
}

export function updateGalaxy(elapsedTime: number): void {
    if (galaxyGroup) {
        galaxyGroup.rotation.y = elapsedTime * GALAXY_CONFIG.ROTATION_SPEED; 
    }
    if (pointMaterial) {
        pointMaterial.uniforms.uTime.value = elapsedTime;
    }
}