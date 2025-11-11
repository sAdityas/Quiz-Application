import React, { useEffect } from "react";
import '../css/adminlogin.css'

const AdminLogin = () => {
    const adminName = 'admin';
    const adminPass = 'admin';
    useEffect(() => {
        const adminUsername = document.getElementById('adminUsername');
        const adminPassword = document.getElementById('adminPassword');

        adminUsername.value = adminName;
        adminPassword.value = adminPass;
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        const adminUsername = document.getElementById('adminUsername').value;
        const adminPassword = document.getElementById('adminPassword').value;
        if (adminUsername === adminName && adminPassword === adminPass) {
            sessionStorage.setItem('quizStarted', 'true');
            sessionStorage.setItem('completed', 'false');
            sessionStorage.removeItem('score');
            sessionStorage.removeItem('answers');
            sessionStorage.setItem('user', adminUsername);
            sessionStorage.setItem(adminName,adminPass);
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            window.location.href = '/admin';
        } else {
            alert('Invalid credentials');
        }
    }

    return (
        <div className="container">
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin} className="form-admin">
                <label htmlFor="adminUsername">Admin Username</label>
        <input
          id="adminUsername"
            type="text"
            minLength={3}
            maxLength={25}
            required
            className="form-input"
            placeholder="Enter admin username"
        />
        <label htmlFor="adminPassword">Admin Password</label>
        <input
          id="adminPassword"
          type="password"
          minLength={6}
          maxLength={25}
          required
          className="form-input"
          placeholder="Enter admin password"
        />
        <button type="submit" className="login-button">
          Login
        </button>

      </form>
    </div>
  );
};

export default AdminLogin;
