const addItemForm = document.getElementById('addItemForm');
const itemTitle = document.getElementById('itemTitle');
const itemPrice = document.getElementById('itemPrice');
const itemDate = document.getElementById('itemDate');
const titleError = document.getElementById('titleError');
const priceError = document.getElementById('priceError');
const dateError = document.getElementById('dateError');
const saveItemBtn = document.getElementById('saveItemBtn');
const stockItems = document.getElementById('stockItems');

const addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));

const API_URL = 'http://localhost:8000/api/products';

document.addEventListener('DOMContentLoaded', () => {
    setDateTimeToNow();
    loadProducts();
});

function loadProducts() {
    stockItems.innerHTML = `
        <tr>
            <td colspan="4" class="text-center">
                <div class="spinner-border text-primary" role="status"></div>
            </td>
        </tr>
    `;

    axios.get(API_URL)
        .then(response => {
            stockItems.innerHTML = '';
            response.data.forEach((product, index) => {
                const row = document.createElement('tr');
                const formattedPrice = parseFloat(product.price).toFixed(2);
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${formattedPrice}</td>
                    <td>${product.date}</td>
                `;
                stockItems.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Ошибка загрузки товаров:', error);
            stockItems.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-danger">
                        Не удалось загрузить товары. Попробуйте позже.
                    </td>
                </tr>
            `;
        });
}

function setDateTimeToNow() {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    itemDate.value = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function validateForm() {
    let isValid = true;

    if (!itemTitle.value.trim()) {
        itemTitle.classList.add('is-invalid');
        titleError.style.display = 'block';
        isValid = false;
    } else {
        itemTitle.classList.remove('is-invalid');
        titleError.style.display = 'none';
    }

    if (!itemPrice.value.trim()) {
        itemPrice.classList.add('is-invalid');
        priceError.textContent = 'Price is required';
        priceError.style.display = 'block';
        isValid = false;
    } else if (parseFloat(itemPrice.value) < 0) {
        itemPrice.classList.add('is-invalid');
        priceError.textContent = 'Invalid price';
        priceError.style.display = 'block';
        isValid = false;
    } else {
        itemPrice.classList.remove('is-invalid');
        priceError.style.display = 'none';
    }

    if (!itemDate.value) {
        itemDate.classList.add('is-invalid');
        dateError.textContent = 'Date and time is required';
        dateError.style.display = 'block';
        isValid = false;
    } else {
        itemDate.classList.remove('is-invalid');
        dateError.style.display = 'none';
    }

    return isValid;
}

saveItemBtn.addEventListener('click', function () {
    if (validateForm()) {
        saveItemBtn.disabled = true;

        const newProduct = {
            name: itemTitle.value.trim(),
            price: parseFloat(itemPrice.value),
            date: itemDate.value
        };

        axios.post(API_URL, newProduct)
            .then(() => {

                addItemForm.reset();

                [itemTitle, itemPrice, itemDate].forEach(input => input.classList.remove('is-invalid'));
                [titleError, priceError, dateError].forEach(el => el.style.display = 'none');

                addItemModal.hide();

                loadProducts();
            })
            .catch(error => {
                console.error('Error adding product:', error);

                const errors = error.response?.data?.errors;

                if (errors) {
                    if (errors.name && errors.name.length > 0) {
                        itemTitle.classList.add('is-invalid');
                        titleError.textContent = errors.name[0];
                        titleError.style.display = 'block';
                    }
                    if (errors.price && errors.price.length > 0) {
                        itemPrice.classList.add('is-invalid');
                        priceError.textContent = errors.price[0];
                        priceError.style.display = 'block';
                    }
                    if (errors.date && errors.date.length > 0) {
                        itemDate.classList.add('is-invalid');
                        dateError.textContent = errors.date[0];
                        dateError.style.display = 'block';
                    }
                } else {
                    const modalBody = document.querySelector('.modal-body');
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'alert alert-danger';
                    errorDiv.textContent = 'Failed to add product. Please try again.';
                    modalBody.prepend(errorDiv);

                    setTimeout(() => errorDiv.remove(), 3000);
                }
            })
            .finally(() => {
                saveItemBtn.disabled = false;
                saveItemBtn.textContent = 'Add';
            });
    }
});

[itemTitle, itemPrice, itemDate].forEach((input, index) => {
    input.addEventListener('input', function () {
        this.classList.remove('is-invalid');
        [titleError, priceError, dateError][index].style.display = 'none';
    });
});

document.getElementById('addItemModal').addEventListener('hidden.bs.modal', function () {
    addItemForm.reset();
    [itemTitle, itemPrice, itemDate].forEach(input => input.classList.remove('is-invalid'));
    [titleError, priceError, dateError].forEach(el => el.style.display = 'none');

    setDateTimeToNow();
});
