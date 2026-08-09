import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/AdminCoupons.css";

function AdminCoupons() {

  const [coupons, setCoupons] = useState([]);

  const [form, setForm] = useState({
    code: "",
    discount_type: "Percentage",
    discount_value: "",
    minimum_amount: "",
    expiry_date: "",
    is_active: true
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {

    try {

      const response = await API.get("/api/admin/coupons");

      setCoupons(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });

  };

  const resetForm = () => {

    setEditingId(null);

    setForm({
      code: "",
      discount_type: "Percentage",
      discount_value: "",
      minimum_amount: "",
      expiry_date: "",
      is_active: true
    });

  };

  const saveCoupon = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await API.put(`/api/admin/coupon/${editingId}`, form);

        alert("Coupon Updated Successfully");

      } else {

        await API.post("/api/admin/coupon", form);

        alert("Coupon Created Successfully");

      }

      fetchCoupons();

      resetForm();

    } catch (error) {

      console.log(error);

      alert("Unable to Save Coupon");

    }

  };

  const editCoupon = (coupon) => {

    setEditingId(coupon.id);

    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      minimum_amount: coupon.minimum_amount,
      expiry_date: coupon.expiry_date,
      is_active: coupon.is_active
    });

  };

  const deleteCoupon = async (id) => {

    if (!window.confirm("Delete this coupon?")) return;

    try {

      await API.delete(`/api/admin/coupon/${id}`);

      alert("Coupon Deleted Successfully");

      fetchCoupons();

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="coupon-page">

      <h1>Coupon Management</h1>

      <form className="coupon-form" onSubmit={saveCoupon}>

        <input
          type="text"
          name="code"
          placeholder="Coupon Code"
          value={form.code}
          onChange={handleChange}
          required
        />

        <select
          name="discount_type"
          value={form.discount_type}
          onChange={handleChange}
        >

          <option>Percentage</option>

          <option>Flat</option>

        </select>

        <input
          type="number"
          name="discount_value"
          placeholder="Discount"
          value={form.discount_value}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="minimum_amount"
          placeholder="Minimum Order"
          value={form.minimum_amount}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="expiry_date"
          value={form.expiry_date}
          onChange={handleChange}
          required
        />

        <label>

          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />

          Active

        </label>

        <button type="submit">

          {editingId ? "Update Coupon" : "Create Coupon"}

        </button>

      </form>

      <table>

        <thead>

          <tr>

            <th>Code</th>

            <th>Type</th>

            <th>Discount</th>

            <th>Minimum</th>

            <th>Expiry</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {coupons.map((coupon) => (

            <tr key={coupon.id}>

              <td>{coupon.code}</td>

              <td>{coupon.discount_type}</td>

              <td>{coupon.discount_value}</td>

              <td>₹ {coupon.minimum_amount}</td>

              <td>{coupon.expiry_date}</td>

              <td>

                {coupon.is_active ? "✅ Active" : "❌ Inactive"}

              </td>

              <td>

                <button
                  onClick={() => editCoupon(coupon)}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteCoupon(coupon.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default AdminCoupons;