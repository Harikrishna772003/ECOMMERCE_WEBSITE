import { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminUsers.css";

function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get("/api/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleUser = async (id) => {
    try {
      const response = await API.put(
        `/api/admin/users/toggle/${id}`
      );

      alert(response.data.message);

      fetchUsers();

    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    try {

      const response = await API.delete(
        `/api/admin/users/${id}`
      );

      alert(response.data.message);

      fetchUsers();

    } catch (error) {
      console.log(error);
    }

  };

  const filteredUsers = users.filter((user) =>
    user.full_name
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    user.email
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (

    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-content">

        <h1>Users Management</h1>

        <input
          type="text"
          className="search-box"
          placeholder="Search User..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <table className="admin-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Name</th>

              <th>Email</th>

              <th>Phone</th>

              <th>Status</th>

              <th>Joined</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.length > 0 ? (

              filteredUsers.map((user) => (

                <tr key={user.id}>

                  <td>{user.id}</td>

                  <td>{user.full_name}</td>

                  <td>{user.email}</td>

                  <td>{user.phone}</td>

                  <td>

                    <span
                      style={{
                        color: user.is_active
                          ? "green"
                          : "red",
                        fontWeight: "bold"
                      }}
                    >
                      {user.is_active
                        ? "Active"
                        : "Blocked"}
                    </span>

                  </td>

                  <td>{user.created_at}</td>

                  <td>

                    <button
                      className={
                        user.is_active
                          ? "block-btn"
                          : "unblock-btn"
                      }
                      onClick={() =>
                        toggleUser(user.id)
                      }
                    >
                      {user.is_active
                        ? "Block"
                        : "Unblock"}
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteUser(user.id)
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
                  No Users Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default AdminUsers;