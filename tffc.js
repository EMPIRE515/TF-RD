document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('productModal');
    const cards = document.querySelectorAll('.prod-card');
    const filterBtns = document.querySelectorAll('.p-filter');
    const closeBtn = document.querySelector('.close-modal');

    // --- 1. POPUP INTERACTIVITY ---
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Extract data from the clicked HTML element's attributes
            const name = card.getAttribute('data-name');
            const price = card.getAttribute('data-price');
            const desc = card.getAttribute('data-desc');
            const cat = card.getAttribute('data-category');
            const img = card.querySelector('img').src;
            const advantages = card.getAttribute('data-advantages').split('|');

            // Inject into Modal
            document.getElementById('m-title').textContent = name;
            document.getElementById('m-price').textContent = price;
            document.getElementById('m-desc').textContent = desc;
            document.getElementById('m-cat').textContent = cat.toUpperCase();
            document.getElementById('m-img').src = img;

            const list = document.getElementById('m-advantages');
            list.innerHTML = '';
            advantages.forEach(adv => {
                const li = document.createElement('li');
                li.textContent = adv;
                list.appendChild(li);
            });

            modal.style.display = 'flex';
        });
    });

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

    // --- 3. CLOSE MODAL ---
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };
});

let cart = JSON.parse(localStorage.getItem('tfrd_cart')) || [];

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
}

function addToCart(btn, event) {
    event.stopPropagation(); // Prevents opening the modal
    const card = btn.closest('.prod-card');
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);

    // Check if already in list
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }

    saveCart();
    updateCartUI();
    toggleCart(); // Show sidebar when item added
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    
    container.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        count += item.qty;
        container.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.price.toLocaleString()} XAF x ${item.qty}</small>
                </div>
                <button onclick="removeFromCart(${index})" style="background:none;border:none;color:red;cursor:pointer;">&times;</button>
            </div>
        `;
    });

    totalEl.innerText = total.toLocaleString() + " XAF";
    countEl.innerText = count;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('tfrd_cart', JSON.stringify(cart));
}

function processOrder() {
    if (cart.length === 0) return alert("Your list is empty!");
    
    const payment = document.querySelector('input[name="payment"]:checked').value;
    let message = "Hello TFRD, I would like to order:%0A";
    
    cart.forEach(item => {
        message += `- ${item.name} (x${item.qty})%0A`;
    });
    
    message += `%0A*Total:* ${document.getElementById('cart-total').innerText}`;
    message += `%0A*Payment Method:* ${payment === 'momo' ? 'Mobile Money' : 'Cash on Delivery'}`;
    
    // WhatsApp redirect
    window.open(`https://wa.me/+237657590881text=${message}`, '_blank');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateCartUI);


let currentProduct = null; // Tracks the currently open product for the modal button

function openProductModal(card) {
    // 1. Extract data from the card
    const data = {
        name: card.dataset.name,
        price: card.dataset.price,
        cat: card.dataset.category,
        desc: card.dataset.desc || "No description available for this natural treasure.",
        img: card.querySelector('img').src,
        advantages: card.dataset.advantages ? card.dataset.advantages.split('|') : []
    };

    currentProduct = card; // Store reference for the "Add to List" button inside modal

    // 2. Populate Modal Elements
    document.getElementById('m-title').innerText = data.name;
    document.getElementById('m-price').innerText = parseInt(data.price).toLocaleString() + " XAF";
    document.getElementById('m-cat').innerText = data.cat;
    document.getElementById('m-desc').innerText = data.desc;
    document.getElementById('m-img').src = data.img;

    // 3. Clear and build Advantages List
    const advList = document.getElementById('m-advantages');
    advList.innerHTML = '';
    data.advantages.forEach(adv => {
        const li = document.createElement('li');
        li.innerText = adv.trim();
        advList.appendChild(li);
    });

    // 4. Show Modal
    document.getElementById('productModal').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Close modal if user clicks outside the content area
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target == modal) {
        closeProductModal();
    }
}

// Helper to add item to list directly from the modal
function addCurrentToCart() {
    if (currentProduct) {
        // reuse your existing addToCart logic
        const btn = currentProduct.querySelector('.add-to-list-btn');
        // We pass a dummy event to prevent errors with stopPropagation
        addToCart(btn, { stopPropagation: () => {} }); 
        closeProductModal();
    }
}