import gsap from 'gsap';

export const IntroComponents: Record<string, any> = {
    greeting: {
        render(container: HTMLElement, section: any, config: any) {
            const div = document.createElement("div");
            div.className = "section section-greeting";
            div.innerHTML = `
                <h1 class="greeting-title">${section.title} <span class="greeting-name">${config.name}</span></h1>
                <p class="greeting-subtitle">${section.subtitle}</p>
            `;
            container.appendChild(div);
            return div;
        },
        animate(tl: gsap.core.Timeline, el: HTMLElement) {
            tl.from(el.querySelector(".greeting-title"), { duration: 0.7, opacity: 0, y: 10 })
              .from(el.querySelector(".greeting-subtitle"), { duration: 0.4, opacity: 0, y: 10 })
              .to(el.querySelector(".greeting-title"), { duration: 0.7, opacity: 0, y: 10 }, "+=3.5")
              .to(el.querySelector(".greeting-subtitle"), { duration: 0.7, opacity: 0, y: 10 }, "-=1");
        }
    },
    countdown: {
        render(container: HTMLElement, section: any) {
            const div = document.createElement("div");
            div.className = "section section-countdown";
            const numbers = [];
            for (let i = section.from; i >= 1; i--) numbers.push(i);
            div.innerHTML = `
                <div class="countdown-wrapper">
                    ${numbers.map((n) => `<span class="countdown-num">${n}</span>`).join("")}
                    <span class="countdown-go">${section.goText}</span>
                </div>
            `;
            container.appendChild(div);
            return div;
        },
        animate(tl: gsap.core.Timeline, el: HTMLElement) {
            const nums = el.querySelectorAll(".countdown-num");
            const go = el.querySelector(".countdown-go");
            nums.forEach((num) => {
                tl.fromTo(num, { scale: 0, opacity: 0, rotation: -180 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)" })
                  .to(num, { scale: 2, opacity: 0, duration: 0.4 }, "+=0.8");
            });
            tl.fromTo(go, { scale: 0, opacity: 0 }, { scale: 1.2, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" })
              .to(go, { scale: 0, opacity: 0, duration: 0.4 }, "+=1.5");
        }
    },
    announcement: {
        render(container: HTMLElement, section: any) {
            const div = document.createElement("div");
            div.className = "section section-announcement";
            div.innerHTML = `<p>${section.text}</p>`;
            container.appendChild(div);
            return div;
        },
        animate(tl: gsap.core.Timeline, el: HTMLElement) {
            tl.from(el.querySelector("p"), { duration: 0.7, opacity: 0, y: 10 })
              .to(el.querySelector("p"), { duration: 0.7, opacity: 0, y: -10 }, "+=3");
        }
    },
    chatbox: {
        render(container: HTMLElement, section: any) {
            const div = document.createElement("div");
            div.className = "section section-chatbox";
            div.innerHTML = `
                <div class="text-box">
                    <p class="hbd-chatbox"></p>
                    <p class="fake-btn">${section.buttonText}</p>
                </div>
            `;
            const chatbox = div.querySelector(".hbd-chatbox")!;
            chatbox.innerHTML = section.message.split("").map((ch: string) => `<span>${ch}</span>`).join("");
            container.appendChild(div);
            return div;
        },
        animate(tl: gsap.core.Timeline, el: HTMLElement, config: any) {
            const spans = el.querySelectorAll(".hbd-chatbox span");
            tl.from(el.querySelector(".text-box"), { duration: 0.7, scale: 0.2, opacity: 0 })
              .from(el.querySelector(".fake-btn"), { duration: 0.3, scale: 0.2, opacity: 0 })
              .to(spans, { duration: 1.5, visibility: "visible", stagger: 0.05 })
              .to(el.querySelector(".fake-btn"), { duration: 0.1, backgroundColor: config.colors.primary }, "+=2")
              .to(el.querySelector(".text-box"), { duration: 0.5, scale: 0.2, opacity: 0, y: -150 }, "+=1");
        }
    },
ideas: {
        render(container: HTMLElement, section: any, config: any) {
            const div = document.createElement("div");
            div.className = "section section-ideas";
            section.lines.forEach((line: string, i: number) => {
                const isLast = i === section.lines.length - 1;
                const p = document.createElement("p");
                p.className = isLast ? "idea-line idea-special" : "idea-line";
                
                if (isLast) {
                    p.innerHTML = `
                    <span class="idea-word">You</span> 
                        <span class="idea-word">are</span> 
                        <span class="idea-word" style="color: ${config.colors.primary}; font-weight: bold;">Special</span> 
                        <span class="idea-word smile-icon" style="display:inline-block; margin-left: 15px;">:)</span>
                    `;
                } else {
                    p.innerHTML = line;
                }
                
                div.appendChild(p);
            });
            
            if (section.bigLetters) {
                const p = document.createElement("p");
                p.className = "idea-big-letters";
                p.innerHTML = section.bigLetters.split("").map((ch: string) => `<span>${ch}</span>`).join("");
                div.appendChild(p);
            }
            container.appendChild(div);
            return div;
        },
        animate(tl: gsap.core.Timeline, el: HTMLElement, config: any) {
            const regularLines = el.querySelectorAll(".idea-line:not(.idea-special)");
            const specialLine = el.querySelector(".idea-special");
            const bigLetters = el.querySelectorAll(".idea-big-letters span");

            regularLines.forEach((line) => {
                tl.fromTo(line, { opacity: 0, y: -20, rotationX: 5, skewX: "15deg" }, { opacity: 1, y: 0, rotationX: 0, skewX: "0deg", duration: 0.7 });
                const strong = line.querySelector("strong");
                if (strong) tl.to(strong, { duration: 0.5, scale: 1.2, x: 10, backgroundColor: config.colors.primary, color: "#fff" });
                tl.to(line, { duration: 0.7, opacity: 0, y: 20, rotationY: 5, skewX: "-15deg" }, "+=2.5");
            });

            if (specialLine) {
                const words = specialLine.querySelectorAll(".idea-word:not(.smile-icon)");
                const smile = specialLine.querySelector(".smile-icon");
                
                tl.set(specialLine, { opacity: 1 }, "+=0.5");
                
                tl.fromTo(words, 
                    { opacity: 0, y: -10 }, 
                    { opacity: 1, y: 0, duration: 0.8, stagger: 1.0, ease: "power2.out" }
                );

                tl.fromTo(smile, 
                    { opacity: 0, scale: 0.5 }, 
                    { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 
                    "+=0.5"
                );

                tl.to(smile, { 
                    duration: 0.8, 
                    rotation: 90, 
                    scale: 1.4,
                    color: config.colors.primary,
                    ease: "back.inOut(2)",
                }, "+=2.0");

                tl.to(specialLine, { duration: 0.7, opacity: 0, y: 20, rotationY: 5, skewX: "-15deg" }, "+=3.0");
            }

            if (bigLetters.length) {
                tl.fromTo(bigLetters, { scale: 3, opacity: 0, rotation: 15 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: "expo.out", stagger: 0.2 })
                  .to(bigLetters, { duration: 0.8, scale: 3, opacity: 0, rotation: -15, ease: "expo.out", stagger: 0.2 }, "+=1.5");
            }
        }
    },
    quote: {
        render(container: HTMLElement, section: any) {
            const div = document.createElement("div");
            div.className = "section section-quote";
            div.innerHTML = `
                <div class="quote-card">
                    <span class="quote-mark">"</span>
                    <p class="quote-text">${section.text}</p>
                    ${section.author ? `<p class="quote-author">— ${section.author}</p>` : ""}
                </div>
            `;
            container.appendChild(div);
            return div;
        },
        animate(tl: gsap.core.Timeline, el: HTMLElement) {
            const card = el.querySelector(".quote-card");
            const mark = el.querySelector(".quote-mark");
            const text = el.querySelector(".quote-text");
            const author = el.querySelector(".quote-author");

            tl.from(card, { duration: 0.6, opacity: 0, scale: 0.9, y: 30 })
              .from(mark, { duration: 0.4, opacity: 0, scale: 3, rotation: -20 }, "-=0.2")
              .from(text, { duration: 0.5, opacity: 0, y: 15 }, "-=0.1");
            if (author) tl.from(author, { duration: 0.4, opacity: 0, x: -20 });
            tl.to(card, { duration: 0.6, opacity: 0, y: -20 }, "+=4");
        }
    },
    stars: {
        overlay: true,
        render(container: HTMLElement, section: any) {
            const div = document.createElement("div");
            div.className = "section section-stars";
            for (let i = 0; i < section.count; i++) {
                const star = document.createElement("div");
                star.className = "star";
                star.style.left = Math.random() * 100 + "%";
                star.style.top = Math.random() * 100 + "%";
                star.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
                star.style.width = star.style.height = (Math.random() * 4 + 2).toFixed(1) + "px";
                div.appendChild(star);
            }
            container.appendChild(div);
            return div;
        },
        animate(tl: gsap.core.Timeline, el: HTMLElement) {
            tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1 })
              .to(el, { opacity: 0, duration: 1 }, "+=4");
        }
    },
    balloons: {
        overlay: true,
        render(container: HTMLElement, section: any) {
            const div = document.createElement("div");
            div.className = "section section-balloons";
            const SVGS = ["ballon1.svg", "ballon2.svg", "ballon3.svg"];
            for (let i = 0; i < section.count; i++) {
                const img = document.createElement("img");
                img.src = `/img/${SVGS[i % SVGS.length]}`;
                img.alt = "balloon";
                div.appendChild(img);
            }
            container.appendChild(div);
            return div;
        },
        animate(tl: gsap.core.Timeline, el: HTMLElement) {
            const imgs = el.querySelectorAll("img");
            tl.fromTo(imgs, { opacity: 0.9, y: window.innerHeight }, { opacity: 1, y: -1000, duration: 2.5, stagger: 0.2 });
        }
    },
    profile: {
        render(container: HTMLElement, section: any, config: any) {
            const div = document.createElement("div");
            div.className = "section section-profile";
            div.innerHTML = `
                <div class="profile-wrapper">
                    <img src="${config.photo}" alt="profile" class="profile-picture" />
                </div>
                <div class="wish">
                    <h3 class="wish-hbd"></h3>
                    <h5 class="wish-text">${section.wishText}</h5>
                </div>
            `;
            const hbd = div.querySelector(".wish-hbd")!;
            hbd.innerHTML = section.wishTitle.split("").map((ch: string) => `<span>${ch === " " ? "&nbsp;" : ch}</span>`).join("");
            container.appendChild(div);
            return div;
        },
        animate(tl: gsap.core.Timeline, el: HTMLElement, config: any) {
            tl.from(el.querySelector(".profile-picture"), { duration: 0.8, scale: 0.5, opacity: 0, ease: "back.out(1.4)" }, "-=2")
              .from(el.querySelectorAll(".wish-hbd span"), { duration: 0.5, opacity: 0, y: -30, ease: "back.out(1.7)", stagger: 0.06 })
              .to(el.querySelectorAll(".wish-hbd span"), { color: config.colors.primary, duration: 0.4, stagger: 0.04, ease: "none" }, "-=0.3")
              .from(el.querySelector(".wish-text"), { duration: 0.5, opacity: 0, y: 10 }, "-=0.2");
        },
        exit(tl: gsap.core.Timeline, el: HTMLElement) {
            tl.to(el, { duration: 0.6, opacity: 0, y: 20 }, "+=3");
        }
    },
    fireworks: {
        overlay: true,
        render(container: HTMLElement, section: any) {
            const div = document.createElement("div");
            div.className = "section section-fireworks";
            const colors = ["#ff69b4", "#15a1ed", "#f9d423", "#42e695", "#bd6ecf", "#ff6b6b", "#ffd93d"];
            for (let i = 0; i < section.count; i++) {
                const spark = document.createElement("div");
                spark.className = "firework-spark";
                spark.style.left = (Math.random() * 90 + 5) + "%";
                spark.style.top = (Math.random() * 70 + 10) + "%";
                spark.style.backgroundColor = colors[i % colors.length];
                spark.style.width = spark.style.height = (Math.random() * 6 + 4) + "px";
                div.appendChild(spark);
            }
            container.appendChild(div);
            return div;
        },
        animate(tl: gsap.core.Timeline, el: HTMLElement) {
            const sparks = el.querySelectorAll(".firework-spark");
            tl.fromTo(sparks, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, stagger: { each: 0.08, from: "random" }, ease: "back.out(2)" })
              .to(sparks, { y: () => (Math.random() - 0.5) * window.innerHeight * 0.4, x: () => (Math.random() - 0.5) * window.innerWidth * 0.4, opacity: 0, scale: 0, duration: 1.2, stagger: { each: 0.05, from: "random" }, ease: "power2.out" }, "+=0.5")
              .to(el, { opacity: 0, duration: 0.3 });
        }
    },
    closing: {
        render(container: HTMLElement, section: any) {
            const div = document.createElement("div");
            div.className = "section section-closing";
            div.innerHTML = `
                <p class="closing-text" style="margin-bottom: 40px;">${section.text}</p>
                <button id="start-universe-btn" style="
                    opacity: 0; 
                    pointer-events: none;
                    padding: 12px 35px; 
                    font-size: 1.2rem; 
                    font-family: inherit;
                    font-weight: 600;
                    color: #fff;
                    background: transparent;
                    border: 2px solid var(--primary);
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Let's Go!</button>
            `;
            container.appendChild(div);
            return div;
        },
        animate(tl: gsap.core.Timeline, el: HTMLElement) {
            tl.from(el.querySelector(".closing-text"), { duration: 1, opacity: 0, y: -20, rotationX: 5, skewX: "15deg" })
              .to(el.querySelector("#start-universe-btn"), { 
                  duration: 0.8, 
                  opacity: 1, 
                  ease: "power2.out",
                  onComplete: () => {
                      const btn = el.querySelector("#start-universe-btn") as HTMLElement;
                      if (btn) {
                          btn.style.pointerEvents = "auto";
                          btn.onmouseenter = () => { 
                              btn.style.background = "var(--primary)"; 
                              btn.style.transform = "scale(1.05)"; 
                              btn.style.boxShadow = "0 0 15px var(--primary)";
                          };
                          btn.onmouseleave = () => { 
                              btn.style.background = "transparent"; 
                              btn.style.transform = "scale(1)"; 
                              btn.style.boxShadow = "none";
                          };
                      }
                  }
              }, "+=1");
        }
    }
};