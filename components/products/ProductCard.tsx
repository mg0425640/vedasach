'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Heart, Star, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { lang } = useLanguage();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      original_price: product.originalPrice,
      image: product.image,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group relative">
      <div className="relative overflow-hidden bg-[#F8F8F8] mb-3 product-img-wrap">
        <Link href={`/shop/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-cover"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 text-white ${
            product.badge === 'SALE' ? 'bg-brand' :
            product.badge === 'NEW' ? 'bg-[#111]' :
            'bg-[#E84E1B]'
          }`}>
            {product.badge === 'SALE' && product.discount ? `-${product.discount}%` : product.badge}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand hover:text-white"
        >
          <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick Add */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-0 left-0 right-0 py-2.5 text-center text-[11px] font-bold uppercase tracking-widest text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer flex items-center justify-center gap-2 sm:translate-y-full ${
            added ? 'bg-green-600 !translate-y-0' : 'bg-[#111] hover:bg-brand'
          }`}
        >
          {added ? (
            <>
              <Check size={12} />
              {lang === 'hi' ? 'जोड़ा गया!' : 'Added!'}
            </>
          ) : (
            <>
              <ShoppingCart size={12} />
              {lang === 'hi' ? 'कार्ट में डालें' : 'Add to Cart'}
            </>
          )}
        </button>
      </div>

      <div>
        <span className="text-[10px] uppercase tracking-wider text-[#999] font-body">{product.category}</span>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-sm font-semibold text-[#111] hover:text-brand transition-colors leading-snug mt-0.5 font-body">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(product.rating) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#DDD] fill-[#DDD]'}
              />
            ))}
          </div>
          <span className="text-[11px] text-[#999] font-body">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-bold text-[#111] font-body">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-[#999] line-through font-body">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
