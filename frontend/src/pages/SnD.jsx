import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/SnD.css';
import { useNavigate } from 'react-router-dom';

const SnD = () => {
  const paperId = sessionStorage.getItem('paperId');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQs, setSelectedQs] = useState([]);

  useEffect(() => {
    if (paperId) {
      fetchQuestions();
    }
  }, [paperId]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`/api/quiz/${paperId}`);
      setQuestions(res.data.Questions || []);
    } catch (err) {
      setMessage('Error fetching questions');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const handleSelectQs = (id) => {
    setSelectedQs((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleDeleteQs = async () => {
    try {
      await Promise.all(
        selectedQs.map(id =>
          axios.delete(`/api/quiz/${id}`)
        )
      );
      setMessage('Selected questions deleted');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      setSelectedQs([]);
      fetchQuestions();
    } catch (err) {
      setMessage('Error deleting questions');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const handleNavigateback = () => {
    navigate('/admin');
  };

if (!paperId || paperId.trim() === "") {
  return (
    <div className="container">
      <h2>No paper selected.</h2>
      <button onClick={handleNavigateback}>Back</button>
    </div>
  );
}


  return (
    <div className="container">
      <h1>Questions in Paper #{paperId}</h1>
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Select</th>
            <th>Question</th>
            <th>Options</th>
            <th>Correct Option</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedQs.includes(q.id)}
                  onChange={() => handleSelectQs(q.id)}
                />
              </td>
              <td>{q.Question}</td>
              <td>{Array.isArray(q.options) ? q.options.join(', ') : ''}</td>
              <td>{q.correct_option !== undefined ? q.correct_option : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleDeleteQs}
        disabled={selectedQs.length === 0}
        style={{ marginTop: '1rem' }}
      >
        Delete Selected Questions
      </button>
      <button onClick={handleNavigateback}>Back</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SnD;
