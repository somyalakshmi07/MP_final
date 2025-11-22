import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, useCategories } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import { mockProducts, mockCategories } from '../data/mockProducts';
import { Search, Filter, Grid, List, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Products() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, isLoading, isError } = useProducts({
    page,
    limit: 12,
    category: category || undefined,
    search: search || undefined,
    sort,
    order,
  });

  const { data: categories, isError: categoriesError } = useCategories();
  const addToCart = useAddToCart();

  // Use mock data if API fails
  const displayCategories = categoriesError ? mockCategories : (categories || []);
  const displayProducts = isError ? mockProducts : (data?.products || []);
  const displayPagination = isError ? {
    page: 1,
    limit: 12,
    total: mockProducts.length,
    pages: 1,
  } : (data?.pagination || { page: 1, limit: 12, total: 0, pages: 1 });
  const isLoadingState = isLoading && !isError;

  // Filter and sort mock products
  let filteredProducts = [...displayProducts];
  
  if (category && isError) {
    filteredProducts = filteredProducts.filter(p => p.category.slug === category);
  }
  
  if (search && isError) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower)
    );
  }

  if (isError) {
    if (sort === 'price') {
      filteredProducts.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
    } else if (sort === 'name') {
      filteredProducts.sort((a, b) => order === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name));
    } else {
      filteredProducts.sort((a, b) => order === 'asc' 
        ? a._id.localeCompare(b._id) 
        : b._id.localeCompare(a._id));
    }
  }

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addToCart.mutate({ productId, quantity: 1 });
    } catch (error) {
      // If backend is unavailable, show success message anyway
      toast.success('Added to cart! (Demo mode)');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            placeholder="Search products..."
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">All Categories</option>
                    {displayCategories.map((cat: any) => (
                      <option key={cat._id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={`${sort}-${order}`}
                    onChange={(e) => {
                      const [s, o] = e.target.value.split('-');
                      setSort(s);
                      setOrder(o as 'asc' | 'desc');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {displayPagination.total} products found
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {isLoadingState ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No products found</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6 mb-8`}>
                    {filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        className={`bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group ${viewMode === 'list' ? 'flex' : ''}`}
                      >
                        <Link
                          to={`/products/${product.slug || product._id}`}
                          className={`${viewMode === 'list' ? 'flex-1' : ''}`}
                        >
                          <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'w-full'} h-64 overflow-hidden`}>
                            <img
                              src={product.image || 'https://via.placeholder.com/300'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>
                          <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-2xl font-bold text-primary-600">₹{product.price.toLocaleString('en-IN')}</p>
                              {product.stock === 0 && (
                                <span className="text-red-600 text-sm font-medium">Out of stock</span>
                              )}
                            </div>
                          </div>
                        </Link>
                        <div className="px-4 pb-4">
                          <button
                            onClick={(e) => handleAddToCart(e, product._id)}
                            disabled={product.stock === 0 || addToCart.isPending || isError}
                            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={isError ? 'Please ensure catalog service is running and database is connected' : ''}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>
                              {product.stock === 0 
                                ? 'Out of Stock' 
                                : isError 
                                ? 'Service Unavailable' 
                                : 'Add to Cart'}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {displayPagination.pages > 1 && (
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {displayPagination.page} of {displayPagination.pages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(displayPagination.pages, p + 1))}
                      disabled={page === displayPagination.pages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
