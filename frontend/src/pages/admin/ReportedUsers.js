import React, { useEffect, useState } from "react";
import axios from 'axios';
import SideBar from "../../components/sidebar/sideBar";
import DeleteConfirmationModal from "../../components/adForm/deleteConfirmationModal";
import "./style.css";

function ReportedUsers() {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);

  useEffect(() => {
    const fetchAdData = async () => {
        try {
            let apiUrl = process.env.REACT_APP_APIURL + '/admin/reported-users';
            const response = await axios.get(apiUrl);
            setReportedUsers(response.data.rows);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching ad data:', error);
            setIsLoading(false);
        }
    };

    fetchAdData();
}, []);

  const handleDeleteUser = (userId) => {
    fetch(process.env.REACT_APP_APIURL + `/reported-users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete reported user");
        }
        setReportedUsers(reportedUsers.filter((user) => user.id !== userId));
      })
      .catch((error) => {
        console.error("Delete error:", error);
        setError(error.toString());
      });
  };
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading reported users: {error}</div>;

  return (
    <div>
      <div className="container-fluid">
      <div className="row">
        <div className="col-2 sidebar">
            <SideBar />
        </div>
        <div className="col-sm-12 col-md-10 ad-container">
        <section className="reportedUsers">
          {reportedUsers.map((user) => (
            <article key={user.id}>
              <p style={{ marginBottom: '5px', marginTop: '20px' }}>
                Reported for: <span>{user.reason}</span>
              </p>
              <div className="deleteUserContainer">
                <p>{user.first_name} {user.last_name}</p>
                <button className="btn btn-yellow rounded border-0 p-2 px-2 mx-1"
            onClick={($event) => {$event.preventDefault(); setIsDeleteModalShown(!isDeleteModalShown)}}
            >Delete</button>
              </div>
              <DeleteConfirmationModal show={isDeleteModalShown} 
            id={user.id}
            onHide={() => setIsDeleteModalShown(false)}
            />
            </article>
          ))}
        </section>
        </div>
      </div>
    </div>
    </div>
       
  );
}

export default ReportedUsers;
