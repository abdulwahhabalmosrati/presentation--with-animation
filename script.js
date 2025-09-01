// Presentation Interactive Controller
class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 10;
        this.isAnimating = false;
        this.autoPlayEnabled = false;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        this.animateCurrentSlide();
        this.preloadImages();
    }
    
    bindEvents() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.addEventListener('click', () => this.previousSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Dot navigation
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index + 1));
        });
        
        // Content item navigation (table of contents)
        const contentItems = document.querySelectorAll('.content-item');
        contentItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetSlide = parseInt(item.dataset.target);
                if (targetSlide) {
                    this.goToSlide(targetSlide);
                }
            });
        });
        
        // Add hover effects to interactive elements
        this.addHoverEffects();
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Escape':
                    this.toggleFullscreen();
                    break;
                case 'f':
                case 'F':
                    this.toggleFullscreen();
                    break;
                case 'p':
                case 'P':
                    this.toggleAutoPlay();
                    break;
            }
        });
    }
    
    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Minimum swipe distance
            const minSwipeDistance = 50;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > minSwipeDistance) {
                    if (diffX > 0) {
                        // Swipe left - next slide (RTL)
                        this.nextSlide();
                    } else {
                        // Swipe right - previous slide (RTL)
                        this.previousSlide();
                    }
                }
            } else {
                if (Math.abs(diffY) > minSwipeDistance) {
                    if (diffY > 0) {
                        // Swipe up - next slide
                        this.nextSlide();
                    } else {
                        // Swipe down - previous slide
                        this.previousSlide();
                    }
                }
            }
        });
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber === this.currentSlide || this.isAnimating) return;
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;
        
        this.isAnimating = true;
        
        // Remove active class from current slide immediately
        const currentSlideElement = document.getElementById(`slide${this.currentSlide}`);
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
        }
        
        // Update current slide
        const previousSlide = this.currentSlide;
        this.currentSlide = slideNumber;
        
        // Add active class to new slide with a slight delay for smooth transition
        setTimeout(() => {
            const newSlideElement = document.getElementById(`slide${this.currentSlide}`);
            if (newSlideElement) {
                newSlideElement.classList.add('active');
            }
            this.updateNavigation();
            
            // Animate slide elements after transition
            setTimeout(() => {
                this.animateCurrentSlide();
            }, 300);
            
            // End animation state
            setTimeout(() => {
                this.isAnimating = false;
            }, 600);
        }, 50);
    }
    
    updateNavigation() {
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === this.currentSlide);
        });
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.style.opacity = this.currentSlide === 1 ? '0.5' : '1';
        nextBtn.style.opacity = this.currentSlide === this.totalSlides ? '0.5' : '1';
    }
    
    animateCurrentSlide() {
        const currentSlideElement = document.getElementById(`slide${this.currentSlide}`);
        
        // Animate elements based on slide content
        setTimeout(() => {
            this.animateSlideElements(currentSlideElement);
        }, 300);
    }
    
    animateSlideElements(slideElement) {
        const animatedElements = slideElement.querySelectorAll(
            '.feature-card, .goal-item, .tool-card, .system-card, ' +
            '.screen-item, .challenge-card, .future-card, .content-item'
        );
        
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    addHoverEffects() {
        // Add interactive hover effects
        const interactiveElements = document.querySelectorAll(
            '.content-item, .feature-card, .tool-card, .system-card, ' +
            '.screen-item, .challenge-card, .future-card, .goal-item'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addRippleEffect(element);
            });
        });
        
        // Add click effects to buttons
        const buttons = document.querySelectorAll('.nav-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.addClickEffect(e.target);
            });
        });
    }
    
    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.pointerEvents = 'none';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.top = '50%';
        ripple.style.left = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.transition = 'transform 0.6s ease';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.style.transform = 'translate(-50%, -50%) scale(20)';
        }, 10);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    addClickEffect(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err.message);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    toggleAutoPlay() {
        this.autoPlayEnabled = !this.autoPlayEnabled;
        
        if (this.autoPlayEnabled) {
            this.startAutoPlay();
            this.showNotification('تم تفعيل العرض التلقائي');
        } else {
            this.stopAutoPlay();
            this.showNotification('تم إيقاف العرض التلقائي');
        }
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            } else {
                this.goToSlide(1); // Loop back to first slide
            }
        }, 5000); // 5 seconds per slide
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.background = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = 'white';
        notification.style.padding = '15px 30px';
        notification.style.borderRadius = '25px';
        notification.style.fontSize = '16px';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
    
    preloadImages() {
        const imageUrls = [
            'logo.jpg',
            'home screen.jpg',
            'sign in screen.jpg',
            'sign up screen.jpg',
            'profile screen.jpg',
            'analytics screen.jpg',
            'Ai chat screen.jpg',
            'user to user chat screen.jpg'
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    // Add mouse wheel navigation
    setupMouseWheelNavigation() {
        let wheelTimeout = null;
        
        document.addEventListener('wheel', (e) => {
            if (this.isAnimating) return;
            
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    this.nextSlide();
                } else if (e.deltaY < 0) {
                    this.previousSlide();
                }
            }, 100);
        }, { passive: true });
    }
    
    // Initialize mouse wheel after constructor
    enableMouseWheel() {
        this.setupMouseWheelNavigation();
    }
}

// Utility functions for enhanced interactivity
class PresentationEffects {
    static addParticleEffect(container) {
        const particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = 'rgba(255, 255, 255, 0.5)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            
            container.appendChild(particle);
            particles.push(particle);
        }
        
        // Animate particles
        particles.forEach((particle, index) => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const duration = 3000 + Math.random() * 2000;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            particle.animate([
                { transform: 'translate(0, 0)', opacity: 0 },
                { transform: 'translate(0, -100px)', opacity: 1 },
                { transform: 'translate(0, -200px)', opacity: 0 }
            ], {
                duration: duration,
                delay: index * 100,
                iterations: Infinity
            });
        });
    }
    
    static addBackgroundAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            body {
                background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
                background-size: 400% 400%;
                animation: gradientShift 15s ease infinite;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new PresentationController();
    
    // Enable mouse wheel navigation after a short delay
    setTimeout(() => {
        presentation.enableMouseWheel();
    }, 1000);
    
    // Add background animation
    PresentationEffects.addBackgroundAnimation();
    
    // Add particle effect to title slide
    const titleSlide = document.getElementById('slide1');
    if (titleSlide) {
        PresentationEffects.addParticleEffect(titleSlide);
    }
    
    // Add help overlay
    const helpOverlay = document.createElement('div');
    helpOverlay.innerHTML = `
        <div style="position: fixed; top: 10px; right: 10px; z-index: 9999; 
                    background: rgba(0,0,0,0.7); color: white; padding: 10px; 
                    border-radius: 10px; font-size: 12px; display: none;" id="helpOverlay">
            <h4>مفاتيح التحكم:</h4>
            <p>← → ↑ ↓: التنقل</p>
            <p>F: ملء الشاشة</p>
            <p>P: عرض تلقائي</p>
            <p>Esc: خروج</p>
            <p>عجلة الفأرة: تنقل</p>
        </div>
    `;
    document.body.appendChild(helpOverlay);
    
    // Show help on first load
    setTimeout(() => {
        document.getElementById('helpOverlay').style.display = 'block';
        setTimeout(() => {
            document.getElementById('helpOverlay').style.display = 'none';
        }, 5000);
    }, 2000);
    
    // Add help button
    const helpButton = document.createElement('button');
    helpButton.innerHTML = '؟';
    helpButton.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        width: 40px; height: 40px; border-radius: 50%;
        background: rgba(255,255,255,0.2); color: white;
        border: 1px solid rgba(255,255,255,0.3);
        cursor: pointer; font-size: 18px; font-weight: bold;
    `;
    
    helpButton.addEventListener('click', () => {
        const overlay = document.getElementById('helpOverlay');
        overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
    });
    
    document.body.appendChild(helpButton);
});

// Add smooth scrolling and page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});