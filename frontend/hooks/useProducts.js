import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/api';

export const useProducts = (category = null, page = 1, limit = 10) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts(category, page, limit);
        // normalize products by ensuring `id` field exists (mirrors MongoDB _id)
        const normalized = (response.products || []).map(p => ({ ...p, id: p._id || p.id }));
        setProducts(normalized);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.currentPage || page);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, page, limit]);

  return { products, loading, error, totalPages, currentPage };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.categories || response || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};