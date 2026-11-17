# 💻 Laptop & Printer Store — E-Commerce & Service Platform (Frontend)

A responsive, production-ready frontend web application for a **Laptop & Printer Retail and Repair Store**, built with **React + Vite**. Designed for real-world business operations, the platform allows customers to browse laptops, printers, and accessories, filter by specifications, manage their shopping cart, and submit service/repair inquiries.

🔗 **Live Demo:** [https://laptop-printer-store-frontend.vercel.app/]  
⚙️ **Backend Repository:** [laptop_printer_store-backend](https://github.com)

---

## ✨ Key Features

### 🛍️ Customer Storefront
- **Product Catalog & Filtering:** Browse laptops, printers, and peripherals with category, brand, and price filtering.
- **Detailed Product Views:** View hardware specifications, warranty details, stock availability, and high-resolution product images.
- **Shopping Cart & Checkout:** Add items, update quantities, view dynamic pricing totals, and place orders seamlessly.
- **User Authentication:** Secure customer registration, login, and protected order history pages.
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices.

### 🛠️ Admin & Store Management
- **Inventory & Product Management:** Add new hardware listings, update pricing/stock, and manage product categories via the connected REST API.
- **Order Tracking:** View customer orders and manage order fulfillment statuses.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React.js (Vite)
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS / CSS3
- **API Integration:** Axios (connected to Node.js & Express backend)
- **State Management:** React Context API / Hooks

---

## 📂 Project Structure

```text
laptop_printer_store_frontend/
├── public/                 # Static assets & icons
├── src/
│   ├── assets/             # Product banners & UI media
│   ├── components/         # Reusable components (Navbar, Footer, ProductCard, CartItem)
│   ├── context/            # Global state for Auth & Shopping Cart
│   ├── pages/              # Home, Shop, ProductDetails, Cart, Checkout, Admin, Login
│   ├── services/           # Axios API configuration & endpoint calls
│   ├── App.jsx             # Main application routing
│   └── main.jsx            # Entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- Running instance of the [Backend Server](https://github.com)

### 1. Clone the Repository
```bash
git clone https://github.com
cd laptop_printer_store_frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your backend API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the Development Server
```bash
npm run dev
```

---

## 📸 Screenshots

*(Drag and drop 2–3 screenshots of your storefront, product catalog, and cart page right here in the GitHub editor!)*

---

## 👨‍💻 Author

**Rahul Chanda Sil**  
- **GitHub:** [@rahulchandasil](https://github.com)  
- **LinkedIn:** [Rahul Chanda Sil](https://linkedin.com)  
- **Location:** Kolkata, West Bengal, India
