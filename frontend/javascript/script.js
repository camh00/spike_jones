$(document).ready(function() {
    // Smooth scroll for bio timeline links
    $('.timelineLinks a, .bioButton, a[href="#top"]').on('click', function(e) {
        e.preventDefault();
        
        var target = $(this).attr('href');
        console.log("Scrolling to:", target);
        
        // Check if target element exists
        if ($(target).length) {
            $('html, body').stop().animate({
                scrollTop: $(target).offset().top - 80
            }, {
                duration: 800, // Faster animation
                easing: 'easeInOutCubic', // Smoother acceleration and deceleration
                complete: function() {
                    // Remove hash update to prevent jump
                    history.pushState(null, null, target);
                }
            });
        }
    });

    // Handle direct links to sections
    if (window.location.hash) {
        var hash = window.location.hash;
        if ($(hash).length) {
            setTimeout(function() {
                $('html, body').stop().animate({
                    scrollTop: $(hash).offset().top - 80
                }, {
                    duration: 800,
                    easing: 'easeInOutCubic'
                });
            }, 100);
        }
    }
});

// Custom easing function
$.easing.easeInOutCubic = function(x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
};

console.log("Timeline navigation initialized");