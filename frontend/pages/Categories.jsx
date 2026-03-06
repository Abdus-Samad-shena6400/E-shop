import React from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useProducts';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Categories = () => {
  const { categories, loading, error } = useCategories();

  if (loading) return <Loading size="lg" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Shop by Category</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category}
            to={`/products?category=${category}`}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center group"
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold capitalize text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {category}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Explore {category} products</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;