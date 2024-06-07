import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../CSS/problem.css'


const ProblemPage = () => {
    const [user, setUser] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/loggedIn')
    .then(response => {
      setUser(response.data)
    })
    .catch(error => {
      console.error('Error getting user:', error)
    });
  }, [])
    const { id } = useParams();

    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [input, setInput] = useState(''); 

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/problems/${id}`, {
                    withCredentials: true,
                });
                const { title, description, difficulty } = response.data;
                setTitle(title);
                setDescription(description);
                setDifficulty(difficulty);
            } catch (error) {
                console.error("Error fetching problem:", error);
            }
        };
        fetchData();
    }, [id]); 


    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleRun = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:5000/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language, code, input }), 
          });
          const data = await response.json();
          setOutput(data.output);
          setError('');
        } catch (error) {
          setError(error.message);
        }
      };

      const handleCodeSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const response = await axios.post(`http://localhost:5000/submit/${id}`, 
                {
                    language, code
                },
                {withCredentials: true}
            );
            const data = await response.json();
            setOutput(data.output);
            setError('');
        } catch (error) {
            setError(error.message);
        }
    };
    
    return (
        <div className="problem-page">
            <div className="problem-details">
                <h2>{title}</h2>
                <p><b>Description: </b><br/>{description}</p>
                <p><b>Difficulty: </b><br/>{difficulty}</p>
            </div>
            <div className="code-editor">
                <form onSubmit={handleRun}>
                    <label>
                        Language:
                        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <option value="cpp">C++</option>
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                        </select>
                    </label>
                    <br />
                    <textarea value={code} onChange={handleCodeChange} />
                    <br />
                    
                    <label>
                        Input:
                        <input type="text" value={input} onChange={handleInputChange} />
                    </label>
                    <br />
                    <button type="submit">Run</button> 
                </form>
                <div>
                    {output && <pre>{output}</pre>}
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                </div>
                <button onClick={handleCodeSubmit}>Submit Code</button> 
            </div>
        </div>
    );
}

export default ProblemPage;



