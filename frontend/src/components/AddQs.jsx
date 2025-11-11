import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/add.css";

const AddQs = () => {
  const [qs, setQs] = useState('');
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);
  const [message, setMessage] = useState('');
  const [paperId, setPaperId] = useState('');
  const [papers, setPapers] = useState([]);

  // Fetch existing papers
  useEffect(() => {
    axios.get('http://localhost:5000/api/paper/all')
      .then(res => setPapers(res.data.papers || []))
      .catch(err => console.error("Error fetching papers:", err));
  }, []);

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const handleRemove = async (e) => {
    e.preventDefault();
   try {
      const response = await axios.post(`http://localhost:5000/api/quiz/removeAll/${paperId}`); 
      if (response.data.error) {
        setMessage(response.data.error);
        setTimeout(() => {
        setMessage('');
      }, 3000);
        return;
      }else{
        setMessage(response.data.message);
        setTimeout(() => {
        setMessage('');
      }, 3000);
      }
      
    } catch (err) {
      setMessage('Failed to remove questions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paperId) {
      setMessage("Please select a Paper ID before adding a question.");
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/quiz/add', {
        paperId: parseInt(paperId),
        qs,
        options,
        correct_option: correctOption
      });
      setMessage('Question added successfully!');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      resetForm();
    } catch (err) {
      setMessage('Error adding question.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const resetForm = () => {
    setQs('');
    setOptions(['', '', '', '']);
    setCorrectOption(0);
  };

  const handleNavigateAdmin = () => window.location.replace('/admin');
  const handleNavigateRemoveSpecific = () => window.location.replace('/SnD/' + paperId);

  return (
    <div className="container">
      <h1 className='main-header'>Add a New Question</h1>

      <div className='select-paper'>
        <label>Select Paper ID:</label>
        <select value={paperId} typeof='submit' onChange={e => setPaperId(e.target.value) } required>
          <option value="">-- Select a Paper --</option>
          {papers.map(p => (
            <option key={p.paperId} value={p.paperId}>
              {p.paperId} - {p.title || 'Untitled'}
            </option>
          ))}
        </select>
      </div>

      <form className='Question-form' onSubmit={handleSubmit}>
        <div className='Question-div'>
          <label>Question:</label>
          <input
            type="text"
            value={qs}
            onChange={e => setQs(e.target.value)}
            required
          />
        </div>

        <div className='options-div'>
          <label>Options:</label>
          {options.map((opt, idx) => (
            <div key={idx}>
              <input
                type="text"
                value={opt}
                onChange={e => handleOptionChange(idx, e.target.value)}
                required
              />
              <input
                type="radio"
                name="correctOption"
                checked={correctOption === idx}
                onChange={() => setCorrectOption(idx)}
              /> Correct
            </div>
          ))}
        </div>

        <button className='submit-Qs' type="submit">Add Question</button>
      </form>

      
        <button className='submit-Qs' onClick={handleRemove}>Remove Questions
          <br /> As per Paper</button>
      <button className='submit-Qs' onClick={() => {handleNavigateRemoveSpecific(); sessionStorage.setItem('paperId', paperId);}}>Remove Specific</button>
      <button className="submit-Qs" onClick={handleNavigateAdmin}>Back</button>

      {message && <p className='result'>{message}</p>}
    </div>
  );
};

export default AddQs;
