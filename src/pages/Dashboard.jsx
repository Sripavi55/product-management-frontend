import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    productName: "",
    price: "",
    rating: "",
    discount: "",
    availability: "",
    category: "",
    company: "",
  });

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/products");
      const productData = res.data?.data || res.data || [];
      setProducts(productData);
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= ADD PRODUCT =================
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const productData = {
        productName: form.productName,
        price: Number(form.price),
        rating: Number(form.rating),
        discount: Number(form.discount || 0),
        availability: form.availability || "In Stock",
        category: form.category,
        company: form.company,
      };

      await axios.post("/api/products", productData);

      alert("Product added successfully!");

      setForm({
        productName: "",
        price: "",
        rating: "",
        discount: "",
        availability: "",
        category: "",
        company: "",
      });

      fetchProducts();
    } catch (err) {
      console.log("ADD ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ================= FILTERED PRODUCTS =================
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Dashboard 🚀</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search products..."
            className="border p-2 rounded w-60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add Product Form */}
      <form
        onSubmit={handleAdd}
        className="bg-white p-6 rounded-xl shadow mb-10 grid md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Product Name"
          value={form.productName}
          onChange={(e) =>
            setForm({ ...form, productName: e.target.value })
          }
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          step="0.1"
          placeholder="Rating"
          value={form.rating}
          onChange={(e) =>
            setForm({ ...form, rating: e.target.value })
          }
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Discount"
          value={form.discount}
          onChange={(e) =>
            setForm({ ...form, discount: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Availability"
          value={form.availability}
          onChange={(e) =>
            setForm({ ...form, availability: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Company"
          value={form.company}
          onChange={(e) =>
            setForm({ ...form, company: e.target.value })
          }
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="col-span-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {submitting ? "Adding..." : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No products found.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-300"
              >
                <h2 className="font-bold text-xl mb-2">
                  {product.productName}
                </h2>

                <p className="text-gray-700 mb-1">
                  ₹ {product.price}
                </p>

                <p className="text-yellow-500 mb-1">
                  ⭐ {product.rating}
                </p>

                <p className="text-green-600 text-sm mb-1">
                  Discount: {product.discount}%
                </p>

                <p className="text-gray-600">
                  {product.company}
                </p>

                <p className="text-gray-500 text-sm">
                  {product.category}
                </p>

                <button
                  onClick={() => handleDelete(product._id)}
                  className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
