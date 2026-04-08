import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { photoMeshes } from './PhotoManager';

export const TOUR_CONFIG = {
    photoIds: [1, 2, 3, 4],
    zoomDistance: 25,
    stayDuration: 3.5,
    flyDuration: 2.5
};

export function startCinematicTour(
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    onComplete: () => void
): void {
    const tl = gsap.timeline();
    const startPos = new THREE.Vector3(0, 40, 100);
    const startTarget = new THREE.Vector3(0, 0, 0);

    controls.enabled = false;

    TOUR_CONFIG.photoIds.forEach((id) => {
        tl.call(() => {
            const mesh = photoMeshes.find(m => m.userData.id === id);
            if (!mesh) return;

            const dummyTarget = mesh.position.clone();
            const dir = dummyTarget.clone().setY(0).normalize();
            const camPos = dummyTarget.clone().add(dir.multiplyScalar(TOUR_CONFIG.zoomDistance));
            camPos.y += 3;

            gsap.to(camera.position, {
                x: camPos.x, y: camPos.y, z: camPos.z,
                duration: TOUR_CONFIG.flyDuration,
                ease: "power2.inOut"
            });

            gsap.to(controls.target, {
                x: dummyTarget.x, y: dummyTarget.y, z: dummyTarget.z,
                duration: TOUR_CONFIG.flyDuration,
                ease: "power2.inOut"
            });
        });
        tl.to({}, { duration: TOUR_CONFIG.flyDuration + TOUR_CONFIG.stayDuration });
    });

    tl.call(() => {
        gsap.to(camera.position, {
            x: startPos.x, y: startPos.y, z: startPos.z,
            duration: 3,
            ease: "power3.inOut"
        });
        gsap.to(controls.target, {
            x: startTarget.x, y: startTarget.y, z: startTarget.z,
            duration: 3,
            ease: "power3.inOut",
            onComplete: () => {
                controls.enabled = true;
                
                const div = document.createElement('div');
                div.style.position = 'absolute';
                div.style.top = '50%';
                div.style.left = '50%';
                div.style.transform = 'translate(-50%, -50%)';
                div.style.color = 'var(--text)';
                div.style.fontFamily = "'Poppins', sans-serif";
                div.style.fontSize = 'clamp(1.2rem, 3vw, 2rem)';
                div.style.fontWeight = '300';
                div.style.pointerEvents = 'none';
                div.style.opacity = '0';
                div.style.zIndex = '100';
                div.style.textAlign = 'center';
                div.style.textShadow = '0 0 15px var(--primary)';
                div.innerHTML = "Take your time to explore your universe...";
                document.body.appendChild(div);

                gsap.to(div, { duration: 2, opacity: 1, ease: "power2.inOut" });
                gsap.to(div, { 
                    duration: 2, 
                    opacity: 0, 
                    ease: "power2.inOut", 
                    delay: 4, 
                    onComplete: () => {
                        div.remove();
                        onComplete();
                    }
                });
            }
        });
    });
}