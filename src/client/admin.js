import ReactDOM from "react-dom/client";
import React, { useRef, useEffect, useState } from 'react';
import $ from 'jquery';

function Admin() {
    // Constructor for Admin.
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // "localhost:3000" could be omitted by setting proxy in package.json
        fetch("http://localhost:3000/admin/users", {method: "GET"})
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error(err));
    }, []);

    // Delete a user via UID.
    const deleteUser = (uid) => {
        // "localhost:3000" could be omitted by setting proxy in package.json
        let delete_url = "http://localhost:3000/admin/users/" + uid;
        fetch(delete_url, { method: "DELETE" })
        .then(res => res.json())
        .then(response =>{
            console.log(response);
            alert("Deleted user " + uid);
        })

        // update user data
        setUsers(users.filter(user => user._id !== uid));
    };
  
    return (
        <div className="container">
        <h1>Admin Page</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Password</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.pwd}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => deleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default Admin;