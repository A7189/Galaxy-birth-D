import gsap from 'gsap';

export class SpinWheelManager {
    private lockScreen: HTMLDivElement;
    private lockInput: HTMLInputElement;
    private wheelContainer: HTMLDivElement;
    private canvas: HTMLCanvasElement;
    private spinBtn: HTMLButtonElement;
    
    private prizes = [
        "1", "2", "ZONK", 
        "3", "4", "ZONK", 
        "5", "6", "7", 
        "ZONK", "8", "9", "10"
    ];
    
    private colors = [
        "#ffd700", 
        "#ffaf40", 
        "#333333", 
        "#fffa65", 
        "#ffd700", 
        "#333333", 
        "#7efff5", 
        "#18dcff", 
        "#7d5fff", 
        "#333333", 
        "#7158e2", 
        "#ff3838", 
        "#ff4d4d"
    ];

    private currentRotation = 0;
    private isSpinning = false;

    constructor() {
        this.lockScreen = document.createElement('div');
        this.lockScreen.className = 'lock-screen';
        this.lockScreen.innerHTML = `
            <input type="password" class="lock-input" placeholder="Enter Secret Code">
            <div class="lock-hint">Ask your boyfriend for the key</div>
        `;
        this.lockInput = this.lockScreen.querySelector('.lock-input')!;

        this.wheelContainer = document.createElement('div');
        this.wheelContainer.className = 'wheel-container';
        this.wheelContainer.innerHTML = `
            <canvas id="wheel-canvas" width="500" height="500"></canvas>
            <div class="wheel-pointer"></div>
            <button class="spin-btn">SPIN THE WHEEL</button>
        `;
        this.canvas = this.wheelContainer.querySelector('#wheel-canvas')!;
        this.spinBtn = this.wheelContainer.querySelector('.spin-btn')!;

        document.body.appendChild(this.lockScreen);
        document.body.appendChild(this.wheelContainer);

        this.lockInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.lockInput.value === 'SAYANGICA') {
                this.unlock();
            }
        });

        this.spinBtn.addEventListener('click', () => this.spin());
        this.drawWheel();
    }

    public showLock() {
        this.lockScreen.style.display = 'flex';
        gsap.to(this.lockScreen, { opacity: 1, duration: 1 });
    }

    private unlock() {
        gsap.to(this.lockScreen, {
            opacity: 0, duration: 1, onComplete: () => {
                this.lockScreen.style.display = 'none';
                this.wheelContainer.style.display = 'flex';
                gsap.to(this.wheelContainer, { opacity: 1, duration: 1 });
            }
        });
    }

    private drawWheel() {
        const ctx = this.canvas.getContext('2d')!;
        const centerX = 250;
        const centerY = 250;
        const radius = 240;
        const sliceAngle = (Math.PI * 2) / this.prizes.length;

        ctx.clearRect(0, 0, 500, 500);

        this.prizes.forEach((prize, i) => {
            ctx.beginPath();
            ctx.fillStyle = this.colors[i];
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, i * sliceAngle, (i + 1) * sliceAngle);
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.stroke();

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(i * sliceAngle + sliceAngle / 2);
            
            ctx.fillStyle = (this.colors[i] === "#333333") ? "white" : "black";
            
            if (prize === "1" || prize === "4") {
                ctx.font = "bold 24px sans-serif";
            } else if (prize === "ZONK") {
                ctx.font = "bold 14px sans-serif";
            } else {
                ctx.font = "bold 20px sans-serif";
            }
            
            ctx.textAlign = "right";
            
            if (prize !== "ZONK") {
                ctx.fillText(`No. ${prize}`, radius - 20, 8);
            } else {
                ctx.fillText(prize, radius - 20, 5);
            }
            
            ctx.restore();
        });

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        ctx.fill();
    }

    private spin() {
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.spinBtn.disabled = true;

        const rotationCount = 8 + Math.random() * 5;
        const extraRotation = Math.PI * 2 * rotationCount;
        const finalRotation = this.currentRotation + extraRotation;

        gsap.to(this, {
            currentRotation: finalRotation,
            duration: 5,
            ease: "power4.out",
            onUpdate: () => {
                this.canvas.style.transform = `rotate(${this.currentRotation}rad)`;
            },
            onComplete: () => {
                this.isSpinning = false;
                this.calculateResult();
            }
        });
    }

    private calculateResult() {
        const totalSlices = this.prizes.length;
        const sliceAngle = (Math.PI * 2) / totalSlices;
        
        // Jarum lu ada di posisi atas (270 derajat atau 1.5 PI)
        let rawAngle = (Math.PI * 1.5) - this.currentRotation;
        
        // Normalisasi angle biar nilainya selalu positif 0 sampai 2PI
        rawAngle = ((rawAngle % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        
        let index = Math.floor(rawAngle / sliceAngle);
        
        const result = this.prizes[index];

        if (result === "ZONK") {
            alert("Waduh ZONK! Jangan sedih, putar lagi ya sayang ❤️");
            this.spinBtn.disabled = false;
        } else {
            if (result === "1" || result === "4") {
                alert(`JACKPOT!!! ✨🎁 Selamat Ica! Kamu dapet kotak SPESIAL Nomor ${result}! Buruan buka kotaknya!`);
            } else {
                alert(`Selamat Ica! Kamu dapet kotak Nomor ${result} 🎁 Ayo buka kotaknya!`);
            }

            this.prizes.splice(index, 1);
            this.colors.splice(index, 1);

            const remainingPrizes = this.prizes.filter(p => p !== "ZONK");
            
            if (remainingPrizes.length === 0) {
                this.spinBtn.disabled = true;
                this.spinBtn.innerText = "SEMUA HADIAH HABIS!";
            } else {
                this.spinBtn.disabled = false;
                this.spinBtn.innerText = "SPIN LAGI";
            }

            this.drawWheel();
        }
    }
}

export const spinWheelManager = new SpinWheelManager();