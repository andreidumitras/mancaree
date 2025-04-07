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
        <span>${item.name} (${item.price} Lei)</span>
        <div>
          <button type="button" class="btn-minus" onclick="updateQty('${item.name}', -1)">-</button>
          <button type="button" class="btn-plus" onclick="updateQty('${item.name}', 1)">+</button>
          <span id="${item.name}-qty">0</span>
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
    // grab the name and the surname
    const nuem = document.getElementById('nume').value.trim();
    const prenume = document.getElementById('prenume').value.trim();
    
    // verify to be filled all the textboxes
    if (!nume || !prenume)
      return alert("Te rog completeaza campurile de nume si prenume, in mod complet!");
    
    const items = [];
    let totalPrice = 0;

    foodItems.forEach(item => {
      const quantity = quantities[item.name];
      if (quantity > 0) {
        items.push({
          name: item.name,
          price: item.price,
          quantity: quantity
        });
        totalPrice += item.price * quantity;
      }
    });
    // create the order
    const order = {
      nume,
      prenume,
      items,
      total_price: totalPrice
    };
  
    try {
      const result = await fetch('https://e19e6e834d5d88f4f3d46f6f7b12ae47.serveo.net/submit_order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(order)
      });
  
      if (result.ok) {
        alert("Comanda ta a fost trimisa cu succes!");
        // Hide the form and food options
        form.style.display = 'none';
        foodContainer.style.display = 'none';

        // Optionally, display a thank-you message
        const thankYouMessage = document.createElement('div');
        thankYouMessage.textContent = "Multumim pentru comanda ta!";
        thankYouMessage.style.fontSize = '20px';
        thankYouMessage.style.textAlign = 'center';
        document.body.appendChild(thankYouMessage);

        // Reset the form and quantities
        form.reset();
        Object.keys(quantities).forEach(k => quantities[k] = 0);
        updateTotal();
      } else {
        alert("Ceva nu a mers bine. Vorbeste cu *blandete* cu Andrei!");
      }
    } catch (err) {
      alert("Nu a mai ajuns comanda la server. Vorbeste cu blandete cu Andrei si veti gasi o solutie.");
    }
  });
  