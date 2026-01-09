import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { 
  FaPlus, FaTrash, FaBox, FaEdit, FaSyncAlt, 
  FaLayerGroup, FaImage, FaSignOutAlt, FaTimes, FaCheckCircle
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", mrp: "", photo_url: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // --- NEW: Alert State ---
  const [alert, setAlert] = useState({ visible: false, message: "" });

  const triggerAlert = (msg) => {
    setAlert({ visible: true, message: msg });
    setTimeout(() => setAlert({ visible: false, message: "" }), 3000);
  };

  const load = () => {
    setLoading(true);
    API.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Load failed", err))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to terminate this administrative session?")) {
      localStorage.clear();
      navigate("/admin-login");
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      quantity: product.quantity,
      mrp: product.mrp,
      photo_url: product.photo_url
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", quantity: "", mrp: "", photo_url: "" });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.mrp) return alert("Required fields: Name and MRP");
    
    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, form);
        triggerAlert("Product updated successfully!"); // Alert for update
        setEditingId(null);
      } else {
        await API.post("/products", form);
        triggerAlert("New product added to inventory!"); // Alert for add
      }
      
      setForm({ name: "", quantity: "", mrp: "", photo_url: "" });
      load();
    } catch (error) {
      console.error("Operation failed", error);
      alert("System Error: Could not save product.");
    }
  };

  const del = async (id) => {
    if (window.confirm("Permanently delete this product from database?")) {
      await API.delete(`/products/${id}`);
      triggerAlert("Product deleted.");
      load();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      
      {/* --- FLOATING NOTIFICATION --- */}
      {alert.visible && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
          <div className="bg-slate-900 text-amber-500 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <FaCheckCircle className="text-green-400" />
            <span className="text-xs font-black uppercase tracking-widest">{alert.message}</span>
          </div>
        </div>
      )}

      {/* Executive Header */}
      <nav className="bg-slate-900 text-white p-5 shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg text-slate-900 shadow-lg shadow-amber-500/20">
              <FaLayerGroup size={18} />
            </div>
            <h1 className="text-lg font-black tracking-tighter uppercase">Luxe<span className="text-amber-500">Admin</span></h1>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={load} className="text-slate-400 hover:text-amber-500 transition-all">
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-6 lg:p-10 space-y-10">
        
        {/* Statistics Bar */}
        <div className="flex flex-wrap gap-4">
            <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
                <FaBox className="text-amber-500" />
                <span className="text-xs font-bold text-slate-500">Live Inventory:</span>
                <span className="font-black">{products.length} Items</span>
            </div>
            <div className="bg-slate-900 px-6 py-4 rounded-2xl border border-slate-700 flex items-center gap-3 shadow-sm text-white ml-auto">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">System Status: Operational</span>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          
          {/* Add / Edit Product Form */}
          <section className={`bg-white p-8 rounded-[32px] shadow-sm border transition-all duration-500 space-y-6 lg:sticky lg:top-28 ${editingId ? 'border-amber-500 ring-4 ring-amber-500/5' : 'border-slate-200'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black tracking-tight">{editingId ? "Modify Asset" : "Product Entry"}</h2>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
                  {editingId ? `Editing ID: ${editingId}` : "Populate Central Database"}
                </p>
              </div>
              {editingId && (
                <button onClick={cancelEdit} className="p-2 bg-slate-100 text-slate-400 hover:text-red-500 rounded-full transition-colors">
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Title</label>
                <input 
                  value={form.name}
                  placeholder="Premium Item Name" 
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 outline-none transition-all font-medium text-sm"
                  onChange={e=>setForm({...form, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Stock</label>
                  <input 
                    value={form.quantity}
                    type="number" 
                    placeholder="Qty" 
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 outline-none transition-all font-medium text-sm"
                    onChange={e=>setForm({...form, quantity: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">MRP (₹)</label>
                  <input 
                    value={form.mrp}
                    type="number" 
                    placeholder="Valuation" 
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 outline-none transition-all font-medium text-sm"
                    onChange={e=>setForm({...form, mrp: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Asset Asset URL</label>
                <div className="relative">
                  <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    value={form.photo_url}
                    placeholder="https://cloud.assets.com/img" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-500 outline-none transition-all font-medium text-sm"
                    onChange={e=>setForm({...form, photo_url: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] ${editingId ? 'bg-amber-500 text-slate-900' : 'bg-slate-900 text-amber-500 hover:bg-black'}`}
              >
                {editingId ? <><FaCheckCircle /> Update Product</> : <><FaPlus /> Commit to Inventory</>}
              </button>
            </div>
          </section>

          {/* Active Inventory Table */}
          <section className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center text-slate-900">
              <h3 className="text-xl font-black tracking-tight uppercase">Inventory Control</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Asset</th>
                    <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                    <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Value</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className={`hover:bg-slate-50/80 transition-all group ${editingId === p.id ? 'bg-amber-50' : ''}`}>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={p.photo_url || 'https://via.placeholder.com/40'} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                          <span className={`font-bold tracking-tight ${editingId === p.id ? 'text-amber-600' : 'text-slate-800'}`}>{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase ${p.quantity < 10 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                          {p.quantity} In Stock
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <span className="font-black text-slate-900 text-sm">₹{p.mrp}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => startEdit(p)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${editingId === p.id ? 'bg-amber-500 text-white' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-900'}`}
                          >
                            <FaEdit size={12}/>
                          </button>
                          <button 
                            onClick={() => del(p.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-600 transition-all"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;