import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EFFECT_CONFIG } from './AppConfig';

export function setupEffects(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera): EffectComposer {
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        EFFECT_CONFIG.BLOOM_STRENGTH,
        EFFECT_CONFIG.BLOOM_RADIUS,
        EFFECT_CONFIG.BLOOM_THRESHOLD
    );
    composer.addPass(bloomPass);

    return composer;
}