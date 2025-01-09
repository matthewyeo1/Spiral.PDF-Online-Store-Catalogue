
// Filter function
function filterImages(filter) {
  const allImages = document.querySelectorAll('.image-item');
  allImages.forEach((img) => {
    img.style.display = 'none';
  });

  if (filter === 'all') {
    allImages.forEach((img) => {
      img.style.display = 'block';
    });
  } else {
    allImages.forEach((img) => {
      if (img.classList.contains(filter)) {
        img.style.display = 'block';
      }
    });
  }
  bindImageClickListeners();
}

// Ensure that the cart overlay is closed when the user clicks outside of it
function bindImageClickListeners() {
  const images = document.querySelectorAll('.image-item');
  images.forEach(image => {
    image.removeEventListener('click', imageClickHandler);
    image.addEventListener('click', imageClickHandler);
  });
}

// Add an event listener to the document to close the cart overlay when the user clicks outside of it
function imageClickHandler(event) {
  const image = event.target;
  const description = image.getAttribute('data-description');
  const descriptionText = document.getElementById('description-text');
  descriptionText.textContent = description;
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'flex';

  const addButton = image.nextElementSibling;
  if (addButton && addButton.classList.contains('add-to-cart-btn')) {
    addButton.style.display = 'block';
  }
}

// Overlay close logic
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close-btn');
closeBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
});

overlay.addEventListener('click', (event) => {
  if (event.target === overlay) {
    overlay.style.display = 'none';
  }
});


let cartItems = [];
let cartItemCount = 0;

const cartCount = document.getElementById('cart-count');
const snackbar = document.getElementById('snackbar');

// Add to cart logic
function showDescriptionBox(item) {
  const overlay = document.getElementById('overlay');
  const descriptionText = document.getElementById('description-text');
  const addToCartButton = document.getElementById('add-to-cart-btn');


  descriptionText.textContent = item.getAttribute('data-description');


  addToCartButton.onclick = () => {
    addToCart(item.getAttribute('data-name'),
      parseFloat(item.getAttribute('data-item-price'))
    );
  };


  overlay.style.display = 'block';
}

// Add to cart function
function addToCart(itemName, itemPrice) {
  const existingItem = cartItems.find(item => item.name === itemName);

  if (existingItem) {
    existingItem.quantity += 1; 
  } else {
    cartItems.push({
      name: itemName,
      price: itemPrice,
      quantity: 1 
    });
  }

  updateCartCount();

  overlay.style.display = 'none';

  updateCart(); 

  snackbar.className = "show";
  setTimeout(() => {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}

// Cart overlay
function showCartOverlay() {
  const cartOverlay = document.getElementById('cart-overlay');
  updateCart(); 
  cartOverlay.style.display = 'block';
}

// Close cart overlay
function closeCartOverlay() {
  const cartOverlay = document.getElementById('cart-overlay');
  cartOverlay.style.display = 'none';
}

document.getElementById('cart-icon').addEventListener('click', showCartOverlay);
document.getElementById('close-cart-overlay-btn').addEventListener('click', closeCartOverlay);

document.getElementById('close-cart-overlay-btn').addEventListener('click', () => {
  document.getElementById('cart-overlay').style.display = 'none';
});

const imageItems = document.querySelectorAll('.image-item');
imageItems.forEach((item) => {
  item.addEventListener('click', () => showDescriptionBox(item));
});

const cartIcon = document.getElementById('cart-icon');
const cartOverlay = document.getElementById('cart-overlay');
const cartIconImage = document.getElementById('cart-icon-image');

let isCartOpen = false;

// Alternate between cart and close icon
function toggleCart() {
  if (isCartOpen) {
    cartOverlay.style.display = 'none';
    cartIconImage.src = 'assets/images/cart_icon.jpg';
    cartIcon.classList.remove('close');
  } else {
    cartOverlay.style.display = 'block';
    cartIconImage.src = 'assets/images/cart_close_icon.jpg';
    cartIcon.classList.add('close');
  }
  isCartOpen = !isCartOpen;
}


cartIcon.addEventListener('click', () => {
  toggleCart();
  updateCartCount();
});



cartOverlay.addEventListener('click', (event) => {
  if (event.target === cartOverlay && isCartOpen) {
    toggleCart();
  }
});

// Update cart count and total price
function updateCart() {
  const cartItemsList = document.getElementById('cart-items-list');
  const totalPriceElement = document.getElementById('cart-total-price'); 
  cartItemsList.innerHTML = '';

  if (cartItems.length === 0) {
    cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
    totalPriceElement.textContent = '0.00'; 
  } else {
    let totalPrice = 0;

    cartItems.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        ${item.name} - $${item.price.toFixed(2)} 
        <button class="decrease-btn">-</button>
        ${item.quantity}
        <button class="increase-btn">+</button>
        <span class="item-total">= $${(item.price * item.quantity).toFixed(2)}</span>
      `;

   
      listItem.querySelector('.decrease-btn').onclick = () => {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          cartItems = cartItems.filter(cartItem => cartItem.name !== item.name);
        }
        updateCart();
        updateCartCount();
      };

      listItem.querySelector('.increase-btn').onclick = () => {
        item.quantity += 1;
        updateCart();
        updateCartCount();
      };

      cartItemsList.appendChild(listItem);

      totalPrice += item.price * item.quantity; 
    });

    totalPriceElement.textContent = `${totalPrice.toFixed(2)}`; 
  }
  updateCartCount();
}

// Update total cart count
function getTotalCartCount() {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}

// Helper for updating cart count
function updateCartCount() {
  cartCount.textContent = getTotalCartCount();
}


bindImageClickListeners();