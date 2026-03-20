import React, { useState } from 'react';
import { addToWishlist, removeFromWishlist } from '../../features/account/wishlistAPI';

/**
 * Reusable wishlist heart button for product cards.
 * Props:
 *   productId - product ID (required)
 *   initialLiked - whether already in wishlist (default false)
 *   className - extra wrapper classes
 *   size - 'sm' | 'md' (default 'sm')
 */
const WishlistButton = ({ productId, initialLiked = false, className = '', size = 'sm' }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('userToken');
    if (!token) {
      alert('Vui lòng đăng nhập để thêm yêu thích!');
      return;
    }

    try {
      setLoading(true);
      if (liked) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
      setLiked(!liked);
    } catch (err) {
      console.error('Wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  const iconSize = size === 'md' ? 'text-2xl' : 'text-xl';
  const btnSize = size === 'md' ? 'w-10 h-10' : 'w-8 h-8';

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${btnSize} rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 ${
        liked ? 'text-accent-pink' : 'text-slate-400 hover:text-accent-pink'
      } ${className}`}
      title={liked ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
    >
      <span
        className={`material-symbols-outlined ${iconSize}`}
        style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
    </button>
  );
};

export default WishlistButton;
