document.addEventListener('DOMContentLoaded', function() {
    const goat = document.getElementById('goat');
    const goatImage = document.getElementById('goatImage');
    const speedUpBtn = document.getElementById('speedUp');
    const speedDownBtn = document.getElementById('speedDown');
    const pauseBtn = document.getElementById('pauseBtn');
    
    let position = 0;
    let direction = 1; // 1 for right, -1 for left
    let speed = 3;
    let animationId = null;
    let isPrancing = true;
    
    // Start the animation
    function startAnimation() {
        if (animationId) return; // Animation already running
        
        function animate() {
            // Move the goat
            position += speed * direction;
            
            // Boundary checking - use window width
            const windowWidth = window.innerWidth;
            const goatWidth = goat.offsetWidth;
            
            if (position >= windowWidth - goatWidth) {
                direction = -1;
                // Flip image horizontally when going left
                goatImage.style.transform = 'scaleX(-1)';
            } else if (position <= 0) {
                direction = 1;
                // Reset flip when going right
                goatImage.style.transform = 'scaleX(1)';
            }
            
            // Apply the position
            goat.style.left = `${position}px`;
            
            // Add a prancing effect (bouncing up and down)
            const bounce = Math.sin(Date.now() / 100) * 10;
            goat.style.top = `calc(30% + ${bounce}px)`;
            
            // Continue the animation
            animationId = requestAnimationFrame(animate);
        }
        
        // Start the animation loop
        animationId = requestAnimationFrame(animate);
        isPrancing = true;
    }
    
    // Stop the animation
    function stopAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        isPrancing = false;
    }
    
    // Toggle animation
    function toggleAnimation() {
        if (isPrancing) {
            stopAnimation();
        } else {
            startAnimation();
        }
    }
    
    // Speed controls
    speedUpBtn.addEventListener('click', function() {
        if (speed < 10) {
            speed += 1;
            console.log(`Speed increased to: ${speed}`);
        }
    });
    
    speedDownBtn.addEventListener('click', function() {
        if (speed > 1) {
            speed -= 1;
            console.log(`Speed decreased to: ${speed}`);
        }
    });
    
    // Pause/Resume button
    pauseBtn.addEventListener('click', toggleAnimation);
    
    // Toggle animation on goat click
    goat.addEventListener('click', toggleAnimation);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Reset position if goat goes off screen
        if (position > window.innerWidth - goat.offsetWidth) {
            position = window.innerWidth - goat.offsetWidth;
            direction = -1;
            goatImage.style.transform = 'scaleX(-1)';
        }
    });
    
    // Start the animation automatically when page loads
    startAnimation();
    
    // Console message
    console.log("The goat is prancing! Click on the goat or use the Pause/Resume button to control animation.");
});