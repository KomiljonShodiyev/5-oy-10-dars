const apiUrl = 'https://dummyjson.com/products';

async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayProducts(data.products);
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Error occurred while loading products.');
    }
}

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';  
    products.forEach(product => {
        const productCard = `
        <div class="product-card">
            <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-48 object-cover mb-4 rounded-lg">
            <h2 class="product-title mb-2">${product.title}</h2>
            <p class="text-gray-300 mb-4">${product.description.substring(0, 100)}...</p>
            <p class="product-price mb-4">$${product.price}</p>
            <button onclick="orderProduct(${product.id}, '${product.thumbnail}')" class="button type1"></button>
        </div>
        `;
        productList.innerHTML += productCard;
    });
}

async function orderProduct(productId, productImage) {
    try {
        const productResponse = await fetch(`${apiUrl}/${productId}`);
        if (!productResponse.ok) {
            throw new Error('Product fetch response was not ok');
        }
        const product = await productResponse.json();

        const token = '7407358948:AAE1dMm1Vsk-vtqzjEZ_E76MBTEcwiXv8T4'; 
        const chatId = '-1002161821974';  
        const HTTPMessage = `https://api.telegram.org/bot${token}/sendMessage`;
        const HTTPPhoto = `https://api.telegram.org/bot${token}/sendPhoto`;

        const message = `Product: ${product.title}\nPrice: $${product.price}\nDescription: ${product.description}`;

        const photoResponse = await fetch(HTTPPhoto, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                photo: productImage,
                caption: message
            }),
        });

        if (!photoResponse.ok) {
            throw new Error('Telegram API photo response was not ok');
        }

        const data = await photoResponse.json();
        if (data.ok) {
            showModal();  
        } else {
            console.error('Telegram API error:', data);
            alert('Error occurred!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error occurred!');
    }
}

fetchProducts();

function showModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);  
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); 
}

window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        closeModal();
    }
}
