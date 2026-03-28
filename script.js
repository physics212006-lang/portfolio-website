// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       CUSTOM CURSOR
    ========================================= */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorGlow = document.getElementById('cursor-glow');
    
    let dotX = window.innerWidth / 2, dotY = window.innerHeight / 2;
    let glowX = window.innerWidth / 2, glowY = window.innerHeight / 2;
    
    document.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
        
        // Instant cursor dot
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
        
        // Adding hover states for buttons/links
        const target = e.target;
        if (target.closest('a') || target.closest('button') || target.closest('.glass-card') || target.closest('.skill-sphere')) {
            document.body.classList.add('cursor-hover');
        } else {
            document.body.classList.remove('cursor-hover');
        }
    });

    // Smooth cursor glow follow using requestAnimationFrame
    const renderCursor = () => {
        // Ease the glow towards the dot position
        glowX += (dotX - glowX) * 0.15;
        glowY += (dotY - glowY) * 0.15;
        
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        
        requestAnimationFrame(renderCursor);
    };
    renderCursor();

    /* =========================================
       PRELOADER & INITIAL ANIMATION
    ========================================= */
    const loader = document.getElementById('loader');
    const progress = document.querySelector('.loader-progress');
    
    // Simulate loading
    setTimeout(() => {
        progress.style.width = '100%';
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                initHeroAnimation();
            }, 800);
        }, 500);
    }, 1500);

    /* =========================================
       HERO GSAP ANIMATION
    ========================================= */
    function initHeroAnimation() {
        const tl = gsap.timeline();
        
        tl.from('.hero-pretitle', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" })
          .from('.hero-title', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .from('.hero-description', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .from('.hero-cta .btn', { y: 20, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }, "-=0.6")
          .from('.orbits', { scale: 0, opacity: 0, duration: 1.5, ease: "back.out(1.7)" }, "-=1")
          .from('.profile-container', { scale: 0, opacity: 0, duration: 1, ease: "back.out(1.7)" }, "-=1.2")
          .from('.scroll-indicator', { y: -20, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5");
    }

    /* =========================================
       CANVAS PARTICLES BACKGROUND
    ========================================= */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.1;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.color = Math.random() > 0.5 ? '#00f0ff' : '#b026ff';
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Mouse interaction (repel)
            const dx = dotX - this.x;
            const dy = dotY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x -= (dx / dist) * force * 2;
                this.y -= (dy / dist) * force * 2;
            }
            
            // Wrap around
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    function initParticles() {
        particles = [];
        const numParticles = Math.min(Math.floor(width * height / 10000), 100);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            particles[i].update();
            particles[i].draw();
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();

    /* =========================================
       NAVBAR SCROLL EFFECT
    ========================================= */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* =========================================
       GSAP SCROLLTRIGGER REVEALS
    ========================================= */
    gsap.registerPlugin(ScrollTrigger);
    
    const sections = document.querySelectorAll('.reveal');
    sections.forEach((section) => {
        gsap.fromTo(section, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%", // Reveal when top of section hits 80% viewport height
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Animate skill spheres (Anti-gravity floating setup)
    const skills = document.querySelectorAll('.skill-sphere');
    skills.forEach((skill, index) => {
        // Initial random positioning within container
        const randomX = (Math.random() - 0.5) * 60; // -30% to 30%
        const randomY = (Math.random() - 0.5) * 60;
        
        gsap.set(skill, { 
            left: `${50 + randomX}%`, 
            top: `${50 + randomY}%` 
        });
        
        // Float animation
        gsap.to(skill, {
            x: 'random(-50, 50)',
            y: 'random(-50, 50)',
            rotation: 'random(-20, 20)',
            duration: 'random(4, 8)',
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.2
        });
    });

    /* =========================================
       VANILLA TILT FOR 3D CARDS
    ========================================= */
    if (typeof VanillaTilt !== "undefined") {
        VanillaTilt.init(document.querySelectorAll(".tilt"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.02
        });
    }
});
