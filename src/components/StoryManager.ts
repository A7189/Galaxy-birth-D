import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { photoMeshes } from './PhotoManager';
import { fullscreenViewer } from '../view/FullscreenViewer';

export class StoryManager {
    private nextBtn: HTMLButtonElement;
    private overlay: HTMLDivElement;
    private textElement: HTMLDivElement;
    private interactiveContainer: HTMLDivElement;
    private storyImage: HTMLImageElement;
    private textLeft: HTMLDivElement;
    private textRight: HTMLDivElement;
    private continueHint: HTMLDivElement;
    public isStoryMode: boolean = false;

    constructor() {
        this.nextBtn = document.createElement('button');
        this.nextBtn.innerText = 'Next ➔';
        this.nextBtn.className = 'story-next-btn';
        // Sembunyiin dari awal biar ga bocor
        this.nextBtn.style.display = 'none';
        this.nextBtn.style.opacity = '0';
        document.body.appendChild(this.nextBtn);

        this.overlay = document.createElement('div');
        this.overlay.className = 'story-overlay';
        this.textElement = document.createElement('div');
        this.textElement.className = 'story-text';
        this.overlay.appendChild(this.textElement);
        document.body.appendChild(this.overlay);

        this.interactiveContainer = document.createElement('div');
        this.interactiveContainer.className = 'story-interactive-container';
        
        this.storyImage = document.createElement('img');
        this.storyImage.className = 'story-3d-image';
        
        this.textLeft = document.createElement('div');
        this.textLeft.className = 'story-side-text story-text-left';
        this.textLeft.innerHTML = '<b>Awal cerita kita...</b><br><br>Lucu ya kalau diinget inget lagi, semuanya cuma berawal dari aku nawarin kamu soal UI/UX. Niat awal aku cuma mau ngajarin kamu basic sederhana eh kita malah deket, Kita PDKT cuma 4 hari, eh malah keterusan sampe sekarang yang bulan depan sudah 2 tahun...<br><br>Foto ini jadi saksi bisu kita. Ini waktu pertama kali kita main bareng di madiun di rumah kamu. Siapa yang nyangka, dari sekadar nawarin ngajarin kamu sesuatu dengan iseng, kamu malah jadi bagian cerita yang paling panjang dan paling berarti buat aku.';

        this.textRight = document.createElement('div');
        this.textRight.className = 'story-side-text story-text-right';
        this.textRight.innerHTML = '<b>sejak 18 Mei 2024...</b><br><br>Hubungan kita berubah jadi hal yang paling pengen aku jaga dengan serius. Di balik sifat ku yang keras kepala, aku selalu kalah sama sifat manja dan tingkah kamu. Dua hal itu yang selalu narik aku kembali dan bikin aku jatuh cinta lagi lagi dan lagi.<br><br><i>You are the best "accident" that ever happened to me, Ca.</i> Terima kasih udah selalu ada. Selamat ulang tahun, sayang.';
        this.continueHint = document.createElement('div');

        this.continueHint.className = 'story-continue-hint';
        this.continueHint.innerText = 'Click anywhere to continue';

        this.interactiveContainer.appendChild(this.textLeft);
        this.interactiveContainer.appendChild(this.storyImage);
        this.interactiveContainer.appendChild(this.textRight);
        this.interactiveContainer.appendChild(this.continueHint);
        document.body.appendChild(this.interactiveContainer);

        document.addEventListener('pointermove', (e) => this.onMouseMove(e));
    }

    private onMouseMove(event: MouseEvent): void {
        if (this.interactiveContainer.style.display !== 'flex') return;
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        this.storyImage.style.transform = `perspective(1000px) rotateX(${-y * 15}deg) rotateY(${x * 15}deg)`;
    }

    public startTimer(delaySeconds: number, onTimerEnd: () => void): void {
        setTimeout(() => {
            this.showNextButton(onTimerEnd);
        }, delaySeconds * 1000);
    }

    private showNextButton(onClickAction: () => void): void {
        this.nextBtn.style.display = 'block';
        gsap.to(this.nextBtn, { opacity: 1, duration: 1, ease: "power2.out" });

        this.nextBtn.addEventListener('click', () => {
            this.isStoryMode = true;
            gsap.to(this.nextBtn, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    this.nextBtn.style.display = 'none';
                    onClickAction();
                }
            });
        }, { once: true });
    }

    // --- FUNGSI BARU BUAT HIDE/SHOW DARI FULLSCREEN VIEWER ---
    public hideNextButtonTemporarily(): void {
        if (this.nextBtn.style.display !== 'none') {
            gsap.to(this.nextBtn, { opacity: 0, duration: 0.3, onComplete: () => { this.nextBtn.style.display = 'none'; } });
        }
    }

    public restoreNextButton(): void {
        // Cuma balikin tombol kalau belom masuk story mode akhir
        if (!this.isStoryMode && this.nextBtn.style.opacity === '0') {
            this.nextBtn.style.display = 'block';
            gsap.to(this.nextBtn, { opacity: 1, duration: 0.3 });
        }
    }
    // ---------------------------------------------------------

    public flyToSpecialPhoto(camera: THREE.PerspectiveCamera, controls: OrbitControls, targetMesh: THREE.Mesh, onComplete: () => void): void {
        controls.enabled = false;
        const targetPos = new THREE.Vector3();
        targetMesh.getWorldPosition(targetPos);
        const dir = targetPos.clone().setY(0).normalize();
        const camPos = targetPos.clone().add(dir.multiplyScalar(4));
        camPos.y += 0.5;

        const startQuaternion = targetMesh.quaternion.clone();
        targetMesh.lookAt(camPos);
        const endQuaternion = targetMesh.quaternion.clone();
        targetMesh.quaternion.copy(startQuaternion);

        gsap.to(targetMesh.quaternion, {
            x: endQuaternion.x,
            y: endQuaternion.y,
            z: endQuaternion.z,
            w: endQuaternion.w,
            duration: 2.5,
            ease: "power2.inOut"
        });

        gsap.to(controls.target, { x: targetPos.x, y: targetPos.y, z: targetPos.z, duration: 2.5, ease: "power2.inOut" });
        gsap.to(camera.position, {
            x: camPos.x, y: camPos.y, z: camPos.z,
            duration: 2.5,
            ease: "power2.inOut",
            onComplete: () => onComplete()
        });
    }

    public startStoryTransition(imageUrl: string, onTransitionComplete: () => void): void {
        this.storyImage.src = imageUrl;
        this.interactiveContainer.style.display = 'flex';

        const tl = gsap.timeline();
        tl.to(this.interactiveContainer, { opacity: 1, duration: 2, ease: "power2.inOut" })
          .to([this.textLeft, this.textRight], { opacity: 1, duration: 1.5, ease: "power2.out" })
          .to(this.continueHint, { opacity: 1, duration: 1, ease: "power2.inOut", delay: 2 });

        this.interactiveContainer.addEventListener('click', () => {
            const outTl = gsap.timeline();
            outTl.to(this.interactiveContainer, { opacity: 0, duration: 1.5, ease: "power2.inOut" })
                 .call(() => {
                     this.interactiveContainer.style.display = 'none';
                     this.overlay.style.display = 'flex';
                 })
                 .to(this.overlay, { opacity: 1, duration: 2, ease: "power2.inOut" })
                 .call(() => { this.textElement.innerText = "happy birthday, i love u and i always will..."; })
                 .to(this.textElement, { opacity: 1, duration: 2, ease: "power2.inOut" })
                 .to(this.textElement, { opacity: 0, duration: 1.5, ease: "power2.inOut", delay: 2.5 })
                 .call(() => { this.textElement.innerText = "anyway..."; })
                 .to(this.textElement, { opacity: 1, duration: 1.5, ease: "power2.inOut", delay: 0.5 })
                 .to(this.textElement, { opacity: 0, duration: 1.5, ease: "power2.inOut", delay: 2 })
                 .call(() => {
                     onTransitionComplete();
                 });
        }, { once: true });
    }
}

export const storyManager = new StoryManager();