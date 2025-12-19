document.addEventListener('DOMContentLoaded', function() {
    // List of goat phrases
    const goatPhrases = [
        "We say prance, others say run for your lives.",
        "Hooves on the loose!",
        "We're so graceful",
        "Throws Scarf",
        "Chews Scarf due to being a goat",
        "Hoof",
        "Stomp"
    ];
    
    // Create an array of goat containers
    const goatContainers = [
        document.getElementById('goat1'),
        document.getElementById('goat2'),
        document.getElementById('goat3'),
        document.getElementById('goat4'),
        document.getElementById('goat5')
    ];
    
    // Initialize goat properties
    const goatProperties = goatContainers.map((container, index) => {
        const goat = container.querySelector('.goat');
        const image = goat.querySelector('.goat-image');
        const speechBubble = container.querySelector('.speech-bubble');
        const bubbleText = speechBubble.querySelector('.bubble-text');
        
        return {
            container: container,
            element: goat,
            image: image,
            speechBubble: speechBubble,
            bubbleText: bubbleText,
            position: Math.random() * (window.innerWidth - 160),
            direction: Math.random() > 0.5 ? 1 : -1,
            speed: 2 + Math.random() * 3,
            verticalOffset: (index + 1) * (window.innerHeight / 7),
            bounceHeight: 15 + Math.random() * 10,
            bounceSpeed: 80 + Math.random() * 40,
            bubbleTimer: null,
            bubbleCooldown: 3000 + Math.random() * 7000,
            lastBubbleTime: 0
        };
    });
    
    let animationId = null;
    let isAnimating = true;
    
    // Function to show a random speech bubble for a goat
    function showRandomBubble(goat) {
        // Hide any existing bubble
        goat.speechBubble.classList.remove('show');
        
        // Clear any existing timer
        if (goat.bubbleTimer) {
            clearTimeout(goat.bubbleTimer);
        }
        
        // Select a random phrase
        const randomPhrase = goatPhrases[Math.floor(Math.random() * goatPhrases.length)];
        goat.bubbleText.textContent = randomPhrase;
        
        // Show the bubble
        goat.speechBubble.classList.add('show');
        
        // Set a timer to hide the bubble after 2-4 seconds
        const bubbleDuration = 2000 + Math.random() * 2000;
        goat.bubbleTimer = setTimeout(() => {
            goat.speechBubble.classList.remove('show');
        }, bubbleDuration);
        
        // Update last bubble time
        goat.lastBubbleTime = Date.now();
    }
    
    // Function to manage speech bubbles for all goats
    function manageSpeechBubbles() {
        const currentTime = Date.now();
        
        goatProperties.forEach(goat => {
            // Check if it's time for this goat to show a bubble
            if (currentTime - goat.lastBubbleTime > goat.bubbleCooldown) {
                // Random chance to show a bubble (about 30% chance each check)
                if (Math.random() < 0.3) {
                    showRandomBubble(goat);
                    
                    // Set a new random cooldown for next bubble
                    goat.bubbleCooldown = 4000 + Math.random() * 8000;
                }
            }
        });
    }
    
    // Start the animation
    function startAnimation() {
        if (animationId) return; // Animation already running
        
        function animate() {
            // Update each goat
            goatProperties.forEach(goat => {
                // Move horizontally
                goat.position += goat.speed * goat.direction;
                
                // Boundary checking
                const windowWidth = window.innerWidth;
                const goatWidth = 160;
                
                if (goat.position >= windowWidth - goatWidth) {
                    goat.direction = -1;
                    goat.image.style.transform = 'scaleX(-1)';
                } else if (goat.position <= 0) {
                    goat.direction = 1;
                    goat.image.style.transform = 'scaleX(1)';
                }
                
                // Apply horizontal position to container
                goat.container.style.left = `${goat.position}px`;
                
                // Add vertical prancing effect (bouncing up and down)
                const bounce = Math.sin(Date.now() / goat.bounceSpeed) * goat.bounceHeight;
                goat.container.style.top = `calc(${goat.verticalOffset}px + ${bounce}px)`;
            });
            
            // Manage speech bubbles
            manageSpeechBubbles();
            
            // Continue the animation
            animationId = requestAnimationFrame(animate);
        }
        
        // Start the animation loop
        animationId = requestAnimationFrame(animate);
        isAnimating = true;
    }
    
    // Stop the animation
    function stopAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        isAnimating = false;
    }
    
    // Toggle animation when clicking any goat
    goatContainers.forEach(container => {
        container.addEventListener('click', function(event) {
            // If we're clicking the bubble, show a new one immediately
            if (event.target.closest('.speech-bubble')) {
                const goat = goatProperties.find(g => g.container === container);
                if (goat) {
                    showRandomBubble(goat);
                }
            } else {
                // Otherwise toggle animation
                if (isAnimating) {
                    stopAnimation();
                } else {
                    startAnimation();
                }
            }
        });
    });
    
    // Toggle animation when clicking anywhere else on the page
    document.body.addEventListener('click', function(event) {
        // Only toggle if not clicking on a goat, bubble, or sirens
        if (!event.target.closest('.goat-container') && 
            !event.target.closest('.message') &&
            !event.target.classList.contains('siren-image')) {
            if (isAnimating) {
                stopAnimation();
            } else {
                startAnimation();
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Adjust goat positions if they go off screen
        goatProperties.forEach(goat => {
            const windowWidth = window.innerWidth;
            const goatWidth = 160;
            
            if (goat.position > windowWidth - goatWidth) {
                goat.position = windowWidth - goatWidth;
                goat.direction = -1;
                goat.image.style.transform = 'scaleX(-1)';
            }
            
            // Update vertical positions based on new window height
            const index = goatProperties.indexOf(goat);
            goat.verticalOffset = (index + 1) * (window.innerHeight / 7);
        });
    });
    
    // Initialize random bubbles for some goats at the start
    setTimeout(() => {
        // Show initial bubbles for 2-3 random goats
        const initialBubbleCount = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < initialBubbleCount; i++) {
            const randomGoat = goatProperties[Math.floor(Math.random() * goatProperties.length)];
            showRandomBubble(randomGoat);
            // Set a random last bubble time so they don't all show bubbles at once
            randomGoat.lastBubbleTime = Date.now() - Math.random() * 5000;
        }
    }, 1000);
    
    // Start the animation automatically when page loads
    startAnimation();
    
    // Console message
    console.log("Larger goats are prancing with dual sirens!");
    console.log("Click anywhere to pause/resume. Click on speech bubbles to make goats say new things!");
});