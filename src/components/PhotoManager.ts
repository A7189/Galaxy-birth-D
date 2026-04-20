import * as THREE from 'three';
import gsap from 'gsap';
import { PHOTO_CONFIG } from '../config/AppConfig';

export const orbitGroup = new THREE.Group();
orbitGroup.position.y = 4;

export const photoMeshes: THREE.Mesh[] = [];
export const orbitData: { radius: number, targetRadius: number, angle: number, speed: number, yOffset: number, floatPhase: number }[] = [];

export function loadPhotos(scene: THREE.Scene): void {
    scene.add(orbitGroup);
    const textureLoader = new THREE.TextureLoader();
    
    for (let i = 1; i <= PHOTO_CONFIG.COUNT; i++) {
        const photoUrl = `/ica_${i}.jpg`;

        textureLoader.load(photoUrl, (texture) => {
            const geometry = new THREE.PlaneGeometry(PHOTO_CONFIG.PHOTO_WIDTH, PHOTO_CONFIG.PHOTO_HEIGHT);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData = { id: i };

            const targetRadius = PHOTO_CONFIG.SPACING_RADIUS_MIN + Math.random() * (PHOTO_CONFIG.SPACING_RADIUS_MAX - PHOTO_CONFIG.SPACING_RADIUS_MIN);
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * (PHOTO_CONFIG.ORBIT_SPEED_MAX - PHOTO_CONFIG.ORBIT_SPEED_MIN) + PHOTO_CONFIG.ORBIT_SPEED_MIN;
            const yOffset = (Math.random() - 0.5) * PHOTO_CONFIG.Y_OFFSET_SPREAD;
            const floatPhase = Math.random() * Math.PI * 2;

            mesh.position.set(0, yOffset, 0);
            mesh.scale.set(0.01, 0.01, 0.01);

            orbitGroup.add(mesh);
            photoMeshes.push(mesh);
            orbitData.push({ radius: 0, targetRadius, angle, speed, yOffset, floatPhase });
        });
    }

    const specialUrl = `/ica_500.jpg`;
    textureLoader.load(specialUrl, (texture) => {
        const geometry = new THREE.PlaneGeometry(PHOTO_CONFIG.PHOTO_WIDTH, PHOTO_CONFIG.PHOTO_HEIGHT);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { id: 500, isSpecial: true };

        const targetRadius = PHOTO_CONFIG.SPACING_RADIUS_MIN + Math.random() * (PHOTO_CONFIG.SPACING_RADIUS_MAX - PHOTO_CONFIG.SPACING_RADIUS_MIN);
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (PHOTO_CONFIG.ORBIT_SPEED_MAX - PHOTO_CONFIG.ORBIT_SPEED_MIN) + PHOTO_CONFIG.ORBIT_SPEED_MIN;
        const yOffset = (Math.random() - 0.5) * PHOTO_CONFIG.Y_OFFSET_SPREAD;
        const floatPhase = Math.random() * Math.PI * 2;

        mesh.position.set(0, yOffset, 0);
        mesh.scale.set(0.01, 0.01, 0.01);

        orbitGroup.add(mesh);
        photoMeshes.push(mesh);
        orbitData.push({ radius: 0, targetRadius, angle, speed, yOffset, floatPhase });
    });
}

export function animatePhotonShower(onComplete?: () => void): void {
    let completed = 0;
    const total = photoMeshes.length;

    if (total === 0 && onComplete) {
        onComplete();
        return;
    }

    photoMeshes.forEach((mesh, index) => {
        const data = orbitData[index];
        if (!data) return;

        const delay = Math.random() * 2;

        gsap.to(data, {
            radius: data.targetRadius,
            duration: 3 + Math.random() * 2,
            ease: "power3.out",
            delay: delay
        });

        gsap.to(mesh.scale, {
            x: 1, y: 1, z: 1,
            duration: 2.5,
            ease: "elastic.out(1, 0.5)",
            delay: delay
        });

        gsap.to((mesh.material as THREE.Material), {
            opacity: 1,
            duration: 1.5,
            delay: delay,
            onComplete: () => {
                completed++;
                if (completed === total && onComplete) {
                    gsap.delayedCall(1.5, onComplete);
                }
            }
        });
    });
}

export function updatePhotos(elapsedTime: number, cameraPosition: THREE.Vector3): void {
    photoMeshes.forEach((mesh, index) => {
        const data = orbitData[index];
        if (data) {
            data.angle += data.speed;
            mesh.position.x = Math.cos(data.angle) * data.radius;
            mesh.position.z = Math.sin(data.angle) * data.radius;
            
            const floatingY = Math.sin(elapsedTime * PHOTO_CONFIG.FLOAT_SPEED + data.floatPhase) * PHOTO_CONFIG.FLOAT_AMPLITUDE;
            mesh.position.y = data.yOffset + floatingY;
            
            mesh.lookAt(cameraPosition);
        }
    });
}