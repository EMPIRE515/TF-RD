/**
 * MEMBER SECTION LOGIC
 */

// 1. Reveal Members on Scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the card is visible
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the viewport
};

const memberObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Check if it's already showing to avoid re-triggering
            if (!entry.target.classList.contains('show')) {
                // Apply a staggered delay based on the card's index
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 150); 
            }
        }
    });
}, observerOptions);

// Attach the observer to all current and hidden member cards
document.querySelectorAll('.member-card').forEach(card => {
    memberObserver.observe(card);
});


// 2. "Load More" Toggle Functionality
const loadMoreBtn = document.getElementById('loadMore');

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
        const hiddenMembers = document.querySelectorAll('.hidden-member');
        
        hiddenMembers.forEach((member, index) => {
            // Change display from 'none' to 'block' (or 'flex' depending on your CSS)
            member.style.display = 'block';
            
            // Short timeout to allow the display change to register before animating
            setTimeout(() => {
                member.classList.add('show');
            }, index * 100);
        });

        // Hide the button after all members are revealed
        this.style.transform = "scale(0)";
        setTimeout(() => {
            this.style.display = 'none';
        }, 300);
    });
}

    // --- 2. FILTER INTERACTIVITY ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update UI buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
