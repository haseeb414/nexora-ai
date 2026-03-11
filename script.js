document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. LOADER LOGIC --- */
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('progress-bar');
    const statusMsg = document.getElementById('status-msg');
    
    let progress = 0;
    const messages = ["Initializing AI Engines...", "Connecting NLP Models...", "Training Workflows...", "Deploying UI..."];

    const simulInterval = setInterval(() => {
        progress += Math.random() * 5 + 2;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = `${progress}%`;
        
        if (progress > 25 && progress < 50) statusMsg.textContent = messages[1];
        else if (progress >= 50 && progress < 75) statusMsg.textContent = messages[2];
        else if (progress >= 75 && progress < 100) statusMsg.textContent = messages[3];
        
        if (progress >= 100) {
            clearInterval(simulInterval);
            finishLoading();
        }
    }, 40);
    
    function finishLoading() {
        statusMsg.textContent = "System Operational.";
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.add('loaded');
            setTimeout(() => { loader.style.display = 'none'; initAnimations(); }, 1200);
        }, 400);
    }


    /* --- 2. SMOOTH SCROLL (LENIS) --- */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);


    /* --- 3. PARTICLES BACKGROUND (GLOBAL) --- */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particlesArray = [];
        const numberOfParticles = window.innerWidth < 768 ? 50 : 100;
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = 'rgba(47, 91, 255, 0.5)'; // Accent primary
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if(this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if(this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for(let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
                
                // Connect particles
                for(let j = i; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x;
                    const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    if(distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(47, 91, 255, ${0.2 - distance/500})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }


    /* --- 4. GSAP ANIMATIONS --- */
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    function initAnimations() {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time)=>{ lenis.raf(time * 1000) });
        gsap.ticker.lagSmoothing(0, 0);

        // --- Intro Sequence Scrollytelling ---
        if (document.getElementById('intro-sequence')) {
            const introTl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#intro-sequence",
                    start: "top top",
                    end: "+=250%",
                    scrub: 1,
                    pin: "#intro-content",
                    anticipatePin: 1
                }
            });

            // Step 1 Fade In & Out
            introTl.to(".step-1", { opacity: 1, y: 0, duration: 1 })
                   .to(".step-1", { opacity: 0, y: -40, duration: 1 }, "+=0.5")
                   // Step 2 Fade In & Out
                   .to(".step-2", { opacity: 1, y: 0, duration: 1 })
                   .to(".step-2", { opacity: 0, y: -40, duration: 1 }, "+=0.5")
                   // Step 3 Fade In & Out
                   .to(".step-3", { opacity: 1, y: 0, duration: 1 })
                   .to(".step-3", { opacity: 0, y: -40, duration: 1 }, "+=0.5");
        }

        // Hero Init Fade
        gsap.fromTo('.gs-reveal', 
            { y: 30, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '#hero',
                    start: "top 75%",
                },
                y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' 
            }
        );

        // Hero Dynamic Text Typer
        const phrases = ["Premium AI Calling Agents", "Next-Level AI Chatbots", "Automated Workflows"];
        let tlText = gsap.timeline({repeat: -1});
        
        phrases.forEach(phrase => {
            tlText.to("#dynamic-text", {
                duration: 1.5,
                text: phrase,
                ease: "none"
            })
            .to({}, {duration: 2}) // Wait
            .to("#dynamic-text", {
                duration: 1,
                text: "",
                ease: "none"
            });
        });

        // Scroll Reveal Elements
        gsap.utils.toArray('.gs-fade-up').forEach(elem => {
            gsap.fromTo(elem, 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                }
            );
        });

        // Demo Animation Infinite Loop
        let tlDemo = gsap.timeline({repeat: -1, repeatDelay: 1});
        tlDemo.to(".pr-1", { left: "90px", opacity: 1, duration: 0 })
              .to(".pr-1", { left: "50%", opacity: 0, duration: 1, ease: "power1.inOut" })
              .to(".pr-2", { left: "50%", opacity: 1, duration: 0 })
              .to(".pr-2", { left: "calc(100% - 90px)", opacity: 0, duration: 1, ease: "power1.inOut" });

        // Stats Counter Animation
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            ScrollTrigger.create({
                trigger: counter,
                start: "top 90%",
                once: true,
                onEnter: () => {
                    const target = +counter.getAttribute('data-target');
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: "power2.out"
                    });
                }
            });
        });
        
        ScrollTrigger.refresh();
    }


    /* --- 5. INTERACTIVE FUNCTIONALITY --- */
    
    // Form Submit Handler & Modals
    const form = document.getElementById('nexora-form');
    const formStatus = document.getElementById('form-status');
    const modal = document.getElementById('thank-you-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    // Target Information
    const myPhoneNumber = "923260203301";
    const myEmail = "nexoraautomation1@gmail.com";

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const service = document.getElementById('service').value;
        const msg = document.getElementById('message').value;
        
        // WhatsApp Message Format
        const waMessage = `*New Lead from Nexora Website*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Phone:* ${phone}%0A*Service:* ${service}%0A*Message:* ${msg}`;
        const waUrl = `https://wa.me/${myPhoneNumber}?text=${waMessage}`;
        
        // Show Success status temporarily
        formStatus.style.color = "var(--accent-primary)";
        formStatus.textContent = "Processing submission...";
        
        setTimeout(() => {
            // Option 1: Open WhatsApp in new tab
            window.open(waUrl, '_blank');
            
            // Show Thank You Popup Modal
            modal.classList.remove('hidden');
            form.reset();
            formStatus.textContent = "";

            // NOTE: In a strictly static site we can't send automated emails purely from the client without exposing API keys
            // or using an email client (mailto). For a dual approach without a backend server, we usually do WhatsApp 
            // OR use a third party wrapper. 
            // If the user wants an email *sent to their target via desktop client* we can trigger a mailto on the same click:
            // window.location.href = `mailto:${myEmail}?subject=New Lead: ${name}&body=${decodeURIComponent(waMessage)}`;
        }, 1000);
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Chat Widget Logic Mockup
    const chatBtn = document.getElementById('demo-chat-btn');
    const chatWidget = document.getElementById('ai-chat-widget');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input-field');
    const sendBtn = document.getElementById('send-btn');
    const chatBody = document.getElementById('chat-body');

    chatBtn.addEventListener('click', () => {
        chatWidget.classList.remove('hidden');
    });

    closeChat.addEventListener('click', () => {
        chatWidget.classList.add('hidden');
    });

    sendBtn.addEventListener('click', sendMsg);
    chatInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMsg(); });

    function sendMsg() {
        const text = chatInput.value.trim();
        if(!text) return;
        
        // Append user msg
        const userDiv = document.createElement('div');
        userDiv.className = 'msg user';
        userDiv.textContent = text;
        chatBody.appendChild(userDiv);
        chatInput.value = '';
        
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Mock AI Reply
        setTimeout(() => {
            const aiDiv = document.createElement('div');
            aiDiv.className = 'msg ai';
            aiDiv.textContent = "That sounds great! An expert from our team will contact you shortly to discuss setting up your AI workflows.";
            chatBody.appendChild(aiDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000);
    }

    // AI Demo Voice Call Logic (Vapi) - Using locally bundled @vapi-ai/web SDK
    const callBtn = document.getElementById('demo-call-btn');
    const voiceModal = document.getElementById('voice-call-modal');
    const closeCallBtn = document.getElementById('close-call-btn');
    const callStatusText = document.getElementById('call-status-text');
    const audioVisualizer = document.getElementById('audio-visualizer');
    const muteBtn = document.getElementById('call-mute-btn');
    const endBtn = document.getElementById('call-end-btn');

    let vapi = null;
    let callActive = false;
    let isMuted = false;

    // User credentials
    const VAPI_PUBLIC_KEY = "06d77995-56b5-4577-859b-8bd3a7709bd5";
    const VAPI_ASSISTANT_ID = "fe793288-33e0-4ec5-a1ea-9bc4a2c906ea";

    if (callBtn && window.Vapi) {
        vapi = new window.Vapi(VAPI_PUBLIC_KEY);

        // Vapi Event Listeners
        vapi.on('call-start', () => {
            callActive = true;
            callStatusText.textContent = "AI Agent Connected. Speak now.";
            audioVisualizer.classList.add('active');
            console.log("[Vapi] Call started successfully");
        });

        vapi.on('call-end', () => {
            console.log("[Vapi] Call ended");
            resetCallUI();
        });

        vapi.on('speech-start', () => {
            callStatusText.textContent = "AI is speaking...";
        });

        vapi.on('speech-end', () => {
            callStatusText.textContent = "Listening... (speak now)";
        });

        // Listen for transcript messages — this tells us if mic is being picked up
        vapi.on('message', (msg) => {
            console.log("[Vapi] Message:", msg);
            if (msg.type === 'transcript') {
                if (msg.role === 'user') {
                    callStatusText.textContent = "You: " + msg.transcript;
                } else if (msg.role === 'assistant') {
                    callStatusText.textContent = "AI: " + msg.transcript;
                }
            }
        });

        vapi.on('volume-level', (level) => {
            // Update visualizer bars based on actual volume
            const bars = audioVisualizer.querySelectorAll('.bar');
            bars.forEach((bar, i) => {
                const h = Math.max(8, level * 60 * (1 + Math.random() * 0.5));
                bar.style.height = h + 'px';
            });
        });

        vapi.on('error', (e) => {
            console.error("[Vapi] Error:", e);
            callStatusText.textContent = "Connection failed. Please try again.";
            setTimeout(resetCallUI, 3000);
        });

        // Start Call on button click — using assistant ID
        callBtn.addEventListener('click', async () => {
            voiceModal.classList.remove('hidden');
            callStatusText.textContent = "Initializing Neural Pathways...";

            try {
                console.log("[Vapi] Starting call with assistant:", VAPI_ASSISTANT_ID);
                await vapi.start(VAPI_ASSISTANT_ID);
            } catch (err) {
                console.error("[Vapi] Failed to start call:", err);
                callStatusText.textContent = "Microphone access denied or error.";
                setTimeout(resetCallUI, 3000);
            }
        });

        // UI Controls
        closeCallBtn.addEventListener('click', () => {
            if (callActive) vapi.stop();
            resetCallUI();
        });

        endBtn.addEventListener('click', () => {
            if (callActive) vapi.stop();
            resetCallUI();
        });

        muteBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            vapi.setMuted(isMuted);
            if (isMuted) {
                muteBtn.classList.add('muted');
                muteBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            } else {
                muteBtn.classList.remove('muted');
                muteBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            }
        });
    } else if (callBtn) {
        callBtn.addEventListener('click', () => {
            alert("Voice SDK failed to load. Please refresh the page and try again.");
        });
    }

    function resetCallUI() {
        callActive = false;
        voiceModal.classList.add('hidden');
        audioVisualizer.classList.remove('active');
        callStatusText.textContent = "Connecting to intelligence...";
        isMuted = false;
        if (muteBtn) {
            muteBtn.classList.remove('muted');
            muteBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }
    }
});
