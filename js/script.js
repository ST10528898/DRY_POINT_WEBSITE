/* Dry Point Website - basic cart and payment functions */
/* The cart is saved in the browser so items stay selected when you
   move between the Products, Cart and Payment pages. */

// Show a message on the Products page
function showMessage(text) {
  const message = document.getElementById('cart-message');
  if (message) {
    message.innerHTML = text;
  }
}

// Read the cart from the browser storage
function getCart() {
  const saved = localStorage.getItem('dryPointCart');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      return [];
    }
  }
  return [];
}

// Save the cart back to the browser storage
function saveCart(cart) {
  localStorage.setItem('dryPointCart', JSON.stringify(cart));
}

// Add an item to the cart (used by the Products page)
function addToCart(name, price) {
  let cart = getCart();

  // If the item is already in the cart, add one more to the quantity
  let found = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].quantity += 1;
      found = true;
    }
  }
  if (!found) {
    cart.push({ name: name, price: price, quantity: 1 });
  }

  saveCart(cart);
  showMessage('<strong>' + name + '</strong> has been added to your cart. <a href="cart.html">View my cart</a>');
}

// Change the quantity of an item in the cart (used by the Cart page)
function changeQuantity(name, change) {
  let cart = getCart();
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].quantity += change;
      if (cart[i].quantity < 1) {
        cart[i].quantity = 1;
      }
    }
  }
  saveCart(cart);
  showCart();
}

// Remove an item completely from the cart (used by the Cart page)
function removeFromCart(name) {
  let cart = getCart();
  let newCart = [];
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].name !== name) {
      newCart.push(cart[i]);
    }
  }
  saveCart(newCart);
  showCart();
}

// Work out the total price of everything in the cart
function cartTotal(cart) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].quantity;
  }
  return total;
}

// Show the items in the cart (used by the Cart page)
function showCart() {
  const contents = document.getElementById('cart-contents');
  const totalText = document.getElementById('cart-total');
  const cart = getCart();

  if (!contents) {
    return;
  }

  if (cart.length === 0) {
    contents.innerHTML = '<p>Your cart is empty.</p>';
    totalText.innerHTML = '<p><strong>Total: R 0.00</strong></p>';
    return;
  }

  let table = '<table border="1" cellpadding="8" cellspacing="0">';
  table += '<tr><th>Item</th><th>Price</th><th>Quantity</th><th>Line total</th><th>Change</th></tr>';
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const lineTotal = item.price * item.quantity;
    table += '<tr>';
    table += '<td>' + item.name + '</td>';
    table += '<td>R ' + item.price.toFixed(2) + '</td>';
    table += '<td>' + item.quantity + '</td>';
    table += '<td>R ' + lineTotal.toFixed(2) + '</td>';
    table += '<td>';
    table += '<a href="#" onclick="changeQuantity(\'' + item.name + '\', 1); return false;">Add one</a> | ';
    table += '<a href="#" onclick="changeQuantity(\'' + item.name + '\', -1); return false;">Remove one</a> | ';
    table += '<a href="#" onclick="removeFromCart(\'' + item.name + '\'); return false;">Remove all</a>';
    table += '</td>';
    table += '</tr>';
  }
  table += '</table>';

  contents.innerHTML = table;
  totalText.innerHTML = '<p><strong>Total: R ' + cartTotal(cart).toFixed(2) + '</strong></p>';
}

// Show the order summary on the Payment page
function showOrderSummary() {
  const summary = document.getElementById('order-summary');
  const totalText = document.getElementById('order-total');
  const cart = getCart();

  if (!summary) {
    return;
  }

  if (cart.length === 0) {
    summary.innerHTML = '<p>Your cart is empty. <a href="products.html">Add items to your cart first</a>.</p>';
    if (totalText) {
      totalText.innerHTML = '';
    }
    return;
  }

  let table = '<table border="1" cellpadding="8" cellspacing="0">';
  table += '<tr><th>Item</th><th>Price</th><th>Quantity</th><th>Line total</th></tr>';
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    table += '<tr><td>' + item.name + '</td><td>R ' + item.price.toFixed(2) + '</td><td>' + item.quantity + '</td><td>R ' + (item.price * item.quantity).toFixed(2) + '</td></tr>';
  }
  table += '</table>';

  summary.innerHTML = table;
  totalText.innerHTML = '<p><strong>Total to pay: R ' + cartTotal(cart).toFixed(2) + '</strong></p>';
}

// Handle the payment (used by the Payment page)
function payNow() {
  const cart = getCart();
  const status = document.getElementById('payment-status');
  const name = document.getElementById('full-name');
  const cardNumber = document.getElementById('card-number');
  const cardExpiry = document.getElementById('card-expiry');
  const cardCvv = document.getElementById('card-cvv');

  if (cart.length === 0) {
    status.innerHTML = 'Your cart is empty. Add items to your cart before paying.';
    return;
  }
  if (!name.value || !cardNumber.value || !cardExpiry.value || !cardCvv.value) {
    status.innerHTML = 'Please fill in all the payment details.';
    return;
  }

  status.innerHTML = 'Thank you, ' + name.value + '. Your payment of R ' + cartTotal(cart).toFixed(2) + ' has been received. Your order is confirmed.';
  localStorage.removeItem('dryPointCart');
  document.getElementById('payment-form').reset();
  showOrderSummary();
}

// Run the right function when each page loads
document.addEventListener('DOMContentLoaded', function () {
  // Put the current year in the footer
  document.querySelectorAll('[data-year]').forEach(function (element) {
    element.textContent = new Date().getFullYear();
  });

  if (document.getElementById('cart-contents')) {
    showCart();
  }

  if (document.getElementById('order-summary')) {
    showOrderSummary();
  }
});
