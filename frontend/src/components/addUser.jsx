import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddUser = () =>{

    const navigate = useNavigate()

    const [user,setUser] = useState('')
    const [id, setId] = useState('')
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false)



    useEffect(() => {
    const tempUser = sessionStorage.getItem('tempUser') || '';
    const tempId = sessionStorage.getItem('tempId') || '';
    setUser(tempUser);
    setId(tempId);
    }, []);

    const handleSubmit = async(e) => {
        e.preventDefault()
        if (isSubmitting) return;
        setIsSubmitting(true)
        try{
            await axios.post('http://192.168.0.240:5000/api/user/add', {
                user,
                Uid : id
            });
            setMessage("User Added Successfully!")
            setUser('')
            setId('')
            sessionStorage.setItem('User', user);
            sessionStorage.setItem('Id', id);
            sessionStorage.removeItem('tempUser');
            sessionStorage.removeItem('tempId');

            setTimeout(() => {
            sessionStorage.setItem('quizStarted', 'true');
            navigate('/quiz',{replace:true})
    }, 1000);
        }catch(err){
            if (err.response && err.response.data && err.response.data.message) {
                setMessage(err.response.data.message);
            } else {
                setMessage("Error");
            }
        }finally{
                setIsSubmitting(false)
        }
        }

    return(
        <div className="container">
            <h1 className="main-header">
                Employee Detail
            </h1>
            <form onSubmit={handleSubmit} className="user-form">
                <label>User:</label>
                <input 
                minLength={3}
                maxLength={25}
                type="text" 
                value={user} 
                onChange={e => setUser(e.target.value)}
                required
                />
        <div className='TCLPID'>
        <span> </span>
          <span className='TCLPSpan'>TCLP/</span>
          <input
            type="text"
            minLength={4}
            maxLength={16}
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
            <div className="submit-user">
                <button type="submit"  disabled={isSubmitting} className="submit-user">Submit</button>
                <button className="login" onClick={window.location.replace('/')}>Login</button>
                {isSubmitting && <p className='loading'>Submitting...</p>}
                {message && <p className='result'>{message}</p>}
            </div>
            
            </form>
        </div>
    );
};

export default AddUser