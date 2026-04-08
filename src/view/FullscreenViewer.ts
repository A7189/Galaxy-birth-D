export class FullscreenViewer {
    private overlay: HTMLElement;
    private imageElement: HTMLImageElement;
    private closeBtn: HTMLElement;

    constructor() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'fullscreen-overlay';

        this.closeBtn = document.createElement('div');
        this.closeBtn.className = 'close-btn';
        this.closeBtn.innerHTML = '✖';

        this.imageElement = document.createElement('img');
        this.imageElement.className = 'fullscreen-image';

        this.overlay.appendChild(this.closeBtn);
        this.overlay.appendChild(this.imageElement);
        document.body.appendChild(this.overlay);

        this.closeBtn.addEventListener('click', () => this.hide());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.hide();
        });

        document.addEventListener('pointermove', this.onMouseMove.bind(this));
    }

    public show(imageUrl: string): void {
        this.imageElement.src = imageUrl;
        this.overlay.style.display = 'flex';
        
        setTimeout(() => {
            this.overlay.style.opacity = '1';
        }, 10);
    }

    public hide(): void {
        this.overlay.style.opacity = '0';
        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.imageElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        }, 300);
    }

    private onMouseMove(event: MouseEvent): void {
        if (this.overlay.style.display !== 'flex') return;

        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;

        const rotateX = -y * 15;
        const rotateY = x * 15;

        this.imageElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
}

export const fullscreenViewer = new FullscreenViewer();