import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaUserCircle,
  FaSignOutAlt,
  FaSearch,
  FaFilter,
  FaShoppingCart,
  FaStar,
  FaArrowRight,
  FaBoxOpen,
} from "react-icons/fa";

function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("Guest");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ------------------ LOAD DATA ------------------ */
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);

    API.get("/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setLoading(false);
      });
  }, []);

  /* ------------------ LOGOUT ------------------ */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/user-login");
  };

  /* ------------------ SEARCH FILTER ------------------ */
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-2 rounded-xl text-amber-500">
              <FaShoppingBag />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">
              Luxe<span className="text-amber-600">Mart</span>
            </span>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center bg-slate-50 px-4 py-2 rounded-full border border-slate-100 w-96">
            <FaSearch className="text-slate-300 mr-2" />
            <input
              placeholder="Search collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-xs font-bold w-full uppercase tracking-widest"
            />
          </div>

          {/* User */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Welcome
                </p>
                <p className="text-sm font-black text-slate-900">{userName}</p>
              </div>
              <FaUserCircle className="text-3xl text-slate-900" />
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <FaSignOutAlt size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HEADER ================= */}
      <header className="pt-32 pb-12 bg-slate-50">
        <div className="container mx-auto px-6 flex justify-between items-end">
          <div>
            <h2 className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">
              Curated For You
            </h2>
            <h1 className="text-5xl font-black tracking-tight">
              The <span className="text-amber-600">Collection.</span>
            </h1>
          </div>
          <button className="flex items-center gap-3 bg-slate-900 text-amber-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
            <FaFilter /> Refine Selection
          </button>
        </div>
      </header>

      {/* ================= PRODUCTS ================= */}
      <main className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-b-2 border-amber-600 rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  <img
                    src={
                      p.photo_url ||
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                    }
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex justify-center items-center">
                    <button className="bg-white px-6 py-3 rounded-full font-black text-xs flex items-center gap-2">
                      <FaShoppingCart className="text-amber-600" /> Add to Cart
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between">
                    <h3 className="font-black text-lg">{p.name}</h3>
                    <span className="text-amber-500 text-xs flex items-center">
                      <FaStar /> 4.9
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-black">₹{p.mrp}</span>
                    <button className="w-10 h-10 rounded-full border flex items-center justify-center">
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-dashed border-2">
            <FaBoxOpen className="mx-auto text-4xl text-slate-300 mb-4" />
            <h3 className="text-xl font-black">No Products Found</h3>
            <p className="text-slate-400 mt-2">
              Try searching with a different keyword.
            </p>
          </div>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="container mx-auto px-6 py-12 border-t text-slate-400 flex justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest">
          © 2026 LUXEMART STOREFRONT
        </p>
        <div className="flex gap-6 text-[10px] font-black uppercase">
          <span className="hover:text-slate-900 cursor-pointer">Support</span>
          <span className="hover:text-slate-900 cursor-pointer">Privacy</span>
        </div>
      </footer>
    </div>
  );
}

export default UserDashboard;
