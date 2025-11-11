import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/QuizPage.css';

const QuizPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState({});
  const [results, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(600); // 10 minutes
  const timerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [submitting, setSubmitting] = useState(false); // for disabling/hiding UI
  const paperId = sessionStorage.getItem('paperId') || '';
  const valuesOnly = Object.values(answer);
  sessionStorage.setItem('answer', JSON.stringify(valuesOnly));

  useEffect(() => {
    axios
      .get('/api/quiz/' + paperId)
      .then(res => {
        setQuestions(res.data.Questions);
        setLoading(false);
        const quizStarted = sessionStorage.getItem('quizStarted');
        if (!quizStarted || quizStarted !== 'true') {
          navigate('/', { replace: true });
          sessionStorage.clear()
        }
      })
      .catch(console.error);
  }, [navigate, paperId]);

  useEffect(() => {
    if (!questions.length) return;

    setTimer(600);
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [questions, paperId]);

  const submitQuiz = async () => {
  try {
    setSubmitting(true);

    let user_name = sessionStorage.getItem('user');
    let user_id = sessionStorage.getItem('id');
    if (user_id && !user_id.startsWith('TCLP/TCL/P/')) {
      user_id = 'TCLP/TCL/P/' + user_id;
    }

    if (!user_name) {
      user_name = prompt('Enter Your Name');
      if (user_name) sessionStorage.setItem('user', user_name);
    }

    // Fill "NA" for unanswered questions
    const processedAnswers = {};
    questions.forEach(q => {
      const userAnswer = answer[String(q.id)];
      if (typeof userAnswer === 'undefined') {
        processedAnswers[q.id] = 'NA';
      } else {
        processedAnswers[q.id] = userAnswer;
      }
    });

    // Calculate score
    let calculatedScore = 0;
    questions.forEach(q => {
      if (Number(processedAnswers[q.id]) === Number(q.correct_option)) calculatedScore++;
    });

    await axios.post('/api/user/score', {
      answers: processedAnswers,
      user_id,
      score: calculatedScore,
    });

    await axios.post(
      '/api/excelInsert/manual',
      { valuesOnly: Object.values(processedAnswers), paperId, user_id},
      { headers: { 'Content-Type': 'application/json' } }
    );

    setScore(calculatedScore);
    setResult(`Quiz Completed.`);

    setTimeout(() => {navigate('/', { replace: true }); sessionStorage.clear()}, 2000);
    localStorage.setItem('completed', 'true');
    sessionStorage.setItem('quizStarted', 'false');
  } catch (err) {
    setResult(err?.response?.data?.message || 'Something went wrong');
    setTimeout(() => {
        setResult('');
      }, 3000);
    setSubmitting(false);
  }
};


  const handleOptionChange = (questionId, optionIndex) => {
    setAnswer(prev => ({
      ...prev,
      [String(questionId)]: optionIndex,
    }));
  };

  const formattedTime = `${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60)
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz</h1>
      {!submitting && <p className="quiz-timer">⏳ Time left: {formattedTime}</p>}

      {/* Show only quiz UI if not submitting */}
      {!submitting && questions.length > 0 && (
        <div className="question-block">
          <p className="question-text">
            {currentQuestion + 1}. {questions[currentQuestion].Question}
          </p>

          <div className="options-wrapper">
            {questions[currentQuestion].options.map((opt, i) => (
              <label key={i} className="option-label">
                <input
                  type="radio"
                  name={`q-${questions[currentQuestion].id}`}
                  checked={answer[String(questions[currentQuestion].id)] === i}
                  onChange={() => handleOptionChange(questions[currentQuestion].id, i)}
                  className="option-input"
                  disabled={submitting}
                />
                {opt}
              </label>
            ))}
          </div>

          <div className="navigation-buttons">
            <button
              className="nav-btn"
              disabled={currentQuestion === 0 || clicked || submitting}
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                className="submit-btn"
                onClick={() => {
                  setClicked(true);
                  sessionStorage.setItem('quizStarted', 'false');
                  sessionStorage.setItem('answer', JSON.stringify(answer));
                  submitQuiz();
                }}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            ) : (
              <button
                className="nav-btn"
                onClick={() => {
                  setCurrentQuestion(prev => prev + 1);
                  setClicked(true);
                }}
                disabled={submitting}
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {loading && <p className="loading-message">Loading questions...</p>}

      {!loading && questions.length === 0 && (
        <p className="no-questions-message">No questions available.</p>
      )}
      <button className="goback" onClick={() => {navigate('/', {replace:true}); sessionStorage.clear()}}>Go Back</button>
      {results && (
        <h2 className="result-message" style={{ marginTop: "2rem" }}>
          {results}
        </h2>
      )}
    </div>
  );
};

export default QuizPage;
