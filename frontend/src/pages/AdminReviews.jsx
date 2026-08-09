import { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminReviews.css";

function AdminReviews() {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {

    try {

      const response = await API.get(
        "/api/admin/reviews"
      );

      setReviews(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const deleteReview = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this review?"
    );

    if (!confirmDelete) return;

    try {

      const response = await API.delete(
        `/api/admin/review/delete/${id}`
      );

      alert(response.data.message);

      fetchReviews();

    } catch (error) {

      console.log(error);

    }

  };
    return (

    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-content">

        <h1>Customer Reviews</h1>

        <table className="admin-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Customer</th>

              <th>Product</th>

              <th>Rating</th>

              <th>Review</th>

              <th>Date</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {reviews.length > 0 ? (

              reviews.map((review) => (

                <tr key={review.id}>

                  <td>{review.id}</td>

                  <td>{review.user_name}</td>

                  <td>{review.product_name}</td>

                  <td>
                    {"⭐".repeat(review.rating)}
                  </td>

                  <td>{review.comment}</td>

                  <td>{review.date}</td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteReview(review.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px"
                  }}
                >
                  No Reviews Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );
  }

export default AdminReviews;