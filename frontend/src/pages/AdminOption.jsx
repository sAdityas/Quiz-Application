import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/AdminOption.css";

const AdminOption = () => {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState('');
  const [paperId, setPaperId] = React.useState(''); // Optional: dynamic paper ID
  const [papers, setPapers] = React.useState([]);
  const [title, setTitle] = React.useState([]);


  React.useEffect(() => {
    // Fetch available papers for the dropdown
    axios.get(`http://localhost:5000/api/paper/all`)
      .then((response) => {
        setPapers(response?.data?.papers || []);
        setTitle(response?.data?.papers[0]?.title || 'Untitled'); 
        console.log("Papers fetched:", response.data.papers);
        if (response.data.papers.length === 0) {
          setMessage('No papers available');
      }
      })
      .catch((error) => {
        setMessage('Error fetching papers');
      });
  }, []);

  const handleAddQs = () => {
    navigate('/add', { replace: true });
  };

  const handleRemoveAll = async () => {
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

  const handleResetScore = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/user/resetScore');
      setMessage('All Scores Reset');
      setTimeout(() => {
        setMessage('');
      }, 3000);
      localStorage.removeItem('completed');
      sessionStorage.removeItem('score');
    } catch (err) {
      setMessage('Failed to reset scores');
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/admin-login', { replace: true });
  };

  const handleDownloadReports = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/excelInsert/downloadZip/${paperId}`, // Updated route to include paperId
        { responseType: 'blob' }
      );
      
      const blob = new Blob([response.data], { type: 'application/zip' });
      console.log("Blob size:", blob);
      if (!blob.size) {
        setMessage('No reports available for this paper ID');
        return;
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SkillMatrix_${paperId}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      await axios.post('http://localhost:5000/api/user/resetScore');
      setMessage('All Scores Reset');
      localStorage.removeItem('completed');
      sessionStorage.removeItem('score');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage('No reports available for this paper ID');
      }else if(error.response && error.response.status === 500) {
        setMessage('Server error while downloading reports');
      }else if (error.message) {
        setMessage(`Error downloading reports: ${error.message}`);
      }
    }
  };
  return (
    <div className="container">
      <h1 className="Admin">Admin</h1>
      <div className="btnholder">
        <button className='submit-Qs' onClick={handleAddQs}>Add Questions</button>
        <button className='submit-Qs' onClick={handleResetScore}>Reset Score</button>
        <button className='submit-Qs' onClick={handleDownloadReports}>Download Reports</button>
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
        
        <button className='submit-Qs' onClick={handleRemoveAll}>Remove Questions
          <br /><br/> As per Paper</button>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>
      {message && <p className='result'>{message}</p>}
    </div>
  );
};

export default AdminOption;
