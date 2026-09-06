# Dhanam Organics — Production Website

A handcrafted, high-performance website for **Dhanam Organics** (தனம் ஆர்கானிக்ஸ்), featuring authentic Tamil heritage stone-milled podis and organic foods.

---

## 🌿 Architecture Overview

- **Frontend:** React 19 + Vite (Static site deployable to GoDaddy shared hosting)
- **Product Management:** PHP API (`php/products.php`, `php/admin.php`) + MySQL database (`php/schema.sql`)
- **Ordering System:** WhatsApp Direct Ordering (No online payment or Razorpay in Phase 1)
- **Design:** Editorial, warm natural aesthetics rooted in the authentic Dhanam Organics brand identity (deep crimson, forest green, warm cream paper, refined typography).

---

## 📱 WhatsApp Configuration (Single Source of Truth)

The owner's WhatsApp number is stored in **one configurable file**:

📂 `src/config/siteConfig.js`

```javascript
export const SITE_CONFIG = {
  brandName: 'Dhanam Organics',
  brandNameTamil: 'தனம் ஆர்கானிக்ஸ்',
  whatsapp: {
    phoneNumber: '918015966988', // <-- CHANGE TO STORE OWNER'S WHATSAPP NUMBER
    displayNumber: '+91 8015966988',
    greetingPrefix: 'Hi, I would like to order:',
    supportHours: '9:00 AM - 8:00 PM (Mon - Sat)'
  },
  ...
};
```

When a customer clicks **Order on WhatsApp**, it opens WhatsApp with:
```text
Hi, I would like to order:

Product: [PRODUCT NAME] ([WEIGHT])
Quantity: [QUANTITY] - ₹[PRICE]

Please confirm availability and payment details. Thank you!
```

---

## 📦 Products (Source of Truth)

The store displays **only the authentic products** provided in `public/images/products/`:
1. **இட்லி பொடி • Traditional Idli Podi** (`idli-podi.png`)
2. **பருப்பு பொடி • Paruppu Podi** (`paruppu-podi.png`)
3. **கருவேப்பிலை பொடி • Curry Leaf Podi** (`karuveppilai-podi.png`)
4. **எள்ளு இட்லி பொடி • Ellu Idli Podi** (`ellu-idli-podi.png`)
5. **பிரண்டை பொடி • Pirandai Bone Health Podi** (`pirandai-podi.png`)
6. **முடவாட்டுக்கால் சூப் பொடி • Mudavattukal Joint Health Soup** (`mudavattukal-soup-podi.png`)
7. **முருங்கை இட்லி பொடி • Moringa Leaf Podi** (`murungai-idli-podi.png`)
8. **இன்ஸ்டன்ட் ரசம் பொடி • Instant Rasam Podi** (`instant-rasam-podi.png`)

All gray backgrounds have been cleanly converted to transparent RGBA backgrounds with antialiased edges, preserving the product jars completely.

To add new products in the future, simply add the image to `public/images/products/` and append the product object in `src/data/products.js` (or add it through `php/admin.php`).

---

## 🚀 GoDaddy Shared Hosting Deployment Guide

### Option 1: Static Deployment (Instant Live Store)
1. Run `npm run build` locally.
2. In GoDaddy cPanel, open **File Manager** and navigate to `public_html/`.
3. Upload all files from the `dist/` folder directly into `public_html/` (including `index.html`, `.htaccess`, `assets/`, and `images/`).
4. Your website is immediately live!

### Option 2: Full Setup with PHP + MySQL Backend
1. In GoDaddy cPanel, go to **MySQL Databases**:
   - Create a database (e.g. `dhanam_organics`).
   - Create a database user and assign all privileges.
2. Go to **phpMyAdmin**, select the database, and click **Import**:
   - Choose `php/schema.sql` to create the tables and seed products.
3. Edit `php/config.php` with your database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'your_cpanel_dbname');
   define('DB_USER', 'your_cpanel_username');
   define('DB_PASS', 'your_cpanel_password');
   ```
4. Upload the `php/` folder into `public_html/php/`.
5. Access the owner portal at `yourdomain.com/php/admin.php` (Password: `dhanam2026`).

---

## 🛠 Local Development Commands

- `npm run dev` — Start Vite local dev server
- `npm run build` — Compile production build to `dist/`
- `npm run preview` — Test production build locally
