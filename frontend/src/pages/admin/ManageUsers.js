import React, { useEffect, useState } from "react";
import SideBar from "../../components/sidebar/sideBar";
import DeleteConfirmationModal from "../../components/adForm/deleteConfirmationModal";
import axios from 'axios';
import "./style.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [confirmPassword, setConfirmPassword] = useState([]);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isAdmin: false,
    currentPassword: "",
    newPassword: ""
  });

  useEffect(() => {
    fetch(process.env.REACT_APP_APIURL + "/admin/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleSelectChange = (event) => {
    const selectedUserId = event.target.value;
    const user = users.find((user) => user.id === selectedUserId);

    if (selectedUserId == "nothing") {
      return;
    }

    setSelectedUser(user);
    setEditFormData({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone_number,
      isAdmin: user.is_admin,
      currentPassword: "",
      newPassword: ""
    });
  };

  const refreshPage= () => {
    window.location.reload();
  }

  const handleConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  }

  const handleFormChange = (event) => {
    const { id, value, type, checked } = event.target;
    console.log(value);
    let updatedFormData = {};

  
    if (type === "checkbox") {
      updatedFormData = {
        ...editFormData,
        [id]: checked ? 1 : 0,
      };
    }  else {
      updatedFormData = {
        ...editFormData,
        [id]: value,
      };
    }
  
    setEditFormData(updatedFormData);
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (editFormData.newPassword != confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      console.log(editFormData);

      if (editFormData.currentPassword && editFormData.newPassword) {

        await axios.put(process.env.REACT_APP_APIURL + "/profile/newPassword", {
          id: selectedUser.id,
          currentPassword: editFormData.currentPassword,
          newPassword: editFormData.newPassword,
        });
        console.log("Password updated successfully");
      } 

      await axios.put(process.env.REACT_APP_APIURL + "/profile/update", {
        id: selectedUser.id,
        first_name: editFormData.firstName,
        last_name: editFormData.lastName,
        email: editFormData.email,
        phone_number: editFormData.phone,
        is_admin: editFormData.isAdmin
      });
      console.log("User details updated successfully");
    
      alert('User updates successful');
    } catch (error) {
      console.error("Error updating user details or password:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 sidebar">
            <SideBar />
        </div>
        <div className="col-sm-12 col-md-10 ad-container">
        <div>
          <select className="user-list" onChange={handleSelectChange}>
            <option className="option-user" value="nothing">Select a user</option>
            {users.map((user, index) => (
              <option key={user.id} value={user.id}>
                {user.last_name}, {user.first_name}
              </option>
            ))}
          </select>
          {selectedUser.id ? (
            <section>
              <form onSubmit={handleSubmit} className="edit-form">
              <p className="form-title-user_name">{editFormData.firstName} {editFormData.lastName}</p>
                <p className="form-title">Edit User Profile</p>
                <div className="form-group">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input className="form-control" id="firstName" placeholder={editFormData.firstName}  onChange={handleFormChange} />  
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input className="form-control" id="lastName" placeholder={editFormData.lastName}  onChange={handleFormChange}  />
                  </div>
                </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input className="form-control" id="email" placeholder={editFormData.email} onChange={handleFormChange}  />  
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone Number</label>
                      <input className="form-control" id="phone" placeholder={editFormData.phone}  onChange={handleFormChange} />
                    </div>
                  </div>
                  <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Password Changes</label>
                    <input className="form-control" type="password" id="currentPassword" placeholder="Current Password" onChange={handleFormChange} />  
                  </div>
                  <div className="col-md-12 mb-3">
                    <input className="form-control" type="password" id="newPassword" placeholder="New Password"  onChange={handleFormChange}  />
                  </div>
                  <div className="col-md-12 mb-3">
                    <input className="form-control" type="password" id="confirmNewPassword" placeholder="Confirm New Password" onChange={handleConfirmPassword}/>  
                  </div>
                </div>
                <div className="row">
                  <div htmlFor="isAdmin">Make Admin? 
                  <input
                      className="admin-button"
                      id="isAdmin"
                      type="checkbox"
                      name="isAdmin"
                      onChange={handleFormChange}       
                      checked={editFormData.isAdmin}               
                    /></div>
                </div>
                <div className="row button-options">
                  <div className="option-buttons">
                  <button className="btn btn-yellow rounded border-0 p-2 px-2 mx-1"
            onClick={($event) => {$event.preventDefault(); setIsDeleteModalShown(!isDeleteModalShown)}}
            >
              Delete User
            </button>
                    <button className="save-changes-button btn rounded border-0 p-2 px-2 mx-1"type="submit">Save Changes</button>
                    <button className="cancel-button btn rounded border-0 p-2 px-2 mx-1"type="submit" onClick={refreshPage}>Cancel</button>
                    <DeleteConfirmationModal show={isDeleteModalShown} 
            id={selectedUser.id}
            onHide={() => setIsDeleteModalShown(false)}
            />
                  </div>
                </div>
                </div>
              </form>
            </section>
          ) : (<></>)}
        </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
