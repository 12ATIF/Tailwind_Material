/* ===========================================
   Muslim E-commerce - Main JavaScript
   =========================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initColorPlaceholders(); // Replace images with color placeholders first
    initNavbar();
    initMobileMenu();
    initQuantitySelectors();
    initSizeSelectors();
    initAddToCart();
    initFilters();
    initSmoothScroll();
});

/* ===== Replace Images with Color Placeholders ===== */
function initColorPlaceholders() {
    const colorClasses = ['placeholder-sage', 'placeholder-forest', 'placeholder-sand',
        'placeholder-brown', 'placeholder-olive', 'placeholder-moss',
        'placeholder-taupe', 'placeholder-cream'];

    // Replace product card images
    const productImages = document.querySelectorAll('.product-card img, [class*="aspect-"] img');
    productImages.forEach((img, index) => {
        const placeholder = document.createElement('div');
        const colorClass = colorClasses[index % colorClasses.length];
        placeholder.className = `w-full h-full img-placeholder ${colorClass}`;

        // Copy aspect ratio class if present
        const parentClasses = img.className.match(/aspect-\[[^\]]+\]/);
        if (parentClasses) {
            placeholder.classList.add(parentClasses[0]);
        } else if (img.classList.contains('aspect-[3/4]')) {
            placeholder.classList.add('aspect-[3/4]');
        }

        img.replaceWith(placeholder);
    });

    // Replace cart item images
    const cartImages = document.querySelectorAll('.cart-item img');
    cartImages.forEach((img, index) => {
        const placeholder = document.createElement('div');
        const colorClass = colorClasses[index % colorClasses.length];
        placeholder.className = `w-full h-full img-placeholder ${colorClass} rounded-lg`;
        img.replaceWith(placeholder);
    });

    // Replace checkout summary images  
    const checkoutImages = document.querySelectorAll('[class*="order"] img, .bg-white img');
    checkoutImages.forEach((img, index) => {
        const placeholder = document.createElement('div');
        const colorClass = colorClasses[index % colorClasses.length];
        placeholder.className = `w-full h-full img-placeholder ${colorClass} rounded-lg`;
        img.replaceWith(placeholder);
    });
}

/* ===== Navbar Scroll Effect ===== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ===== Mobile Menu ===== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const closeMenu = document.getElementById('close-menu');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', function () {
        mobileMenu.classList.add('active');
        if (mobileOverlay) mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeMenu) closeMenu.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
}

/* ===== Quantity Selectors ===== */
function initQuantitySelectors() {
    const qtyContainers = document.querySelectorAll('.qty-container');

    qtyContainers.forEach(container => {
        const minusBtn = container.querySelector('.qty-minus');
        const plusBtn = container.querySelector('.qty-plus');
        const input = container.querySelector('.qty-input');

        if (!minusBtn || !plusBtn || !input) return;

        minusBtn.addEventListener('click', function () {
            let value = parseInt(input.value) || 1;
            if (value > 1) {
                input.value = value - 1;
                updateCartTotal();
            }
        });

        plusBtn.addEventListener('click', function () {
            let value = parseInt(input.value) || 1;
            if (value < 99) {
                input.value = value + 1;
                updateCartTotal();
            }
        });

        input.addEventListener('change', function () {
            let value = parseInt(input.value) || 1;
            if (value < 1) value = 1;
            if (value > 99) value = 99;
            input.value = value;
            updateCartTotal();
        });
    });
}

/* ===== Size Selectors ===== */
function initSizeSelectors() {
    const sizeContainers = document.querySelectorAll('.size-selector');

    sizeContainers.forEach(container => {
        const options = container.querySelectorAll('.size-option');

        options.forEach(option => {
            option.addEventListener('click', function () {
                // Remove active from all options in this container
                options.forEach(opt => opt.classList.remove('active'));
                // Add active to clicked option
                this.classList.add('active');
            });
        });
    });
}

/* ===== Add to Cart ===== */
function initAddToCart() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            // Get product info
            const productCard = this.closest('.product-card') || this.closest('.product-detail');
            const productName = productCard?.querySelector('.product-name')?.textContent || 'Produk';

            // Show toast notification
            showToast(`${productName} ditambahkan ke keranjang!`);

            // Update cart badge
            updateCartBadge();
        });
    });
}

/* ===== Show Toast Notification ===== */
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);

    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ===== Update Cart Badge ===== */
function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    if (!cartBadge) return;

    let count = parseInt(cartBadge.textContent) || 0;
    cartBadge.textContent = count + 1;

    // Add animation
    cartBadge.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartBadge.style.transform = 'scale(1)';
    }, 200);
}

/* ===== Update Cart Total ===== */
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;

    cartItems.forEach(item => {
        const priceEl = item.querySelector('.item-price');
        const qtyEl = item.querySelector('.qty-input');

        if (priceEl && qtyEl) {
            const price = parseInt(priceEl.dataset.price) || 0;
            const qty = parseInt(qtyEl.value) || 1;
            subtotal += price * qty;
        }
    });

    // Update subtotal display
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const shipping = 25000; // Fixed shipping cost

    if (subtotalEl) {
        subtotalEl.textContent = formatRupiah(subtotal);
    }
    if (totalEl) {
        totalEl.textContent = formatRupiah(subtotal + shipping);
    }
}

/* ===== Format to Rupiah ===== */
function formatRupiah(number) {
    return 'Rp ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/* ===== Remove Cart Item ===== */
function removeCartItem(button) {
    const cartItem = button.closest('.cart-item');
    if (cartItem) {
        cartItem.style.opacity = '0';
        cartItem.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            cartItem.remove();
            updateCartTotal();
            checkEmptyCart();
        }, 300);
    }
}

/* ===== Check Empty Cart ===== */
function checkEmptyCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');

    if (cartItems.length === 0 && emptyCart && cartContent) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
    }
}

/* ===== Filter Toggle ===== */
function initFilters() {
    const filterToggle = document.getElementById('filter-toggle');
    const filterSidebar = document.getElementById('filter-sidebar');
    const closeFilter = document.getElementById('close-filter');

    if (!filterToggle || !filterSidebar) return;

    filterToggle.addEventListener('click', function () {
        filterSidebar.classList.toggle('active');
    });

    if (closeFilter) {
        closeFilter.addEventListener('click', function () {
            filterSidebar.classList.remove('active');
        });
    }
}

/* ===== Smooth Scroll ===== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ===== Image Gallery ===== */
function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage && thumbnail) {
        mainImage.src = thumbnail.src;

        // Update active thumbnail
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
    }
}

/* ===== Form Validation ===== */
function validateCheckoutForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('border-red-500');
            field.classList.remove('border-custom');
        } else {
            field.classList.remove('border-red-500');
            field.classList.add('border-custom');
        }
    });

    return isValid;
}

/* ===== Checkout Submit ===== */
function handleCheckoutSubmit(e) {
    e.preventDefault();

    if (validateCheckoutForm(e.target)) {
        showToast('Pesanan berhasil dibuat! Terima kasih.');
        // In real app, would submit to backend
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        showToast('Mohon lengkapi semua data yang diperlukan.');
    }
}
