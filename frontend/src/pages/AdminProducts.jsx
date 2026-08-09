import { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminProducts.css";

function AdminProducts() {

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    image: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {

      const response = await API.get("/api/admin/products");

      setProducts(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await API.put(
          `/api/admin/product/${editingId}`,
          formData
        );

        alert("Product Updated Successfully");

      }

      else {

        await API.post(
          "/api/admin/product",
          formData
        );

        alert("Product Added Successfully");

      }

      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        image: ""
      });

      setEditingId(null);

      fetchProducts();

    }

    catch (error) {

      console.log(error);

    }

  };

  const editProduct = (product) => {

    setEditingId(product.id);

    setFormData({

      name: product.name,

      price: product.price,

      description: product.description,

      category: product.category,

      stock: product.stock,

      image: product.image

    });

  };

  const deleteProduct = async (id) => {

    if (!window.confirm("Delete this product?")) {

      return;

    }

    try {

      await API.delete(`/api/admin/product/${id}`);

      alert("Product Deleted Successfully");

      fetchProducts();

    }

    catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-content">

        <h1>Inventory Management</h1>

        <form
          className="product-form"
          onSubmit={handleSubmit}
        >

          <input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />

          <input
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <button type="submit">

            {editingId ? "Update Product" : "Add Product"}

          </button>

        </form>

        <table className="admin-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Image</th>

              <th>Name</th>

              <th>Category</th>

              <th>Price</th>

              <th>Stock</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {products.map((product) => (

              <tr
                key={product.id}
                className={
                  product.status === "Out Of Stock"
                    ? "out-stock-row"
                    : product.status === "Low Stock"
                    ? "low-stock-row"
                    : ""
                }
              >

                <td>{product.id}</td>

                <td>

                  <img
                    src={product.image}
                    alt={product.name}
                    width="60"
                  />

                </td>

                <td>{product.name}</td>

                <td>{product.category}</td>

                <td>₹ {product.price}</td>

                <td>{product.stock}</td>

                <td>

                  <span
                    className={
                      product.status === "In Stock"
                        ? "status-green"
                        : product.status === "Low Stock"
                        ? "status-yellow"
                        : "status-red"
                    }
                  >

                    {product.status}

                  </span>

                </td>

                <td>

                  <button
                    onClick={() => editProduct(product)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteProduct(product.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default AdminProducts;