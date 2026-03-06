# E-Commerce Web Application

A modern, fully functional e-commerce web application built with React, featuring product browsing, shopping cart, wishlist, user authentication, and checkout functionality.

## 🚀 Features

### Core Features
- **User Authentication**: Login, signup, and logout functionality
- **Product Catalog**: Browse products with search, filtering, and sorting
- **Product Details**: Detailed product pages with image gallery and reviews
- **Shopping Cart**: Add/remove items, quantity management, persistent storage
- **Wishlist**: Save favorite products for later
- **Checkout Process**: Complete order flow with shipping and payment options
- **Responsive Design**: Mobile-first design that works on all devices

### Technical Features
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **State Management**: Context API for global state management
- **Routing**: React Router for navigation
- **API Integration**: Fake Store API (or custom backend) for product and order data
- **Local Storage**: Persistent cart and wishlist data
- **Loading States**: Proper loading indicators and error handling
- **Form Validation**: Client-side validation for forms
- **Admin Dashboard**: Order status updates and management for administrators

## 🛠️ Tech Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **API**: Fake Store API (https://fakestoreapi.com/)
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with header/footer
│   ├── ProductCard.jsx # Product display card
│   ├── Loading.jsx     # Loading spinner
│   └── ErrorMessage.jsx # Error display component
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Products.jsx    # Product listing
│   ├── ProductDetails.jsx # Individual product page
│   ├── Cart.jsx        # Shopping cart
│   ├── Wishlist.jsx    # User wishlist
│   ├── Checkout.jsx    # Checkout process
│   ├── Login.jsx       # User login
│   └── Signup.jsx      # User registration
├── context/            # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   ├── CartContext.jsx # Shopping cart state
│   └── WishlistContext.jsx # Wishlist state
├── hooks/              # Custom React hooks
│   └── useProducts.js  # Product data fetching
├── services/           # API services
│   └── api.js          # API configuration and calls
├── utils/              # Utility functions
│   └── helpers.js      # Helper functions
├── assets/             # Static assets
├── App.jsx             # Main app component
└── main.jsx            # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📱 Usage

### User Authentication
- Click "Sign Up" to create a new account
- Use "Login" to access existing accounts
- Authentication state persists across browser sessions

### Browsing Products
- View featured products on the home page
- Use the search bar to find specific products
- Filter by category or sort by price/rating
- Click on any product to view details

### Shopping Cart
- Add products to cart from product cards or detail pages
- Adjust quantities in the cart page
- Cart data persists in localStorage
- Proceed to checkout when ready

### Wishlist
- Click the heart icon to add/remove products from wishlist
- View all saved products on the wishlist page
- Wishlist data persists in localStorage

### Checkout Process
- Requires user authentication
- Fill in shipping information
- Select payment method
- Review order summary before placing order

## 🔧 Configuration

### API Configuration
The app uses the Fake Store API by default. To use a different API:

1. Update `src/services/api.js` with your API base URL
2. Modify API endpoints as needed
3. Update data structures in components if necessary

### Styling Customization
- Modify Tailwind configuration in `tailwind.config.js`
- Update color scheme and design tokens
- Customize component styles directly in JSX

## 🌟 Future Enhancements

- [ ] Admin panel for product management (only order administration is implemented currently)
- [ ] Real payment integration (Stripe)
- [ ] User profile and order history
- [ ] Product reviews and ratings
- [ ] Dark mode toggle
- [ ] Infinite scrolling for product lists
- [ ] Advanced search with filters
- [ ] Email notifications
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help, please open an issue in the repository.
