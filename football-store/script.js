const products = [
	{ id: 'vx-elite', name: 'VX Elite', tag: 'Firm Ground', type: 'firm', price: 179, color: 'blue' },
	{ id: 'vx-ignite', name: 'VX Ignite', tag: 'Indoor', type: 'indoor', price: 129, color: 'red' },
	{ id: 'vx-pro', name: 'VX Pro', tag: 'Firm Ground', type: 'firm', price: 149, color: 'mix' },
	{ id: 'vx-phantom', name: 'VX Phantom', tag: 'Soft Ground', type: 'soft', price: 199, color: 'blue' },
	{ id: 'vx-rapid', name: 'VX Rapid', tag: 'Indoor', type: 'indoor', price: 119, color: 'red' },
	{ id: 'vx-lite', name: 'VX Lite', tag: 'Firm Ground', type: 'firm', price: 99, color: 'mix' },
];

const state = {
	filter: 'all',
	cart: new Map(), // id -> { product, qty }
};

const grid = document.getElementById('productGrid');
const chips = document.querySelectorAll('.chip');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartDialog = document.getElementById('cartDrawer');
const cartItemsEl = document.getElementById('cartItems');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const cartCountEl = document.getElementById('cartCount');

document.getElementById('year').textContent = new Date().getFullYear();

function formatPrice(value) {
	return `$${value.toFixed(0)}`;
}

function productImageSVG(color) {
	const blue = '#0057ff';
	const red = '#ff0033';
	const left = color === 'blue' ? blue : color === 'red' ? red : blue;
	const right = color === 'red' ? red : color === 'blue' ? blue : red;
	return `data:image/svg+xml;utf8,${encodeURIComponent(`
		<svg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'>
			<defs>
				<linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
					<stop offset='0%' stop-color='${left}'/>
					<stop offset='100%' stop-color='${right}'/>
				</linearGradient>
			</defs>
			<rect width='400' height='220' fill='none'/>
			<path d='M30 160c30-25 60-30 90-45 30-15 60-41 110-41 18 0 37 8 55 13 18 5 35 8 53 6-10 20-30 40-52 50-66 30-130 25-176 48-40 20-90 8-80-31z' fill='url(#g)' opacity='0.95'/>
		</svg>
	`)}`;
}

function renderProducts() {
	grid.innerHTML = '';
	const filtered = state.filter === 'all' ? products : products.filter(p => p.type === state.filter);
	for (const product of filtered) {
		const li = document.createElement('li');
		li.className = 'card';
		li.innerHTML = `
			<div class="card-media">
				<img alt="${product.name}" src="${productImageSVG(product.color)}">
			</div>
			<div class="card-body">
				<div class="card-meta"><span class="tag">${product.tag}</span><span class="price">${formatPrice(product.price)}</span></div>
				<h3 class="card-title">${product.name}</h3>
				<button class="add-btn" data-id="${product.id}">Add to cart</button>
			</div>
		`;
		grid.appendChild(li);
	}
}

function setActiveChip(targetType) {
	chips.forEach(c => c.classList.toggle('is-active', c.dataset.filter === targetType));
}

function updateCartView() {
	let subtotal = 0;
	let count = 0;
	cartItemsEl.innerHTML = '';
	for (const [id, entry] of state.cart) {
		subtotal += entry.product.price * entry.qty;
		count += entry.qty;
		const li = document.createElement('li');
		li.className = 'cart-item';
		li.innerHTML = `
			<img src="${productImageSVG(entry.product.color)}" alt="${entry.product.name}">
			<div>
				<div style="font-weight:600">${entry.product.name}</div>
				<div style="color:#8b93a7">${formatPrice(entry.product.price)} × ${entry.qty}</div>
			</div>
			<button class="icon-btn" aria-label="Remove" data-remove="${id}">×</button>
		`;
		cartItemsEl.appendChild(li);
	}
	cartSubtotalEl.textContent = formatPrice(subtotal);
	cartCountEl.textContent = String(count);
}

function addToCart(productId) {
	const product = products.find(p => p.id === productId);
	if (!product) return;
	const current = state.cart.get(productId) || { product, qty: 0 };
	current.qty += 1;
	state.cart.set(productId, current);
	updateCartView();
}

function removeFromCart(productId) {
	const current = state.cart.get(productId);
	if (!current) return;
	state.cart.delete(productId);
	updateCartView();
}

chips.forEach(chip => {
	chip.addEventListener('click', () => {
		state.filter = chip.dataset.filter;
		setActiveChip(state.filter);
		renderProducts();
	});
});

grid.addEventListener('click', (e) => {
	const target = e.target;
	if (target && target.matches('button.add-btn')) {
		addToCart(target.getAttribute('data-id'));
	}
});

cartItemsEl.addEventListener('click', (e) => {
	const target = e.target;
	if (target && target.matches('button[data-remove]')) {
		removeFromCart(target.getAttribute('data-remove'));
	}
});

openCartBtn.addEventListener('click', () => {
	if (typeof cartDialog.showModal === 'function') cartDialog.showModal();
});
closeCartBtn.addEventListener('click', () => cartDialog.close());

renderProducts();
updateCartView();