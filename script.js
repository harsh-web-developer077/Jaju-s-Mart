// =====================================
// JAJU'S MART
// COMPLETE WEBSITE JAVASCRIPT
// =====================================


// =====================================
// CART DATA
// =====================================

let cart =
    JSON.parse(
        localStorage.getItem("jajusCart")
    ) || [];


// =====================================
// WISHLIST DATA
// =====================================

let wishlist =
    JSON.parse(
        localStorage.getItem("jajusWishlist")
    ) || [];


// =====================================
// CART COUNT
// =====================================

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) return;

    cartCount.textContent =
        cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

}


// =====================================
// ADD TO CART
// =====================================

function addToCart(name, price, image = "", quantity = 1) {
    quantity = Math.max(1, Number(quantity) || 1);
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity = (Number(existing.quantity) || 1) + quantity;
        existing.price = Number(price);
        if (image) existing.image = image;
    } else {
        cart.push({ name, price: Number(price), image, quantity });
    }
    localStorage.setItem("jajusCart", JSON.stringify(cart));
    updateCartCount();
}


// =====================================
// PRODUCT ADD BUTTONS
// =====================================

const addButtons =
    document.querySelectorAll(
        ".add-button"
    );


addButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const product =
                button.closest(
                    ".shop-product"
                );


            if (!product) return;


            const name =
                button.dataset.name ||
                product
                    .querySelector("h3")
                    .textContent
                    .trim();


            const price =
                Number(
                    button.dataset.price
                );


            const imageElement =
                product.querySelector("img");


            const image =
                imageElement
                    ? imageElement.src
                    : "";


            addToCart(
                name,
                price,
                image
            );


            const oldText =
                button.textContent;


            button.textContent =
                "Added ✓";


            button.style.background =
                "#16a34a";


            setTimeout(function() {

                button.textContent =
                    oldText;

                button.style.background =
                    "";

            }, 1000);

        }
    );

});


// =====================================
// WISHLIST BUTTONS
// =====================================

const wishlistButtons =
    document.querySelectorAll(
        ".wishlist-button"
    );


wishlistButtons.forEach(function(button) {

    const product =
        button.closest(
            ".shop-product"
        );


    if (!product) return;


    const name =
        product.dataset.name ||
        product
            .querySelector("h3")
            .textContent
            .trim();


    const priceElement =
        product.querySelector(
            ".product-bottom strong"
        );


    const price =
        priceElement
            ? priceElement.textContent.trim()
            : "₹0";


    const imageElement =
        product.querySelector("img");


    const image =
        imageElement
            ? imageElement.src
            : "";


    // Check whether already saved

    const alreadySaved =
        wishlist.some(function(item) {

            return item.name === name;

        });


    if (alreadySaved) {

        button.textContent =
            "♥";

    }


    button.addEventListener(
        "click",
        function() {

            const existing =
                wishlist.find(function(item) {

                    return item.name === name;

                });


            if (existing) {

                wishlist =
                    wishlist.filter(
                        function(item) {

                            return item.name !== name;

                        }
                    );


                button.textContent =
                    "♡";

            } else {

                wishlist.push({

                    name: name,

                    price: price,

                    image: image

                });


                button.textContent =
                    "♥";

            }


            localStorage.setItem(
                "jajusWishlist",
                JSON.stringify(wishlist)
            );

        }
    );

});


// =====================================
// WISHLIST PAGE
// =====================================

const wishlistContainer =
    document.getElementById(
        "wishlist-container"
    );


if (wishlistContainer) {

    displayWishlist();

}


function displayWishlist() {

    wishlistContainer.innerHTML = "";


    if (wishlist.length === 0) {

        wishlistContainer.innerHTML = `

            <div class="empty-wishlist">

                <div>
                    ❤️
                </div>

                <h2>
                    Your wishlist is empty
                </h2>

                <p>
                    Save products you love
                    and find them here later.
                </p>

                <a href="products.html">
                    Explore Products
                </a>

            </div>

        `;

        return;

    }


    wishlist.forEach(
        function(item, index) {

            const wishlistItem =
                document.createElement(
                    "div"
                );


            wishlistItem.className =
                "wishlist-item";


            wishlistItem.innerHTML = `

                <div class="wishlist-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                </div>


                <div class="wishlist-info">

                    <p>
                        JAJU'S MART
                    </p>

                    <h3>
                        ${item.name}
                    </h3>

                    <strong>
                        ₹${Number(item.price || 0).toLocaleString("en-IN")}
                    </strong>

                </div>


                <div class="wishlist-actions">

                    <button
                        class="wishlist-add"
                        data-name="${item.name}"
                        data-price="${item.price}">

                        Add to Cart

                    </button>


                    <button
                        class="wishlist-remove"
                        data-index="${index}">

                        Remove

                    </button>

                </div>

            `;


            wishlistContainer.appendChild(
                wishlistItem
            );

        }
    );


    // REMOVE BUTTONS

    const removeButtons =
        document.querySelectorAll(
            ".wishlist-remove"
        );


    removeButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    wishlist.splice(
                        index,
                        1
                    );


                    localStorage.setItem(
                        "jajusWishlist",
                        JSON.stringify(wishlist)
                    );


                    displayWishlist();

                }
            );

        }
    );


    // ADD WISHLIST ITEM TO CART

    const wishlistAddButtons =
        document.querySelectorAll(
            ".wishlist-add"
        );


    wishlistAddButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const name =
                        button.dataset.name;


                    const price =
                        Number(
                            button.dataset.price
                                .replace(
                                    /[^0-9]/g,
                                    ""
                                )
                        );


                    const item =
                        wishlist.find(
                            function(product) {

                                return product.name
                                    === name;

                            }
                        );


                    const image =
                        item
                            ? item.image
                            : "";


                    addToCart(
                        name,
                        price,
                        image
                    );


                    button.textContent =
                        "Added ✓";


                    setTimeout(function() {

                        button.textContent =
                            "Add to Cart";

                    }, 1000);

                }
            );

        }
    );

}


// =====================================
// CART PAGE
// =====================================

const cartContainer =
    document.getElementById(
        "cart-container"
    );


if (cartContainer) {

    displayCart();

}


function displayCart() {

    cartContainer.innerHTML = "";


    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="empty-cart">

                <div>
                    🛒
                </div>

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Looks like you haven't
                    added anything yet.
                </p>

                <a href="products.html">
                    Start Shopping
                </a>

            </div>

        `;


        updateCartTotal();

        return;

    }


    cart.forEach(
        function(item, index) {

            const cartItem =
                document.createElement(
                    "div"
                );


            cartItem.className =
                "cart-product";


            cartItem.innerHTML = `

                <div class="cart-product-info">

                    <div class="cart-product-image">

                        ${
                            item.image

                            ? `
                            <img
                                src="${item.image}"
                                alt="${item.name}"
                            >
                            `

                            : `
                            <span>
                                🛍️
                            </span>
                            `
                        }

                    </div>


                    <div>

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ₹${Number(item.price)
                                .toLocaleString("en-IN")}
                            × ${Number(item.quantity) || 1}
                            = ₹${(Number(item.price) * (Number(item.quantity) || 1))
                                .toLocaleString("en-IN")}
                        </p>

                    </div>

                </div>


                <button
                    class="remove-cart"
                    data-index="${index}">

                    Remove

                </button>

            `;


            cartContainer.appendChild(
                cartItem
            );

        }
    );


    // REMOVE CART ITEMS

    const removeButtons =
        document.querySelectorAll(
            ".remove-cart"
        );


    removeButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    cart.splice(
                        index,
                        1
                    );


                    localStorage.setItem(
                        "jajusCart",
                        JSON.stringify(cart)
                    );


                    displayCart();

                    updateCartCount();

                }
            );

        }
    );


    updateCartTotal();

}


// =====================================
// CART TOTAL
// =====================================

function updateCartTotal() {

    let total = 0;


    cart.forEach(
        function(item) {

            total +=
                Number(item.price) * (Number(item.quantity) || 1);

        }
    );


    const cartTotal =
        document.getElementById(
            "cart-total"
        );


    const grandTotal =
        document.getElementById(
            "grand-total"
        );


    if (cartTotal) {

        cartTotal.textContent =
            "₹" +
            total.toLocaleString(
                "en-IN"
            );

    }


    if (grandTotal) {

        grandTotal.textContent =
            "₹" +
            total.toLocaleString(
                "en-IN"
            );

    }

}


// =====================================
// SEARCH
// =====================================

const searchInput =
    document.getElementById(
        "search-input"
    );


const categoryFilter =
    document.getElementById(
        "category-filter"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterProducts
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterProducts
    );

}


function filterProducts() {

    const searchText =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";


    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "all";


    const products =
        document.querySelectorAll(
            ".shop-product"
        );


    products.forEach(
        function(product) {

            const name =
                (
                    product.dataset.name ||
                    product
                        .querySelector("h3")
                        .textContent
                )
                .toLowerCase();


            const category =
                product.dataset.category ||
                "all";


            const matchesSearch =
                name.includes(
                    searchText
                );


            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;


            if (
                matchesSearch &&
                matchesCategory
            ) {

                product.style.display =
                    "";

            } else {

                product.style.display =
                    "none";

            }

        }
    );

}


// =====================================
// START WEBSITE
// =====================================

updateCartCount();


// =====================================
// PRODUCT DETAIL PAGE HELPERS
// =====================================
function jajuAddCurrentProduct(button){
    const card=button.closest('.shop-product');
    if(!card) return;
    const name=button.dataset.name || card.dataset.name || card.querySelector('h3')?.textContent.trim();
    const price=Number(button.dataset.price || 0);
    const image=card.querySelector('img')?.src || '';
    addToCart(name,price,image);
    const old=button.textContent; button.textContent='Added ✓';
    setTimeout(()=>button.textContent=old,1000);
}

/* JAJU'S MART dynamic catalog helpers */
function jajuAddProduct(p){
  const cart=JSON.parse(localStorage.getItem("jajusCart")||"[]");
  const price=Math.round(Number(p.price)*(1-Number(p.offer||0)/100));
  const found=cart.find(x=>x.id===p.id);
  if(found) found.quantity=(found.quantity||1)+1;
  else cart.push({id:p.id,name:p.name,price,image:p.image,quantity:1});
  localStorage.setItem("jajusCart",JSON.stringify(cart));
  if(typeof updateCartCount==="function") updateCartCount();
}
function jajuBuyNow(p){jajuAddProduct(p);location.href="checkout.html";}
