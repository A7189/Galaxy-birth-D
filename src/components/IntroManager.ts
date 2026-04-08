import gsap from 'gsap';
import * as THREE from 'three';
import { IntroComponents } from '../modules/IntroModules';
import { INTRO_CONFIG } from '../config/IntroConfig';

export function playIntro(
    camera: THREE.PerspectiveCamera, 
    onTransitionStart: () => void,
    onPrewarm: () => void
): void {
    const container = document.getElementById('intro-container');
    if (!container) return;

    const root = document.documentElement;
    root.style.setProperty("--primary", INTRO_CONFIG.colors.primary);
    root.style.setProperty("--accent", INTRO_CONFIG.colors.accent);
    root.style.setProperty("--bg", INTRO_CONFIG.colors.background);
    root.style.setProperty("--text", INTRO_CONFIG.colors.text);

    camera.position.set(0, 300, 800);
    const tl = gsap.timeline();

    const rendered: { el: HTMLElement, comp: any, section: any }[] = [];

    INTRO_CONFIG.sections.forEach((section) => {
        const comp = IntroComponents[section.type];
        if (comp) {
            const el = comp.render(container, section, INTRO_CONFIG);
            rendered.push({ el, comp, section });
        }
    });

    tl.to(container, { duration: 0.6, visibility: "visible" });

    let deferredExits: (() => void)[] = [];

    rendered.forEach(({ el, comp }, i) => {
        const isOverlay = comp.overlay === true;

        if (!isOverlay && deferredExits.length > 0) {
            deferredExits.forEach((fn) => fn());
            deferredExits = [];
        }

        comp.animate(tl, el, INTRO_CONFIG);

        if (comp.exit) {
            const next = rendered[i + 1];
            const nextIsOverlay = next && next.comp.overlay === true;
            if (nextIsOverlay) {
                deferredExits.push(() => comp.exit(tl, el));
            } else if (!isOverlay) {
                comp.exit(tl, el);
            }
        } else if (!isOverlay && i < rendered.length - 1) {
            const next = rendered[i + 1];
            if (!next || !next.comp.overlay) {
                tl.to(el, { duration: 0.5, opacity: 0, display: "none" });
            }
        }
    });

    deferredExits.forEach((fn) => fn());

    tl.to(container, {
        backgroundColor: "#000000",
        duration: 2.5,
        ease: "power2.inOut",
        onComplete: () => {
            onPrewarm();
        }
    }, "-=1");

    const btn = document.getElementById("start-universe-btn");
    if (btn) {
        btn.addEventListener("click", () => {
            btn.style.pointerEvents = "none";
            
            const fadeTl = gsap.timeline();
            
            fadeTl.to(container, {
                duration: 2.5,
                opacity: 0,
                ease: "power2.inOut",
                onStart: () => {
                    onTransitionStart();
                },
                onComplete: () => {
                    container.style.display = 'none';
                }
            });

            gsap.to(camera.position, {
                duration: 6,
                x: 0,
                y: 40,
                z: 100,
                ease: "power3.inOut"
            });
        });
    }
}