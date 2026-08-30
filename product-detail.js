
(function(){
"use strict";
const page=document.querySelector(".product-detail-page");
if(!page)return;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const money=n=>"₹"+Number(n||0).toLocaleString("en-IN");
function read(k){try{return JSON.parse(localStorage.getItem(k)||"[]")}catch(e){return[]}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
const name=page.dataset.productName;
const price=Number(page.dataset.productPrice||0);
const image=page.dataset.productImage||"";
const productId=page.dataset.productId||name;
let cart=read("jajusCart");
let wishlist=read("jajusWishlist");

function sync(){
 const count=cart.reduce((n,x)=>n+(Number(x.quantity)||1),0);
 $$("#cart-count,.cart-count,[data-cart-count]").forEach(x=>x.textContent=count);
 $$("#wishlist-count,.wishlist-count,[data-wishlist-count]").forEach(x=>x.textContent=wishlist.length);
}
function toast(msg){
 let t=$(".product-toast");
 if(!t){t=document.createElement("div");t.className="product-toast";document.body.appendChild(t)}
 t.textContent=msg;t.classList.add("show");clearTimeout(t.timer);t.timer=setTimeout(()=>t.classList.remove("show"),1500);
}
function saved(){return wishlist.some(x=>x.id===productId||x.name===name)}
function refreshWish(){
 const b=$(".product-wish-float");
 if(!b)return;
 b.textContent=saved()?"♥":"♡";b.classList.toggle("is-saved",saved());
}
function addToCart(q){
 q=Math.max(1,parseInt(q,10)||1);
 let item=cart.find(x=>x.id===productId||x.name===name);
 if(item){item.quantity=(Number(item.quantity)||1)+q;item.price=price;item.image=image;item.id=productId}
 else cart.push({id:productId,name,price,image,quantity:q});
 write("jajusCart",cart);sync();toast("Added to cart ✓");
}
const input=$(".product-quantity input");
$$(".product-quantity button").forEach(b=>b.addEventListener("click",()=>{
 let v=Math.max(1,parseInt(input.value,10)||1);
 input.value=Math.max(1,v+(b.dataset.action==="minus"?-1:1));
}));
$(".product-wish-float")?.addEventListener("click",()=>{
 if(saved()) wishlist=wishlist.filter(x=>x.id!==productId&&x.name!==name);
 else wishlist.push({id:productId,name,price,image});
 write("jajusWishlist",wishlist);refreshWish();sync();toast(saved()?"Saved to wishlist ♥":"Removed from wishlist");
});
$(".product-add-cart")?.addEventListener("click",()=>addToCart(input?.value||1));
$(".product-buy-now")?.addEventListener("click",()=>{addToCart(input?.value||1);setTimeout(()=>location.href="checkout.html",150)});
refreshWish();sync();
})();
