import gsap from 'gsap';

export class AudioManager {
    private bgm: HTMLAudioElement;

    constructor() {
        this.bgm = new Audio('/bgm.mp3');
        this.bgm.loop = true;
        this.bgm.volume = 0;
    }

    public playBGM() {
        this.bgm.play().catch(e => console.warn("Auto-play terblokir browser:", e));
        gsap.to(this.bgm, { volume: 0.6, duration: 3, ease: "power2.inOut" });
    }

    public fadeOutBGM() {
        gsap.to(this.bgm, { 
            volume: 0, 
            duration: 2.5, 
            ease: "power2.inOut",
            onComplete: () => {
                this.bgm.pause();
            }
        });
    }
}

export const audioManager = new AudioManager();