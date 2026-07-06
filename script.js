/**
 * CORE RUNTIME STREAM - CYBERPUNK NETWORK TERMINAL ENVIRONMENT
 * AUTHOR: VINICIUS KENEDY
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DYNAMIC TYPEWRITER ENGINE FOR CORE ROLES
    const roles = ["PROGRAMADOR_SENIOR", "FULL-STACK_DEVELOPER", "GAME_ARCHITECT"];
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.querySelector('.typewriter-text');
    const typeSpeed = 120;
    const eraseSpeed = 60;
    const pauseDelay = 2000;

    function executeTypewriterStream() {
        const currentFullText = roles[currentRoleIndex];

        if (isDeleting) {
            // Remove character
            typewriterElement.textContent = currentFullText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            // Add character
            typewriterElement.textContent = currentFullText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }

        // Speed adjudication logic
        let currentDynamicSpeed = isDeleting ? eraseSpeed : typeSpeed;

        if (!isDeleting && currentCharIndex === currentFullText.length) {
            // Text completely rendered, initial pause sequence
            currentDynamicSpeed = pauseDelay;
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            currentDynamicSpeed = 400; // Recalibration buffer
        }

        setTimeout(executeTypewriterStream, currentDynamicSpeed);
    }

    if (typewriterElement) {
        executeTypewriterStream();
    }

    // 2. ACTIVE NAVIGATION NODE HIGHLIGHTER (SCROLL-SPY ARCHITECTURE)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link-cyber');

    window.addEventListener('scroll', () => {
        let currentActiveId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                currentActiveId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentActiveId}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. FORM ENCRYPTION SIMULATION SUBMIT DELEGATION
    const formElement = document.getElementById('cyberSecureForm');
    if (formElement) {
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = formElement.querySelector('.btn-cyber-submit');
            const originalText = submitBtn.innerHTML;
            
            // Trigger hacking terminal visual feedback transition
            submitBtn.disabled = true;
            submitBtn.style.background = 'var(--destructive)';
            submitBtn.innerHTML = `<span class="btn-text">ENCRYPTING_PACKET...</span>`;
            
            setTimeout(() => {
                submitBtn.style.background = 'var(--accent-tertiary)';
                submitBtn.innerHTML = `<span class="btn-text">PAYLOAD_SENT_SUCCESS!</span>`;
                
                // Print simulation diagnostic logs inside web browser native console
                console.log('%c[SYS_INFO] Payload transmit established. Packets successfully routed to Vinicius Kenedy matrix node.', 'color: #00ff88; font-weight: bold; font-family: monospace;');
                
                formElement.reset();
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.background = 'var(--main-color)';
                    submitBtn.innerHTML = originalText;
                }, 3000);
            }, 2000);
        });
    }

    // 4. INTERACTIVE MATRIX COMPONENT HOVER GLITCH DISRUPTION TRIGGER
    const titleGlitch = document.querySelector('.cyber-glitch-title');
    if (titleGlitch) {
        titleGlitch.addEventListener('mouseover', () => {
            titleGlitch.style.animation = 'glitch-anim 0.3s infinite linear';
            setTimeout(() => {
                titleGlitch.style.animation = 'none';
            }, 300);
        });
    }
});
