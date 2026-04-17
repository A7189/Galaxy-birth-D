import gsap from 'gsap';

export class AudioManager {
    private bgm: HTMLAudioElement;
    private toggleBtn: HTMLButtonElement;
    private isPlaying: boolean = false;

    constructor() {
        // PENTING: Pastikan file lagu lu beneran namanya "bgm.mp3" dan ada di folder "public"
        this.bgm = new Audio('/bgm.mp3'); 
        this.bgm.loop = true;
        this.bgm.volume = 0;

        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'music-toggle';
        this.toggleBtn.innerHTML = '🔇'; 
        this.toggleBtn.style.display = 'none'; 
        document.body.appendChild(this.toggleBtn);

        this.toggleBtn.addEventListener('click', () => this.toggleMusic());
    }

    public playBGM() {
        this.toggleBtn.style.display = 'flex'; 
        
        this.bgm.play().then(() => {
            this.isPlaying = true;
            this.toggleBtn.innerHTML = '🔊';
            gsap.to(this.bgm, { volume: 0.6, duration: 3, ease: "power2.inOut" });
        }).catch(e => {
            console.warn("Auto-play diblokir browser, nunggu Ica klik tombol speaker", e);
            this.isPlaying = false;
            this.toggleBtn.innerHTML = '🔇'; 
        });
    }

    private toggleMusic() {
        if (this.isPlaying) {
            this.bgm.pause();
            this.toggleBtn.innerHTML = '🔇';
        } else {
            this.bgm.play();
            this.bgm.volume = 0.6; 
            this.toggleBtn.innerHTML = '🔊';
        }
        this.isPlaying = !this.isPlaying;
    }

    public fadeOutBGM() {
        gsap.to(this.bgm, { 
            volume: 0, 
            duration: 2.5, 
            ease: "power2.inOut",
            onComplete: () => {
                this.bgm.pause();
                this.toggleBtn.style.display = 'none'; 
            }
        });
    }
}

export const audioManager = new AudioManager();