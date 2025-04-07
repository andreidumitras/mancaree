const foodItems = [
    { name: 'Ciorba de perisoare', price: 15 },
    { name: 'Tocanita de cartofi', price: 13 },
    { name: 'Chiftelute porc', price: 15 },
    { name: 'Orez', price: 10 },
    { name: 'Piure', price: 10 },
    { name: 'Cartofi prajiti', price: 10 },
    { name: 'Snitzel crispy piept pui', price: 18 },
    { name: 'Cotlet porc', price: 18 },
    { name: 'Piept pui', price: 18 },
    { name: 'Ceafa porc', price: 18 },
    { name: 'Salata verde', price: 8 },
    { name: 'Castraveti murati', price: 8 }
  ];
  
  const quantities = {};
  const foodContainer = document.getElementById('foodItems');
  const totalPriceEl = document.getElementById('totalPrice');
  const form = document.getElementById('orderForm');
  
  init()
  
  function init() {
    foodItems.forEach(item => {
      quantities[item.name] = 0;
  
      const div = document.createElement('div');
      div.className = 'food-item';
      div.innerHTML = `
        <span>${item.name} (${item.price} RON)</span>
        <div>
          <button type="button" class="btn-minus" onclick="updateQty('${item.name}', -1)">-</button>
          <span id="${item.name}-qty">0</span>
          <button type="button" class="btn-plus" onclick="updateQty('${item.name}', 1)">+</button>
        </div>
      `;
      foodContainer.appendChild(div);
    });
  }
  
  window.updateQty = function (itemName, delta) {
    quantities[itemName] = Math.max(0, quantities[itemName] + delta);
    document.getElementById(`${itemName}-qty`).textContent = quantities[itemName];
    updateTotal();
  };
  
  function updateTotal() {
    let total = 0;
    foodItems.forEach(item => {
      total += item.price * quantities[item.name];
    });
    totalPriceEl.textContent = total;
  }
  
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value.trim();
    if (!name) return alert("Please enter your name!");
  
    const order = {
      name,
      items: quantities,
      timestamp: new Date().toISOString()
    };
  
    try {
      const res = await fetch('https://your-server-url.com/submit_order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(order)
      });
  
      if (res.ok) {
        alert("Order sent successfully!");
        form.reset();
        Object.keys(quantities).forEach(k => quantities[k] = 0);
        updateTotal();
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      alert("Couldn't reach the server.");
    }
  });
  