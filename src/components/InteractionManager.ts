import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { photoMeshes } from './PhotoManager';
import { fullscreenViewer } from '../view/FullscreenViewer';
import { storyManager } from './StoryManager'; // IMPORT INI

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(-100, -100);
let hoveredMesh: THREE.Mesh | null = null;
let isInteractionEnabled = false;

export function enableInteraction(): void {
    isInteractionEnabled = true;
}

export function setupInteraction(_camera: THREE.PerspectiveCamera, _controls: OrbitControls): void {
    window.addEventListener('pointermove', (event) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('click', () => {
        if (!isInteractionEnabled || !hoveredMesh) return;
        
        const id = hoveredMesh.userData.id;
        const imageUrl = `/ica_${id}.jpg`;

        // --- TAMBAHIN INI BIAR TOMBOL NEXT ILANG PAS FOTO DIZOOM ---
        storyManager.hideNextButtonTemporarily();
        
        fullscreenViewer.show(imageUrl);
    });
}

export function updateInteraction(camera: THREE.PerspectiveCamera): void {
    if (!isInteractionEnabled) return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(photoMeshes);

    if (intersects.length > 0) {
        const mesh = intersects[0].object as THREE.Mesh;
        if (hoveredMesh !== mesh) {
            if (hoveredMesh) {
                gsap.to(hoveredMesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
            }
            hoveredMesh = mesh;
            gsap.to(hoveredMesh.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.3, ease: "back.out(2)" });
            document.body.style.cursor = 'pointer';
        }
    } else {
        if (hoveredMesh) {
            gsap.to(hoveredMesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
            hoveredMesh = null;
            document.body.style.cursor = 'default';
        }
    }
}