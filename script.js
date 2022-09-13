const filterForm = document.getElementById("filter-form");
const sortSelect = document.getElementById("sort-select");
const sizeSelect = document.getElementById("size-select");
const gallery = document.getElementById("gallery");
const filterDescription = document.getElementById("filter-description");

let productsData = {};
const getProducts = async () => {
    const res = await fetch("./assets/json/products.json");
    const data = await res.json();
    productsData = data;
    return data;
}

const showProductsFirstTime = async () => {
    const data = await getProducts();
    const products = data.products;
    showProducts(products);
}
showProductsFirstTime();

const clearElement = function(element) {
    while(typeof element.firstChild !== `undefined` && element.firstChild !== null) {
        element.removeChild(element.firstChild);
    }
}

const showProducts = (products=false) => {
    if(!products) {
        products = productsData.products;
    }

    if(sortSelect[sortSelect.selectedIndex].value !== "label") {
        let sortParams = sortSelect[sortSelect.selectedIndex].value.split("-");
        products = sortProducts(products, sortParams[0], sortParams[1]);
    }

    if(sizeSelect[sizeSelect.selectedIndex].value !== "label") {
        products = filterProductsBySize(products, sizeSelect[sizeSelect.selectedIndex].value);
    }

    filterDescription.textContent = `${products.length} items`;

    const div = document.createElement("div");
    const fragment = document.createDocumentFragment();

    products.forEach((product) => {
        // console.log(product)
        const galleryItem = div.cloneNode();
        galleryItem.classList.add("gallery-item");
        const galleryItemName = document.createElement("h3");
        galleryItemName.classList.add("gallery-item-name");
        const galleryItemPrice = document.createElement("span");
        galleryItemPrice.classList.add("gallery-item-price");
        const galleryItemImage = div.cloneNode();
        galleryItemImage.classList.add("gallery-item-image");
        const galleryItemImageImg = document.createElement("img");


        galleryItemImageImg.setAttribute("src", `./assets/products/${product.image}`);

        galleryItemImage.appendChild(galleryItemImageImg);
        galleryItemName.textContent = product.name;
        galleryItemPrice.textContent = `$ ${product.price.toFixed(2)}`

        galleryItem.appendChild(galleryItemImage);
        galleryItem.appendChild(galleryItemName);
        galleryItem.appendChild(galleryItemPrice);

        fragment.appendChild(galleryItem);
    })

    clearElement(gallery);
    gallery.appendChild(fragment);
}

const sortKeys = (arr, key, direction) => {
    let sortable = arr.map(item => item[key]);
    sortable.sort();
    if(direction === "dec") {
        sortable.reverse();
    }
    return sortable;
}

const sortArr = (arr, key, direction) => {
    const sortedKeys = sortKeys(arr, key, direction);
    const sortedArr = [];
    sortedKeys.forEach((sKey) => {
        arr.forEach((item) => {
            if(item[key] === sKey) {
                sortedArr.push(item);
            }
        })
    })
    return sortedArr;
}

const sortProducts = (products, key, direction) => {
    const sortedProducts = sortArr(products, key, direction);
    console.log(sortedProducts);
    return sortedProducts;
    // showProducts(sortedProducts);
}

const filterProductsBySize = (products, size) => {
    const filteredProducts = products.filter((product) => {
        if(product.sizes.indexOf(size) !== -1) {
            return product;
        }
    })
    console.log(filteredProducts);
    return filteredProducts;
    // showProducts(filteredProducts);
}

filterForm.addEventListener("click", (e) => {
    const target = e.target;
    if(target === sortSelect || target === sizeSelect) {
        showProducts();
    }
});