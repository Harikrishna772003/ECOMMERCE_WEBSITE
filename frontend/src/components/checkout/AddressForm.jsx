import "./AddressForm.css";

function AddressForm({
    address,
    setAddress
}) {

    const handleChange = (e) => {

        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });

    };

    return (

        <div className="address-card">

            <h2>📍 Shipping Address</h2>

            <div className="address-grid">

                <div className="form-group">

                    <label>Full Name</label>

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Enter Full Name"
                        value={address.fullName}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>Phone Number</label>

                    <input
                        type="text"
                        name="phone"
                        placeholder="Enter Phone Number"
                        value={address.phone}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group full-width">

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email Address"
                        value={address.email}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group full-width">

                    <label>Street Address</label>

                    <textarea
                        rows="4"
                        name="street"
                        placeholder="House No, Street, Area..."
                        value={address.street}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>City</label>

                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={address.city}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>State</label>

                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={address.state}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>Pincode</label>

                    <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={address.pincode}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>Country</label>

                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={address.country}
                        onChange={handleChange}
                    />

                </div>

            </div>

        </div>

    );

}

export default AddressForm;