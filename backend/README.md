# E-Commerce Full Stack Application

This is a full-stack e-commerce application with a React frontend and Node.js/Express backend.

## Project Structure

```
E-commerce-app/          # Frontend (React + Vite)
E-commerce-backend/      # Backend (Node.js + Express + MongoDB)
```

## Backend Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd E-commerce-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB connection string and JWT secret:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

### Running the Backend

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### Seeding the Database with Products

To populate the database with sample products from FakeStoreAPI:

```bash
npm run seed
```

This will:
- Clear any existing products
- Fetch products from https://fakestoreapi.com/products
- Insert them into your MongoDB database

You can also create a default administrator account when running the seeder by providing credentials via environment variables. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env` before running the script. The seeder will create the admin user if one with that email does not already exist.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Products
- `GET /api/products` - Get all products (supports pagination & category filter)
- `GET /api/products/:id` - Get a specific product
- `GET /api/products/categories` - Get all categories
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Cart
- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart/add` - Add product to cart (requires auth)
- `PUT /api/cart/update` - Update cart item quantity (requires auth)
- `POST /api/cart/remove` - Remove product from cart (requires auth)
- `DELETE /api/cart/clear` - Clear entire cart (requires auth)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist (requires auth)
- `POST /api/wishlist/add` - Add product to wishlist (requires auth)
- `POST /api/wishlist/remove` - Remove product from wishlist (requires auth)
- `DELETE /api/wishlist/clear` - Clear entire wishlist (requires auth)

### Orders
- `POST /api/orders` - Create a new order (requires auth)
- `GET /api/orders` - Get all user orders (requires auth)
- `GET /api/orders/:id` - Get a specific order (requires auth)
- `PUT /api/orders/:id` - Update order status (requires auth)
- `POST /api/orders/:id/cancel` - Cancel an order (requires auth)

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd E-commerce-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API base URL in `src/services/api.js` to point to your backend:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Configuration

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)- `ADMIN_EMAIL` - (optional) email of the default admin account seeded
- `ADMIN_PASSWORD` - (optional) password for the default admin account
### Frontend
Update the `API_BASE_URL` in `src/services/api.js` based on your backend URL.

## Database Schema

### User
- name: String
- email: String (unique)
- password: String (hashed with bcryptjs)
- phone, address, city, country, zipCode: String

### Product
- title: String
- description: String
- price: Number
- category: String
- image: String
- rating: Number
- reviews: Number (count)
- stock: Number
- inStock: Boolean
- createdAt, updatedAt: Timestamp

### Cart
- user: ObjectId (ref: User)
- items: Array of { product, quantity, price }
- totalPrice: Number

### Wishlist
- user: ObjectId (ref: User)
- products: Array of ObjectId (ref: Product)

### Order
- user: ObjectId (ref: User)
- items: Array of { product, quantity, price }
- totalPrice: Number
- shippingAddress: { address, city, zipCode, country }
- status: String (pending/processing/shipped/delivered/cancelled)
- paymentMethod: String
- isPaid: Boolean
- paidAt: Date

## Key Features

✅ User Authentication (JWT-based)
✅ Product Management
✅ Shopping Cart
✅ Wishlist
✅ Order Management
✅ User Profile Management
✅ Password Hashing (bcryptjs)
✅ CORS Support
✅ Auto-increment Stock Tracking

## Next Steps

1. Set up MongoDB (local or MongoDB Atlas)
2. Install backend dependencies and run the server
3. Seed the database with products
4. Update the frontend API configuration
5. Test the full-stack application

For production deployment, ensure to:
- Change JWT_SECRET to a strong, unique value
- Use environment-specific .env files
- Enable HTTPS
- Implement proper error handling and logging
- Add encryption for sensitive data
- Set up database backups

