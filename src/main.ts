import './styles/intro.css';
import './styles/picture.css';
import './styles/story.css'; 
import './styles/spinwheel.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { setupEffects } from './config/effects';
import { loadGalaxy, updateGalaxy } from './components/GalaxyManager';
import { loadPhotos, updatePhotos, animatePhotonShower } from './components/PhotoManager';
import { CAMERA_CONFIG } from './config/AppConfig';
import { playIntro } from './components/IntroManager';
import { startCinematicTour } from './components/TourManager';
import { setupInteraction, updateInteraction, enableInteraction } from './components/InteractionManager';
import { storyManager } from './components/StoryManager';
import { photoMeshes } from './components/PhotoManager';
import { spinWheelManager } from './components/SpinwheelManager';
import { audioManager } from './components/AudioManager';

const canvas = document.querySelector<HTMLCanvasElement>('#webgl-canvas')!;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 40, 100);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = CAMERA_CONFIG.MIN_DISTANCE;
controls.maxDistance = CAMERA_CONFIG.MAX_DISTANCE;

const ambientLight = new THREE.AmbientLight(0xffffcc, 1.5);
scene.add(ambientLight);

loadGalaxy(scene);
loadPhotos(scene);

const composer = setupEffects(renderer, scene, camera);
setupInteraction(camera, controls);

let isIntroPlaying = true;
let isSceneActive = true;

playIntro(
    camera, 
    () => {
        audioManager.playBGM();
        animatePhotonShower(() => {
            startCinematicTour(camera, controls, () => {
                enableInteraction();
                
                storyManager.startTimer(3, () => { 
                    const specialMesh = photoMeshes.find(m => m.userData.id === 500);
                    
                    if (specialMesh) {
                        const targetUrl = `/ica_${specialMesh.userData.id}.jpg`;
                        storyManager.flyToSpecialPhoto(camera, controls, specialMesh, () => {
                            storyManager.startStoryTransition(targetUrl, () => {
                                audioManager.fadeOutBGM();
                                isSceneActive = false;
                                canvas.style.display = 'none';
                                spinWheelManager.showLock();
                            });
                        });
                    } else {
                        const backupMesh = photoMeshes[0]; 
                        
                        if (backupMesh) {
                            const targetUrl = `/ica_${backupMesh.userData.id}.jpg`;
                            storyManager.flyToSpecialPhoto(camera, controls, backupMesh, () => {
                                storyManager.startStoryTransition(targetUrl, () => {
                                    audioManager.fadeOutBGM();
                                    isSceneActive = false;
                                    canvas.style.display = 'none';
                                    spinWheelManager.showLock();
                                });
                            });
                        }
                    }
                });
            });
        });
    },
    () => {
        isIntroPlaying = false;
    }
);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

const tick = () => {
    if (!isSceneActive) return;

    window.requestAnimationFrame(tick);

    if (isIntroPlaying) return;

    if (!storyManager.isStoryMode) {
        const elapsedTime = clock.getElapsedTime();
        updateGalaxy(elapsedTime);
        updatePhotos(elapsedTime, camera.position);
    }

    if (!storyManager.isStoryMode) {
        updateInteraction(camera);
    }

    controls.update();
    composer.render();
};

tick();