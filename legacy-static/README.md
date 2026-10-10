# Payal Fashion Design — Boutique Website

A bespoke, responsive Indian ethnic fashion boutique website crafted for **Payal Fashion Design**. Built using pure **HTML5**, **CSS3**, and **Vanilla JavaScript** without heavy frameworks, backend databases, or paid APIs.

---

## 📁 Project Structure

Here is an overview of the files included in this project:

```
payal-fashion-design/
├── index.html     # Semantic HTML5 markup (Hero, Collections, Gallery, Custom Tailoring, About, Contact, Modals)
├── style.css      # Custom styling, Indian boutique color palette, typography, grid layouts, and responsiveness
├── script.js      # Interactive features, WhatsApp integration, category filters, mobile menu, and modals
└── README.md      # Beginner-friendly guide for running, updating, and publishing the website
```

---

## 🚀 How to Run the Website Locally

Since this website is built with pure HTML, CSS, and JavaScript, you can run it right away without installing build tools.

### Method 1: Double-Click (Simplest)
1. Open the `payal-fashion-design` folder on your computer.
2. Double-click `index.html`.
3. It will immediately open and display in your default web browser (Chrome, Safari, Edge, Firefox).

### Method 2: VS Code Live Server (Recommended for Editing)
1. Open the project folder in [Visual Studio Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension by Ritwick Dey.
3. Right-click `index.html` and select **"Open with Live Server"**.
4. The website will open at `http://127.0.0.1:5500`, and any edits you make will automatically refresh in the browser.

### Method 3: Command Line (Node.js or Python)
If you prefer a terminal server:
- **Node.js**:
  ```bash
  npx serve .
  ```
- **Python**:
  ```bash
  python -m http.server 8000
  ```
  Then visit `http://localhost:8000` in your browser.

---

## 📱 How to Configure the Real WhatsApp Number

By default, the website uses the placeholder number `91XXXXXXXXXX`. When customers click any WhatsApp button while this placeholder is active, the site displays a friendly **"WhatsApp Setup Needed"** modal rather than opening a broken link.

### Steps to activate your actual WhatsApp number:
1. Open [script.js](file:///d:/payal-fashion-design/script.js) in your text editor.
2. At the very top (lines 28–36), locate the `CONFIG` object:

```javascript
const CONFIG = {
  // WhatsApp Phone Number (Placeholder: 91XXXXXXXXXX)
  whatsappNumber: '91XXXXXXXXXX',

  // Store Brand Name
  brandName: 'Payal Fashion Design',

  // Instagram Handle (Placeholder)
  instagramHandle: 'payalfashiondesign',
};
```

3. Replace `'91XXXXXXXXXX'` with your **country code + 10-digit phone number** without spaces, dashes, or `+` signs.
   - Example for India (`+91` code, mobile `9876543210`):
     ```javascript
     whatsappNumber: '919876543210',
     ```
4. Save the file. All WhatsApp enquiry buttons will now launch WhatsApp with pre-formatted enquiry messages addressed to your phone.

---

## 🛍️ How to Update Products, Prices, and Categories

All products in the Ready-to-Wear gallery are located inside [index.html](file:///d:/payal-fashion-design/index.html) under the section `<section id="ready-to-wear">`.

### Adding or Editing a Product Card
Find any `<article class="product-card" ...>` block in `index.html`:

```html
<article class="product-card" data-category="Kurtis">
  <div class="product-img-box">
    <span class="product-badge">Kurti</span>
    <img 
      src="https://your-image-url.jpg" 
      alt="Product Name" 
      class="product-img"
      loading="lazy"
      data-fallback-category="Kurtis"
      onerror="handleImageFallback(this)"
    >
  </div>
  <div class="product-details">
    <div class="product-category-name">Designer Kurtis</div>
    <h3 class="product-title">Embroidered Chanderi Kurti Set</h3>
    <p class="product-blurb">Fine resham threadwork detailing with side slits.</p>
    
    <div class="product-meta">
      <div class="sample-price-wrapper">
        <span class="sample-price-label">Sample Price:</span>
        <span class="sample-price-value">₹2,850*</span>
      </div>
    </div>

    <button 
      type="button" 
      class="btn btn-whatsapp-product" 
      data-whatsapp-product="Embroidered Chanderi Kurti Set"
    >
      Enquire on WhatsApp
    </button>
  </div>
</article>
```

### What to change:
- **`data-category="..."`**: Set this to one of the category names (`Kurtis`, `Sarees`, `Lehengas`, `Salwar Suits`, `Blouses`, `Festive Wear`) so the filter tabs filter it accurately.
- **`src="..."`**: The image link (URL or local path like `images/my-kurti.jpg`).
- **`class="product-title"`**: The display name of the garment.
- **`class="sample-price-value"`**: The illustrative sample price (e.g. `₹3,200*` or `On Request`).
- **`data-whatsapp-product="..."`**: Set this to the exact product name; this gets inserted into the WhatsApp message when customers click "Enquire".

---

## 📸 How to Replace Sample Photos with Your Real Boutique Photos

Currently, high-resolution royalty-free Indian ethnic fashion photographs are linked from Unsplash. To use your own boutique photographs:

1. Create a folder named `images` inside `payal-fashion-design/`.
2. Save your photos into that folder (e.g., `images/hero-model.jpg`, `images/banarasi-saree.jpg`).
   - **Recommended formats**: `.jpg`, `.webp` (compressed for fast loading).
   - **Recommended dimensions**:
     - Hero image: `1000 x 1300 px` (portrait ratio ~ 3:4).
     - Collection & Product images: `800 x 1000 px` (portrait ratio).
3. In [index.html](file:///d:/payal-fashion-design/index.html), update the `src` attribute of the `<img>` tags:
   ```html
   <!-- Change from: -->
   <img src="https://images.unsplash.com/..." ...>

   <!-- To: -->
   <img src="images/hero-model.jpg" ...>
   ```

> **Note on Image Fallback**: If an image URL ever fails to load (such as when testing offline), the website includes an automatic fallback that replaces the broken image with a stylish gold and burgundy boutique graphic, keeping your layout intact!

---

## 📍 How to Update Location, Instagram, and Opening Hours

### 1. Instagram Handle
- In [index.html](file:///d:/payal-fashion-design/index.html), search for `id="instagram-link"` and change `href="https://instagram.com"` to your profile link: `https://instagram.com/yourhandle`.
- Also update the text badge `<span class="placeholder-badge">@yourhandle</span>`.

### 2. Boutique Address
- In [index.html](file:///d:/payal-fashion-design/index.html), search for `location-address`:
  ```html
  <p class="location-address">
    Shop No. 12, Heritage Market, MG Road, Pune, Maharashtra 411001
  </p>
  ```

### 3. Operating Hours
- In [index.html](file:///d:/payal-fashion-design/index.html), search for `hours-box` and update the schedule:
  ```html
  <div class="hours-box">
    <p><strong>Mon – Sat:</strong> 10:30 AM – 8:00 PM</p>
    <p><strong>Sunday:</strong> 11:00 AM – 5:00 PM</p>
  </div>
  ```

---

## 🌐 How to Publish the Website for Free

You can host this website online for free using any static hosting platform:

### Option A: GitHub Pages
1. Create a free account on [GitHub](https://github.com).
2. Create a new repository named `payal-fashion-design`.
3. Upload all files (`index.html`, `style.css`, `script.js`, `README.md`, and any `images/` folder).
4. Go to **Settings > Pages**.
5. Under **Branch**, select `main` and root `/`, then click **Save**.
6. Your website will be live in 1–2 minutes at `https://yourusername.github.io/payal-fashion-design/`!

### Option B: Netlify (Drag and Drop)
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop the `payal-fashion-design` folder into the browser.
3. Your site will instantly go live with a free custom HTTPS link.

---

## 🎨 Color Palette & Typography Reference

- **Warm Cream Background**: `#FCFAF6`
- **Ivory Accent**: `#F7F2E9`
- **Deep Burgundy (Primary)**: `#731828`
- **Burgundy Hover**: `#560F1C`
- **Muted Gold (Accent)**: `#C29B4A`
- **Espresso Dark Brown (Text)**: `#2A1F1B`
- **Heading Fonts**: `Cinzel`, `Playfair Display`
- **Body Font**: `Plus Jakarta Sans`
