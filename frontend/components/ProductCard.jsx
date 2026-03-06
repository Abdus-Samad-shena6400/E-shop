import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/helpers';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const resolveId = (p) => p.id || p._id || (p.product && (p.product.id || p.product._id));

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    const prodId = resolveId(product);
    if (isInWishlist(prodId)) {
      removeFromWishlist(prodId);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link to={`/product/${resolveId(product)}`} className="flex-1 flex flex-col">
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-contain p-4"
          />
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isInWishlist(resolveId(product))
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`h-5 w-5 ${isInWishlist(resolveId(product)) ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 flex-shrink-0">
            {product.title}
          </h3>
          <div className="flex items-center mb-2 flex-shrink-0">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating.rate)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({product.rating.count})
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-auto">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
      <div className="p-4 pt-0 flex-shrink-0">
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;