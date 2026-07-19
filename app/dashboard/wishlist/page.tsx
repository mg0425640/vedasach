'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart, Loader2, ExternalLink } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface WishlistItem {
  id: string;
  created_at: string;
  product_id: string;
  products: {
    id: string;
    slug: string;
    name: string;
    price: number;
    original_price: number | null;
    image_url: string;
    badge: string | null;
    in_stock: boolean;
    discount: number | null;
  } | null;
}

export default function WishlistPage() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  const loadWishlist = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('wishlist_items')
      .select('id, created_at, product_id, products(id, slug, name, price, original_price, image_url, badge, in_stock, discount)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setItems((data as unknown as WishlistItem[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadWishlist(); }, [user]);

  const handleRemove = async (id: string) => {
    setRemoving(id);
    await supabase.from('wishlist_items').delete().eq('id', id);
    setItems(items.filter((i) => i.id !== id));
    setRemoving(null);
  };

  const formatPrice = (price: number) => {
    if (lang === 'hi') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <DashboardLayout>
      <div className="bg-white border border-[#E8E8E8] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-[#111]">
            {lang === 'hi' ? 'पसंदीदा आइटम' : 'Wishlist'}
          </h2>
          <span className="text-xs text-[#999] font-body">
            {items.length} {lang === 'hi' ? 'आइटम' : 'items'}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-[#999] font-body">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={48} className="text-[#DDD] mx-auto mb-3" />
            <p className="text-[#999] font-body mb-4">
              {lang === 'hi' ? 'आपकी विशलिस्ट खाली है।' : 'Your wishlist is empty.'}
            </p>
            <Link href="/shop" className="btn-primary text-sm">
              {lang === 'hi' ? 'दुकान पर जाएं' : 'Browse Shop'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const product = item.products;
              if (!product) return null;
              return (
                <div key={item.id} className="border border-[#E8E8E8] group relative overflow-hidden">
                  {product.badge && (
                    <span className="absolute top-2 left-2 z-10 text-[8px] font-bold uppercase px-2 py-0.5 bg-brand text-white">
                      {product.badge}
                    </span>
                  )}
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={removing === item.id}
                    className="absolute top-2 right-2 z-10 w-7 h-7 bg-white border border-[#E8E8E8] flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                  >
                    {removing === item.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  </button>
                  <Link href={`/shop/${product.slug}`} className="block">
                    <div className="aspect-square bg-[#F8F8F8] overflow-hidden">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-body font-semibold text-sm text-[#111] line-clamp-2 mb-1">{product.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-body font-bold text-brand">{formatPrice(product.price)}</span>
                        {product.original_price && (
                          <span className="text-xs font-body text-[#999] line-through">{formatPrice(product.original_price)}</span>
                        )}
                        {product.discount && (
                          <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1">{product.discount}% OFF</span>
                        )}
                      </div>
                      <p className={`text-[10px] font-body mt-1 ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
                        {product.in_stock ? (lang === 'hi' ? 'स्टॉक में' : 'In Stock') : (lang === 'hi' ? 'स्टॉक में नहीं' : 'Out of Stock')}
                      </p>
                    </div>
                  </Link>
                  <div className="px-3 pb-3">
                    <Link
                      href={`/shop/${product.slug}`}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#FFF8F6] border border-brand text-brand text-xs font-semibold hover:bg-brand hover:text-white transition-colors font-body"
                    >
                      <ShoppingCart size={12} />
                      {lang === 'hi' ? 'अभी खरीदें' : 'Buy Now'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
