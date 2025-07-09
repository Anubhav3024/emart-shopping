 const categories = ['Electronics', 'Clothing', 'Home', 'Accessories'];
const products = [];

for (let i = 0; i < 60; i++) {
  const cat = categories[i % categories.length];
  products.push({
    id: i,
    title: `${cat} Product ${i + 1}`,
    price: Math.floor(Math.random() * 1500) + 500,
    category: cat,
    image: `/images/p${(i % 38) + 1}.jpg`,
    description: `This is a top-quality ${cat} item. Durable, modern and highly rated by customers.`
  });
  liked: true
}
const sampleReviews = [
  "Amazing product!",
  "Really worth the price.",
  "Would recommend to others.",
  "Quality is top notch!",
  "Delivery was fast and smooth."
];

let likedItems = [];
let orders = [];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let tracker = '';

function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}
function preloadImages() {
  for (let i = 1; i <= 38; i++) {
    const img = new Image();
    img.src = `assets/images/p${i}.jpg`;
  }
}
preloadImages(); // Call once when the app starts

function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";
  list.forEach(p => {
    const isLiked = likedItems.includes(p.id);
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <span class="like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(event, ${p.id})">❤️</span>
      <div class="product-top">
        <img src="${p.image}" alt="${p.title}">
      </div>
      <div class="product-bottom">
        <h3>${p.title}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
        <button onclick="buyNow(${p.id})">Buy Now</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openProductDetail(id) {
  const product = products.find(p => p.id === id);
  currentDetailId = id;

  document.getElementById("detail-img").src = product.image;
  document.getElementById("detail-title").textContent = product.title;
  document.getElementById("detail-description").textContent = product.description || "This is a sample description for the product. It's high-quality, durable, and worth the price.";
  document.getElementById("detail-price").textContent = product.price;

  document.getElementById("productDetailModal").classList.remove("hidden");
}

function closeProductDetail() {
  document.getElementById("productDetailModal").classList.add("hidden");
}

//search on enter
function handleSearchKey(event) {
  if (event.key === "Enter") filterSortSearch();
}
//like/unlike product
function toggleLike(e, id) {
  e.stopPropagation();
  if (likedItems.includes(id)) {
    likedItems = likedItems.filter(x => x !== id);
  } else {
    likedItems.push(id);
  }
  renderProducts(products); // refresh
}
//buynow logic
function buyNow(id) {
  const p = products.find(prod => prod.id === id);
  orders.push(p);
  alert(`${p.title} bought successfully!`);
}

// toggle like/unlike and re-render products


function toggleLike(event, id) {
  event.stopPropagation();
  const product = products.find(p => p.id === id);
  product.liked = !product.liked;
  filterSortSearch(); // re-render
}

function openProductDetail(id) {
  const p = products.find(pr => pr.id === id);
  const modal = document.getElementById('productDetailModal');
  modal.classList.add('active');
  modal.innerHTML = `
    <div class="detail-card">
      <span class="close-detail" onclick="closeProductDetail()">&times;</span>
      <img src="${p.image}" alt="${p.title}" />
      <h2>${p.title}</h2>
      <p>₹${p.price}</p>
      <div class="rating">⭐⭐⭐⭐☆ (4.0)</div>
      <button onclick="addToCart(${p.id}); closeProductDetail()">Buy Now</button>
    </div>
  `;
}

function closeProductDetail() {
  document.getElementById('productDetailModal').classList.remove('active');
}
// Track the currently viewed product detail
let currentDetailId = null;


function filterSortSearch() {
  const cat = filterCat;
  let list = [...products];
  const s = document.getElementById("searchInput").value.toLowerCase();
  if (cat && cat !== 'all') list = list.filter(p => p.category === cat);
  if (s) list = list.filter(p => p.title.toLowerCase().includes(s));
  const sort = document.getElementById("priceSort").value;
  if (sort==='low-high') list.sort((a,b)=>a.price-b.price);
  if (sort==='high-low') list.sort((a,b)=>b.price-a.price);
  renderProducts(list);
}

function addToCart(id) {
  const p = products.find(x=>x.id===id);
  cart.push(p);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function toggleCartModal(){
  const m = document.getElementById('cartModal');
  m.classList.toggle('hidden');
  if (!m.classList.contains('hidden')) renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";
  cart.forEach(p => {
    const item = document.createElement("div");
    item.className = "cart-product-card";
    item.innerHTML = `
      <img src="${p.image}" alt="${p.title}" />
      <h4>${p.title}</h4>
      <p>₹${p.price}</p>
      <button onclick="buyNow(${p.id})">Buy Now</button>
    `;
    container.appendChild(item);
  });
}
function view(type) {
  if (type === "orders") {
    alert("Ordered Items:\n" + orders.map(o => o.title).join(", ") || "None");
  } else if (type === "liked") {
    const liked = products.filter(p => likedItems.includes(p.id));
    alert("Liked Items:\n" + liked.map(p => p.title).join(", ") || "None");
  }
}

function logout() {
  likedItems = [];
  orders = [];
  cart = [];
  localStorage.clear();
  updateCartCount();
  alert("Logged out successfully.");
  renderProducts(products);
}


function toggleAccountMenu(){
  document.getElementById('accMenu').classList.toggle('hidden');
}

function view(section){
  alert('Viewing: '+section);
}

let filterCat = 'all';
document.querySelectorAll('nav.main-nav button').forEach(b=>{
  b.onclick = () => {
    filterCat = b.dataset.cat;
    filterSortSearch();
  };
});
document.getElementById('buyAgain').onclick = ()=>{
  const prior = [...new Set(cart.map(p=>p.category))];
  filterCat = prior[0] || 'all';
  filterSortSearch();
};
document.getElementById('searchInput').addEventListener('input', filterSortSearch);
document.getElementById('priceSort').addEventListener('change', filterSortSearch);

function openTrack(){
  tracker = prompt('Enter your order tracking number:');
  if (tracker) alert(`Tracking ${tracker}: Your order is being processed.`);
}

window.onload = ()=>{
  renderProducts(products);
  updateCartCount();
};
