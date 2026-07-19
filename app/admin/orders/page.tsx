'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Package, Truck, CircleCheck as CheckCircle, Circle as XCircle, DollarSign, Clock, Search } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  shipping_address: any;
  tracking_number: string | null;
  courier_name: string | null;
  notes: string | null;
  cancellation_reason: string | null;
  created_at: string;
  dispatched_at: string | null;
  delivered_at: string | null;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Order | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [actionType, setActionType] = useState<string>('');
  const [actionData, setActionData] = useState({ tracking_number: '', courier_name: '', notes: '', cancellation_reason: '' });
  const [processing, setProcessing] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders((data as Order[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const filtered = orders.filter(o => {
    const matchSearch = o.order_number?.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const matchFilter = filter === 'all' || o.status === filter;
    return matchSearch && matchFilter;
  });

  const openOrder = async (order: Order) => {
    setSelected(order);
    const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    setItems(data || []);
  };

  const handleAction = async () => {
    if (!selected) return;
    setProcessing(true);
    const updates: any = {};

    if (actionType === 'confirm') {
      updates.status = 'confirmed';
      updates.payment_status = 'paid';
    } else if (actionType === 'dispatch') {
      updates.status = 'dispatched';
      updates.dispatched_at = new Date().toISOString();
      updates.tracking_number = actionData.tracking_number;
      updates.courier_name = actionData.courier_name;
      updates.notes = actionData.notes;
    } else if (actionType === 'deliver') {
      updates.status = 'delivered';
      updates.delivered_at = new Date().toISOString();
    } else if (actionType === 'cancel') {
      updates.status = 'cancelled';
      updates.cancelled_at = new Date().toISOString();
      updates.cancellation_reason = actionData.cancellation_reason;
    } else if (actionType === 'refund') {
      await supabase.from('refunds').insert({
        order_id: selected.id,
        user_id: selected.user_id,
        amount: selected.total_amount,
        status: 'pending',
        reason: actionData.cancellation_reason || 'Admin initiated refund',
        notes: actionData.notes,
      });
      updates.payment_status = 'refunded';
      updates.status = 'cancelled';
    }

    await supabase.from('orders').update(updates).eq('id', selected.id);
    setProcessing(false);
    setActionType('');
    setActionData({ tracking_number: '', courier_name: '', notes: '', cancellation_reason: '' });
    loadOrders();
    openOrder({ ...selected, ...updates });
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-600',
    confirmed: 'bg-blue-50 text-blue-600',
    dispatched: 'bg-purple-50 text-purple-600',
    delivered: 'bg-green-50 text-green-600',
    cancelled: 'bg-red-50 text-red-600',
  };

  const payColors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-600',
    paid: 'bg-green-50 text-green-600',
    failed: 'bg-red-50 text-red-600',
    refunded: 'bg-gray-50 text-gray-600',
  };

  const totalRevenue = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total_amount), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const dispatchCount = orders.filter(o => o.status === 'dispatched').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Package className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold font-heading">{orders.length}</p><p className="text-xs text-[#999]">Total Orders</p></div></div></div>
        <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center"><Clock className="w-5 h-5 text-yellow-600" /></div><div><p className="text-2xl font-bold font-heading">{pendingCount}</p><p className="text-xs text-[#999]">Pending</p></div></div></div>
        <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center"><Truck className="w-5 h-5 text-purple-600" /></div><div><p className="text-2xl font-bold font-heading">{dispatchCount}</p><p className="text-xs text-[#999]">Dispatched</p></div></div></div>
        <div className="bg-white rounded-xl p-5 border border-[#F0F0F0]"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center"><DollarSign className="w-5 h-5 text-emerald-600" /></div><div><p className="text-2xl font-bold font-heading">₹{totalRevenue.toLocaleString('en-IN')}</p><p className="text-xs text-[#999]">Revenue</p></div></div></div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CCC]" />
          <input type="text" placeholder="Search by order number..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2.5 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:border-[#E84E1B]">
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="dispatched">Dispatched</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#FAFAFA] border-b border-[#F0F0F0]">
              <th className="text-left px-4 py-3 text-xs font-bold text-[#999] uppercase">Order #</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-[#999] uppercase">Date</th>
              <th className="text-right px-4 py-3 text-xs font-bold text-[#999] uppercase">Amount</th>
              <th className="text-center px-4 py-3 text-xs font-bold text-[#999] uppercase">Payment</th>
              <th className="text-center px-4 py-3 text-xs font-bold text-[#999] uppercase">Status</th>
              <th className="text-center px-4 py-3 text-xs font-bold text-[#999] uppercase">Action</th>
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="text-center py-8 text-[#999]">Loading...</td></tr> :
               filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-[#999]">No orders found</td></tr> :
               filtered.map(o => (
                <tr key={o.id} className="border-b border-[#F8F8F8] hover:bg-[#FAFAFA] cursor-pointer" onClick={() => openOrder(o)}>
                  <td className="px-4 py-3"><p className="text-sm font-medium text-[#1A1A1A]">{o.order_number || o.id.slice(0, 8)}</p></td>
                  <td className="px-4 py-3"><span className="text-xs text-[#666]">{new Date(o.created_at).toLocaleDateString()}</span></td>
                  <td className="px-4 py-3 text-right"><span className="text-sm font-medium">₹{Number(o.total_amount).toLocaleString('en-IN')}</span></td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${payColors[o.payment_status] || 'bg-gray-50 text-gray-500'}`}>{o.payment_status}</span></td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status] || 'bg-gray-50 text-gray-500'}`}>{o.status}</span></td>
                  <td className="px-4 py-3 text-center"><button className="text-xs text-[#E84E1B] hover:underline">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#F0F0F0] px-6 py-4 flex items-center justify-between">
              <div><h2 className="font-heading font-bold text-lg">Order {selected.order_number || selected.id.slice(0, 8)}</h2><p className="text-xs text-[#999]">{new Date(selected.created_at).toLocaleString()}</p></div>
              <button onClick={() => { setSelected(null); setActionType(''); }} className="p-1 hover:bg-[#F8F8F8] rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAFAFA] rounded-lg p-3"><p className="text-xs text-[#999] mb-1">Payment Status</p><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${payColors[selected.payment_status] || ''}`}>{selected.payment_status}</span></div>
                <div className="bg-[#FAFAFA] rounded-lg p-3"><p className="text-xs text-[#999] mb-1">Order Status</p><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selected.status] || ''}`}>{selected.status}</span></div>
              </div>

              <div>
                <h3 className="text-sm font-bold mb-2">Items</h3>
                <div className="space-y-2">
                  {items.map(it => (
                    <div key={it.id} className="flex items-center gap-3 bg-[#FAFAFA] rounded-lg p-3">
                      {it.product_image && <img src={it.product_image} alt="" className="w-12 h-12 rounded object-cover" />}
                      <div className="flex-1"><p className="text-sm font-medium">{it.product_name}</p><p className="text-xs text-[#999]">Qty: {it.quantity} · ₹{Number(it.price).toLocaleString('en-IN')}</p></div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold mb-2">Shipping Address</h3>
                <div className="bg-[#FAFAFA] rounded-lg p-3 text-sm text-[#666]">
                  {selected.shipping_address ? (
                    <div><p>{selected.shipping_address.name}</p><p>{selected.shipping_address.address}</p><p>{selected.shipping_address.city}, {selected.shipping_address.state} {selected.shipping_address.pincode}</p><p>{selected.shipping_address.phone}</p></div>
                  ) : <p className="text-[#CCC]">No address on file</p>}
                </div>
              </div>

              {selected.tracking_number && <div className="bg-[#FAFAFA] rounded-lg p-3"><p className="text-xs text-[#999] mb-1">Tracking</p><p className="text-sm">{selected.courier_name} · {selected.tracking_number}</p></div>}

              {!actionType && selected.status !== 'delivered' && selected.status !== 'cancelled' && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selected.status === 'pending' && <button onClick={() => setActionType('confirm')} className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"><CheckCircle className="w-4 h-4" /> Confirm & Verify Payment</button>}
                  {selected.status === 'confirmed' && <button onClick={() => setActionType('dispatch')} className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"><Truck className="w-4 h-4" /> Add Dispatch Details</button>}
                  {selected.status === 'dispatched' && <button onClick={() => setActionType('deliver')} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"><CheckCircle className="w-4 h-4" /> Mark Delivered</button>}
                  <button onClick={() => setActionType('cancel')} className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"><XCircle className="w-4 h-4" /> Cancel Order</button>
                  <button onClick={() => setActionType('refund')} className="flex items-center gap-1 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"><DollarSign className="w-4 h-4" /> Process Refund</button>
                </div>
              )}

              {actionType === 'dispatch' && (
                <div className="space-y-3 border-t pt-4">
                  <h3 className="text-sm font-bold">Dispatch Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs text-[#666] mb-1 block">Courier Name</label><input value={actionData.courier_name} onChange={e => setActionData({ ...actionData, courier_name: e.target.value })} placeholder="Delhivery, BlueDart..." className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm" /></div>
                    <div><label className="text-xs text-[#666] mb-1 block">Tracking Number</label><input value={actionData.tracking_number} onChange={e => setActionData({ ...actionData, tracking_number: e.target.value })} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm" /></div>
                  </div>
                  <div><label className="text-xs text-[#666] mb-1 block">Notes</label><textarea value={actionData.notes} onChange={e => setActionData({ ...actionData, notes: e.target.value })} rows={2} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm" /></div>
                  <div className="flex gap-2"><button onClick={handleAction} disabled={processing} className="px-4 py-2 bg-[#E84E1B] text-white rounded-lg text-sm hover:bg-[#d44416]">{processing ? 'Processing...' : 'Confirm Dispatch'}</button><button onClick={() => setActionType('')} className="px-4 py-2 border border-[#E8E8E8] rounded-lg text-sm text-[#666]">Cancel</button></div>
                </div>
              )}

              {(actionType === 'cancel' || actionType === 'refund') && (
                <div className="space-y-3 border-t pt-4">
                  <h3 className="text-sm font-bold">{actionType === 'refund' ? 'Process Refund' : 'Cancel Order'}</h3>
                  <div><label className="text-xs text-[#666] mb-1 block">Reason</label><textarea value={actionData.cancellation_reason} onChange={e => setActionData({ ...actionData, cancellation_reason: e.target.value })} rows={2} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm" /></div>
                  {actionType === 'refund' && <div><label className="text-xs text-[#666] mb-1 block">Notes</label><textarea value={actionData.notes} onChange={e => setActionData({ ...actionData, notes: e.target.value })} rows={2} className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm" /></div>}
                  <div className="flex gap-2"><button onClick={handleAction} disabled={processing} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">{processing ? 'Processing...' : actionType === 'refund' ? 'Process Refund' : 'Confirm Cancel'}</button><button onClick={() => setActionType('')} className="px-4 py-2 border border-[#E8E8E8] rounded-lg text-sm text-[#666]">Back</button></div>
                </div>
              )}

              {actionType === 'confirm' && (
                <div className="border-t pt-4 space-y-3">
                  <p className="text-sm text-[#666]">Confirm this order and mark payment as verified?</p>
                  <div className="flex gap-2"><button onClick={handleAction} disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">{processing ? 'Processing...' : 'Confirm'}</button><button onClick={() => setActionType('')} className="px-4 py-2 border border-[#E8E8E8] rounded-lg text-sm text-[#666]">Cancel</button></div>
                </div>
              )}

              {actionType === 'deliver' && (
                <div className="border-t pt-4 space-y-3">
                  <p className="text-sm text-[#666]">Mark this order as delivered?</p>
                  <div className="flex gap-2"><button onClick={handleAction} disabled={processing} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">{processing ? 'Processing...' : 'Mark Delivered'}</button><button onClick={() => setActionType('')} className="px-4 py-2 border border-[#E8E8E8] rounded-lg text-sm text-[#666]">Cancel</button></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
