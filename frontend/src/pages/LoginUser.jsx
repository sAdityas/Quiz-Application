import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/LoginUser.css'; // Import the CSS

const LoginUser = () => {
  const navigate = useNavigate();
  const [paperId, setPaperId] = useState('');
  const [user, setUser] = useState('');
  const [id, setId] = useState('');
  const [message, setMessage] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [papers, setPapers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(localStorage.getItem('completed'));

  useEffect(() => {
    axios
      .get('/api/paper/all')
      .then(res => setPapers(res.data.papers || ['No papers available']))
      .catch(err => console.error("Error fetching papers:", err));

    const stored = parseInt(localStorage.getItem('attempt')) || 0;
    setAttempt(stored);
  }, []);

  const handleSubmit = async (e) => {
    if (attempt > 3) {
      setMessage("All attempts are finished");
      return;
    }

    try {

      // Validate inputs
      await axios.post('/api/user/login', { user, Uid: id });
      
      sessionStorage.setItem('user', user);
      sessionStorage.setItem('id', id);
      sessionStorage.setItem('paperId', paperId);
      

      

      // Check if the user is an admin
      if (user.toLowerCase() === 'admin' && id === 'Track@123') {
        sessionStorage.setItem('quizStarted', 'true');
        sessionStorage.removeItem('score');
        sessionStorage.removeItem('answers');
        setMessage('Login successful! Redirecting to admin page...');
        localStorage.setItem('completed', 'false');
        setTimeout(() =>{ navigate('/admin', { replace: true }); sessionStorage.clear();}, 1000);
      } else {
        const res = await axios.get(`/api/user/getScore?name=${(user.toUpperCase())}&Uid=${id}`);
        const existingScore = res?.data?.score;
        console.log("Existing Score:", existingScore);
      if (existingScore && Number(existingScore) > 0) {
        setMessage('You have already taken the quiz. Please contact the admin for further assistance.');
        return;
      }else {
          sessionStorage.setItem('quizStarted', 'true');
          sessionStorage.removeItem('score');
          sessionStorage.removeItem('answers');
          setMessage('Login successful! Redirecting to quiz page...');
          setTimeout(() => navigate('/quiz/' + paperId, { replace: true }), 1000);
        }
      }
      }
      catch (err) {
      const nextAttempt = attempt + 1;
      setAttempt(nextAttempt);
      localStorage.setItem('attempt', nextAttempt);
      const errMsg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      setMessage(errMsg);
    }
  };

  return (
      <div className="login-container">
        <h1 className="login-title">User Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          className="login-form"
        >
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            minLength={3}
            maxLength={25}
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            className="form-input"
            placeholder="Enter your name"
          />

          <label htmlFor="userid">User ID</label>
          <div className="id-group">
            <span className="prefix">TCLP/TCL/P/</span>
            <input
              id="userid"
              type="text"
              minLength={4}
              maxLength={16}
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="form-input"
              placeholder="Your ID"
            />
          </div>

          <div className="select-paper">
            <label>Select Paper ID:</label>
            <select
              value={paperId}
              onChange={(e) => setPaperId(e.target.value)}
              required
            >
              <option value="">-- Select a Paper --</option>
              {papers.map((p) => (
                <option key={p.paperId} value={p.paperId}>
                  {p.title || 'Untitled'}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          {message && <p className="error-message">{message}</p>}
        </form>
      </div>
    )
};

export default LoginUser;
