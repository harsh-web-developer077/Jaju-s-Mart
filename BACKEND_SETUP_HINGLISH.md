# Jaju's Mart — Backend Setup (Hinglish)

## 1) Sabse pehle Node.js install karo
Windows par Node.js LTS install karo.
Install hone ke baad Command Prompt kholkar check karo:

node -v
npm -v

Dono commands version dikhani chahiye.

## 2) ZIP extract karo
ZIP ko, for example, yahan extract karo:

C:\Users\swami\Documents\Jajus_Mart

Folder ke andar `backend` folder hona chahiye.

## 3) Backend folder me CMD kholo
File Explorer me `backend` folder open karo.
Address bar par click karo, `cmd` type karo aur Enter dabao.

CMD me path kuch aisa dikhega:

C:\Users\swami\Documents\Jajus_Mart\backend>

## 4) Packages install karo

npm install

Ye sirf first time karna hai, ya jab package.json change ho.

## 5) .env file banao

`.env.example` ki copy banao aur uska naam `.env` rakho.

Important:
`.env` ko kisi ko share mat karna. Isme Razorpay secret aur email password hota hai.

## 6) Admin token set karo

.env me:

ADMIN_TOKEN=apna-private-long-token

Example:
ADMIN_TOKEN=JajuMart_Admin_2026_Strong_Secret

Is token ko public mat karo.

## 7) Email setup — Gmail example

Agar tum Gmail use karna chahte ho:

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=yourstore@gmail.com
SMTP_PASS=your-Gmail-App-Password
MAIL_FROM=yourstore@gmail.com
STORE_EMAIL=yourstore@gmail.com

IMPORTANT:
Normal Gmail password mat daalna.

Gmail account me 2-Step Verification enable karke App Password banao.
Us 16-character App Password ko `SMTP_PASS` me daalo.

Example:

SMTP_USER=jajusmart@gmail.com
SMTP_PASS=abcdabcdabcdabcd

Spaces ke bina App Password use karo.

## 8) Razorpay test payment

Testing ke liye `.env` me Razorpay TEST keys daalo:

RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

Production me jaane par production keys use karni hongi.

## 9) Backend start karo

CMD me:

npm start

Agar sab sahi hai to:

Jaju's Mart: http://localhost:3000

dikhega.

IMPORTANT:
CMD window ko band mat karna. Server isi window me chal raha hota hai.

## 10) Website open karo

Browser me ye kholo:

http://localhost:3000/index.html

`file:///C:/.../index.html` se website mat chalao.

## 11) Products / pricing control

Browser me:

http://localhost:3000/admin.html

ADMIN_TOKEN enter karo.

Yahan:
- Price change kar sakte ho
- Offer % change kar sakte ho
- Product active/inactive kar sakte ho

Changes server-side `backend/data/products.json` me save hote hain.

## 12) Orders dekhna

Browser me:

http://localhost:3000/admin-orders.html

ADMIN_TOKEN enter karo.

Yahan customer ka:
- Name
- Phone
- Email
- Address
- Products
- Total
- Payment status
- Order status

dikhega.

Order status:
NEW → CONFIRMED → PACKED → SHIPPED → DELIVERED

## 13) Order emails kaise kaam karenge

Customer order place karta hai:

Customer
  ↓
Checkout
  ↓
Backend order save karta hai
  ↓
Online payment verify hota hai / COD confirm hota hai
  ↓
Email customer ko
  ↓
Email store owner ko
  ↓
Order admin panel me bhi save rehta hai

Online payment me email payment verification ke baad send hota hai.

COD me order save hote hi confirmation email send hota hai.

## 14) Agar email nahi aa raha

Sabse pehle:
1. `npm start` ke CMD me error check karo.
2. `.env` me SMTP settings check karo.
3. Gmail ke liye App Password use hua hai ya nahi check karo.
4. `MAIL_FROM` aur `STORE_EMAIL` sahi hain ya nahi check karo.
5. Spam/Junk folder check karo.
6. Server restart karo:

Ctrl + C
npm start

## 15) Har baar website start karne ka short method

Har future session me:

1. `backend` folder kholo
2. Address bar → `cmd`
3. Run:

npm start

4. Browser:

http://localhost:3000/index.html

Bas.

## Production se pehle

Real customers ke liye:
- HTTPS use karo
- Razorpay production keys use karo
- Strong admin authentication use karo
- Database + backups use karo
- Razorpay webhooks/reconciliation add karo
- SMTP provider ki sending limits/requirements check karo
- `.env` ko GitHub ya public folder me upload mat karo
