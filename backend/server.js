require("dotenv").config();
const express=require("express"), cors=require("cors"), path=require("path"), fs=require("fs"), crypto=require("crypto"), Razorpay=require("razorpay"), nodemailer=require("nodemailer");
const app=express(); app.use(cors()); app.use(express.json({limit:"1mb"})); app.use(express.static(path.join(__dirname,"..")));
const PORT=process.env.PORT||3000, KEY_ID=process.env.RAZORPAY_KEY_ID||"", KEY_SECRET=process.env.RAZORPAY_KEY_SECRET||"", ADMIN_TOKEN=process.env.ADMIN_TOKEN||"change-this-admin-token";
const DATA=path.join(__dirname,"data"); if(!fs.existsSync(DATA))fs.mkdirSync(DATA,{recursive:true});
const ORDERS=path.join(DATA,"orders.json"), PRODUCTS=path.join(DATA,"products.json");
if(!fs.existsSync(ORDERS))fs.writeFileSync(ORDERS,"[]"); if(!fs.existsSync(PRODUCTS))fs.writeFileSync(PRODUCTS,"[]");
const read=f=>JSON.parse(fs.readFileSync(f,"utf8")), write=(f,x)=>fs.writeFileSync(f,JSON.stringify(x,null,2));
const auth=(req,res,next)=>req.headers["x-admin-token"]===ADMIN_TOKEN?next():res.status(401).json({error:"Unauthorized"});
const rp=(KEY_ID&&KEY_SECRET)?new Razorpay({key_id:KEY_ID,key_secret:KEY_SECRET}):null;

const MAIL_HOST=process.env.SMTP_HOST||"";
const MAIL_PORT=Number(process.env.SMTP_PORT||587);
const MAIL_USER=process.env.SMTP_USER||"";
const MAIL_PASS=process.env.SMTP_PASS||"";
const MAIL_FROM=process.env.MAIL_FROM||MAIL_USER;
const STORE_EMAIL=process.env.STORE_EMAIL||MAIL_USER;
const transporter=(MAIL_HOST&&MAIL_USER&&MAIL_PASS)
  ? nodemailer.createTransport({host:MAIL_HOST,port:MAIL_PORT,secure:MAIL_PORT===465,auth:{user:MAIL_USER,pass:MAIL_PASS}})
  : null;

function money(n){return "₹"+Number(n).toLocaleString("en-IN");}
async function sendOrderEmails(order){
  if(!transporter) return {sent:false,reason:"SMTP not configured"};
  const customerEmail=String(order.customer.email||"").trim();
  const customerName=[order.customer.firstName,order.customer.lastName].filter(Boolean).join(" ")||"Customer";
  const itemLines=order.items.map(i=>`<li>${i.name} × ${i.quantity} — ${money(i.price*i.quantity)}</li>`).join("");
  const address=`${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}`;
  const subject=`Jaju's Mart Order ${order.orderId} Confirmed`;
  const customerHtml=`<div style="font-family:Arial,sans-serif;line-height:1.6">
    <h2>Jaju's Mart — Order Confirmation</h2>
    <p>Hi ${customerName},</p>
    <p>Your order <strong>${order.orderId}</strong> has been confirmed.</p>
    <ul>${itemLines}</ul>
    <p><strong>Total: ${money(order.total)}</strong></p>
    <p>Payment: ${order.paymentStatus}</p>
    <p>Delivery address: ${address}</p>
    <p>Thank you for shopping with Jaju's Mart!</p>
  </div>`;
  const adminHtml=`<div style="font-family:Arial,sans-serif;line-height:1.6">
    <h2>New Jaju's Mart Order</h2>
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <p><strong>Customer:</strong> ${customerName}<br>
    <strong>Phone:</strong> ${order.customer.phone}<br>
    <strong>Email:</strong> ${customerEmail||"Not provided"}<br>
    <strong>Address:</strong> ${address}</p>
    <ul>${itemLines}</ul>
    <p><strong>Total: ${money(order.total)}</strong></p>
    <p><strong>Payment:</strong> ${order.paymentStatus}</p>
  </div>`;
  const jobs=[];
  if(customerEmail) jobs.push(transporter.sendMail({from:MAIL_FROM,to:customerEmail,subject,html:customerHtml}));
  if(STORE_EMAIL) jobs.push(transporter.sendMail({from:MAIL_FROM,to:STORE_EMAIL,subject:`New Jaju's Mart Order — ${order.orderId}`,html:adminHtml}));
  if(!jobs.length) return {sent:false,reason:"No recipient email configured"};
  await Promise.all(jobs);
  return {sent:true};
}

const oid=()=> "JM-"+Date.now().toString(36).toUpperCase()+"-"+crypto.randomBytes(3).toString("hex").toUpperCase();

app.get("/api/products",(req,res)=>res.json(read(PRODUCTS).filter(p=>p.active)));
app.get("/api/admin/products",auth,(req,res)=>res.json(read(PRODUCTS)));
app.patch("/api/admin/products/:id",auth,(req,res)=>{
 const ps=read(PRODUCTS),p=ps.find(x=>x.id===req.params.id); if(!p)return res.status(404).json({error:"Not found"});
 if(req.body.price!==undefined){const n=Number(req.body.price);if(!Number.isFinite(n)||n<0)return res.status(400).json({error:"Invalid price"});p.price=n;}
 if(req.body.offer!==undefined){const n=Number(req.body.offer);if(!Number.isFinite(n)||n<0||n>90)return res.status(400).json({error:"Invalid offer"});p.offer=n;}
 if(req.body.active!==undefined)p.active=!!req.body.active;
 write(PRODUCTS,ps);res.json(p);
});

app.post("/api/create-order",async(req,res)=>{
 try{
  const cart=Array.isArray(req.body.cart)?req.body.cart:[],customer=req.body.customer||{},paymentMethod=req.body.paymentMethod==="cod"?"cod":"online";
  if(!cart.length)return res.status(400).json({error:"Cart empty"});
  const catalog=read(PRODUCTS);
  const items=cart.map(x=>{const p=catalog.find(y=>y.id===x.id);if(!p||!p.active)throw new Error("Invalid product");const q=Math.max(1,Number(x.quantity||1)),price=Math.round(p.price*(1-p.offer/100));return {id:p.id,name:p.name,price,quantity:q};});
  const total=items.reduce((s,x)=>s+x.price*x.quantity,0),orderId=oid();let ro=null;
  if(paymentMethod==="online"){if(!rp)return res.status(503).json({error:"Razorpay not configured"});ro=await rp.orders.create({amount:total*100,currency:"INR",receipt:orderId});}
  const order={orderId,createdAt:new Date().toISOString(),status:paymentMethod==="cod"?"NEW":"PAYMENT_PENDING",paymentStatus:paymentMethod==="cod"?"COD_PENDING":"PENDING",paymentMethod,razorpayOrderId:ro?.id||null,razorpayPaymentId:null,customer,items,total};
  const os=read(ORDERS);os.unshift(order);write(ORDERS,os);
  if(paymentMethod==="cod"){try{await sendOrderEmails(order);}catch(e){console.error("Order email failed:",e.message);}}
  res.json({orderId,id:ro?.id||null,amount:total*100,currency:"INR",key_id:KEY_ID,paymentMethod});
 }catch(e){console.error(e);res.status(500).json({error:e.message||"Could not create order"});}
});
app.post("/api/verify-payment",async (req,res)=>{
 try{const {razorpay_order_id,razorpay_payment_id,razorpay_signature,orderId}=req.body;if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature||!orderId)return res.status(400).json({verified:false});
 const exp=crypto.createHmac("sha256",KEY_SECRET).update(razorpay_order_id+"|"+razorpay_payment_id).digest("hex"),ok=exp===razorpay_signature,os=read(ORDERS),o=os.find(x=>x.orderId===orderId&&x.razorpayOrderId===razorpay_order_id);if(!ok||!o)return res.status(400).json({verified:false});
 o.paymentStatus="PAID";o.status="CONFIRMED";o.razorpayPaymentId=razorpay_payment_id;o.paidAt=new Date().toISOString();write(ORDERS,os);try{await sendOrderEmails(o);}catch(e){console.error("Order email failed:",e.message);}res.json({verified:true,orderId});
 }catch(e){res.status(400).json({verified:false});}
});
app.post("/api/confirm-cod",(req,res)=>{const os=read(ORDERS),o=os.find(x=>x.orderId===req.body.orderId);if(!o)return res.status(404).json({error:"Not found"});o.status="NEW";o.paymentStatus="COD_PENDING";write(ORDERS,os);res.json({success:true,orderId:o.orderId});});
app.get("/api/admin/orders",auth,(req,res)=>res.json(read(ORDERS)));
app.patch("/api/admin/orders/:id/status",auth,(req,res)=>{const allowed=["NEW","CONFIRMED","PACKED","SHIPPED","DELIVERED","CANCELLED"],s=String(req.body.status||"").toUpperCase();if(!allowed.includes(s))return res.status(400).json({error:"Invalid status"});const os=read(ORDERS),o=os.find(x=>x.orderId===req.params.id);if(!o)return res.status(404).json({error:"Not found"});o.status=s;write(ORDERS,os);res.json(o);});
app.listen(PORT,()=>console.log(`Jaju's Mart: http://localhost:${PORT}`));
