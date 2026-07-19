'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw, Share2, Plus, Minus, ChevronRight, Check } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import AdBanner from '@/components/ads/AdBanner';
import { products } from '@/lib/data';
import { useCart } from '@/context/CartContext';

interface Props { params: { slug: string } }

export default function ProductDetailPage({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug) || products[0];
  const related = products.filter((p) => p.slug !== params.slug && p.category === product.category).slice(0, 3);
  const fallbackRelated = products.filter((p) => p.slug !== params.slug).slice(0, 3);
  const relatedProducts = related.length >= 3 ? related : fallbackRelated;

  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage] = useState(product.image);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        original_price: product.originalPrice,
        image: product.image,
        slug: product.slug,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className="bg-[#F8F8F8] border-b border-[#E8E8E8] py-3">
        <div className="max-w-7xl mx-auto px-4 text-xs font-body text-[#999] flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-brand">Shop</Link>
          <span>›</span>
          <Link href={`/shop?cat=${product.category.toLowerCase().replace(/ /g, '-')}`} className="hover:text-brand">{product.category}</Link>
          <span>›</span>
          <span className="text-[#111]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdBanner slot="product-top" size="leaderboard" isGlobal showGoogleFallback />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* Image */}
          <div>
            <div className="bg-[#F8F8F8] overflow-hidden mb-3 relative">
              {product.badge && (
                <div className={`absolute top-4 left-4 z-10 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 text-white ${
                  product.badge === 'SALE' ? 'bg-brand' : product.badge === 'NEW' ? 'bg-[#111]' : 'bg-brand'
                }`}>
                  {product.badge === 'SALE' && product.discount ? `-${product.discount}%` : product.badge}
                </div>
              )}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            {/* Thumbnail Row */}
            <div className="flex gap-2">
              {[product.image, product.image, product.image].map((img, i) => (
                <div key={i} className="w-20 h-16 bg-[#F8F8F8] overflow-hidden cursor-pointer border-2 border-transparent hover:border-brand transition-colors">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#999] font-body">{product.category}</span>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[#111] mt-1 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#DDD] fill-[#DDD]'} />
                ))}
              </div>
              <span className="text-sm text-[#666] font-body">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-display text-2xl font-bold text-brand">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-[#AAA] line-through font-body">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-sm font-semibold text-green-600 font-body">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
                </>
              )}
            </div>

            <p className="text-sm text-[#555] font-body leading-relaxed mb-6">{product.description}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#999] font-body">Quantity:</span>
              <div className="flex items-center border border-[#E8E8E8]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#F8F8F8] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-semibold font-body">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#F8F8F8] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} className={`flex-1 btn-primary flex items-center justify-center gap-2 ${added ? '!bg-green-600' : ''}`}>
                {added ? <><Check size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart</>}
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-12 h-12 border flex items-center justify-center transition-all ${
                  wishlisted ? 'bg-brand border-brand text-white' : 'border-[#E8E8E8] text-[#555] hover:border-brand hover:text-brand'
                }`}
              >
                <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
              <button className="w-12 h-12 border border-[#E8E8E8] text-[#555] flex items-center justify-center hover:border-brand hover:text-brand transition-all">
                <Share2 size={16} />
              </button>
            </div>

            {/* Meta */}
            <div className="space-y-1.5 text-xs font-body text-[#666] border-t border-[#E8E8E8] pt-4 mb-4">
              <p><span className="font-semibold uppercase tracking-wider text-[#999]">Category:</span> {product.category}</p>
              {product.tags && <p><span className="font-semibold uppercase tracking-wider text-[#999]">Tags:</span> {product.tags.join(', ')}</p>}
              <p><span className="font-semibold uppercase tracking-wider text-[#999]">SKU:</span> VW-{product.id.toUpperCase()}</p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E8E8E8]">
              {[
                { Icon: Truck, label: 'Free Shipping', sub: 'Orders over ₹499' },
                { Icon: Shield, label: 'Secure Payment', sub: '100% Protected' },
                { Icon: RefreshCw, label: 'Easy Returns', sub: '7-day policy' },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <Icon size={18} className="text-brand" />
                  <span className="text-[11px] font-semibold font-body text-[#111]">{label}</span>
                  <span className="text-[10px] text-[#999] font-body">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="flex border-b border-[#E8E8E8] gap-0">
            {[
              { id: 'description', label: 'Description' },
              { id: 'additional', label: 'Additional Information' },
              { id: 'reviews', label: `Reviews (${product.reviews})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all font-body -mb-px ${
                  activeTab === tab.id ? 'border-brand text-brand' : 'border-transparent text-[#999] hover:text-[#111]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div className="article-body max-w-3xl">
                <p>{product.description}</p>
                <p>This product is sourced from certified organic farms and processed according to strict quality standards. It has been third-party tested for purity, potency, and safety.</p>
                <h3>Key Features</h3>
                <ul>
                  <li>100% natural and organic ingredients</li>
                  <li>No artificial preservatives, colors, or flavors</li>
                  <li>Clinically tested for safety and efficacy</li>
                  <li>Sustainably sourced and eco-friendly packaging</li>
                  <li>Suitable for vegetarians and vegans</li>
                </ul>
                <h3>Directions for Use</h3>
                <p>Take as directed on the label or as recommended by your healthcare practitioner. Store in a cool, dry place away from direct sunlight. Keep out of reach of children.</p>
              </div>
            )}
            {activeTab === 'additional' && (
              <div className="max-w-lg">
                <table className="posts-table">
                  <tbody>
                    {[
                      ['Brand', 'vedasach Organics'],
                      ['Form', 'Powder / Tablet'],
                      ['Net Weight', '200g / 60 Capsules'],
                      ['Country of Origin', 'India'],
                      ['Shelf Life', '24 months from manufacture'],
                      ['Certification', 'FSSAI Certified, ISO 22000'],
                    ].map(([key, val]) => (
                      <tr key={key}>
                        <td className="font-semibold text-[#333] w-40">{key}</td>
                        <td className="text-[#666]">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-6 p-4 bg-[#F8F8F8]">
                  <div className="text-center">
                    <div className="font-display text-4xl font-bold text-[#111]">{product.rating}</div>
                    <div className="flex justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#DDD] fill-[#DDD]'} />
                      ))}
                    </div>
                    <div className="text-xs text-[#999] font-body mt-0.5">{product.reviews} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#999] w-4 font-body">{star}</span>
                        <div className="flex-1 bg-[#E8E8E8] h-2">
                          <div className="bg-[#F59E0B] h-2" style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 5}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#999] font-body italic">Be the first to write a detailed review!</p>
              </div>
            )}
          </div>
        </div>

        {/* Ad */}
        <AdBanner slot="product-mid" size="leaderboard" className="mb-12" showGoogleFallback />

        {/* Related Products */}
        <div>
          <div className="divider-title">
            <h2 className="text-sm font-bold uppercase tracking-widest">Related Products</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 pb-8">
        <AdBanner slot="product-bottom" size="leaderboard" isGlobal showGoogleFallback />
      </div>
    </>
  );
}
