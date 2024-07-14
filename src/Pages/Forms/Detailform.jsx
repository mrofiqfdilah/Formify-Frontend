import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Detailform(){

    const navigate = useNavigate();

    const [name, setName] = useState([]);
    const { slug } = useParams();
    const [detail, setDetail] = useState([]);
  

    const fetchDetail = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/forms/${slug}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.data.form) {
                setDetail(response.data.form);
            }

        } catch (error) {
            console.error("Error fetching form detail:", error);
        }
    }

    const logout = async (event) => {
        event.preventDefault();
        const accessToken = localStorage.getItem('accessToken');
        await axios.post(`http://127.0.0.1:8000/api/v1/auth/logout`, {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        localStorage.removeItem('accessToken');
        navigate('/');
    }

    const deleteQuest = async (id) => {
        const accessToken = localStorage.getItem('accessToken');
        await axios.delete(`http://127.0.0.1:8000/api/v1/forms/${slug}/questions/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        setDetail(prevState => ({
            ...prevState,
            questions: prevState.questions.filter(question => question.id !== id)
        }));
    }

    const [errors,setErrors] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        choice_type: '',
        choices: [],
        is_required: false
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else if (name === 'choices') {
            const selectedChoices = value.split(',').map(choice => choice.trim());
            setFormData({ ...formData, [name]: selectedChoices });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.post(`http://localhost:8000/api/v1/forms/${slug}/questions`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            setDetail([...detail, response.data.form]);
    
            console.log('Add question response:', response.data);
            setFormData({
                name: '',
                choice_type: '',
                choices: [],
                is_required: false
            });
        } catch (error) {
            console.error('Error adding question:', error);
            // Handle error here
        }
    };

    const handleClick = () => {
        navigate(`/allresponse/${slug}`)
    }

    const handleRes = () => {
        navigate(`/submitresponse/${slug}`)
    }
  

    useEffect(() => {
        const userName = localStorage.getItem('name');
        setName(userName);
        fetchDetail();
    }, [slug]); // Added slug as dependency to useEffect

    return (
        <>
            <nav className="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
                <div className="container">
                    <a className="navbar-brand" href="/home">Formify</a>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" href="#">{name}</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" onClick={logout} className="btn bg-white text-primary ms-4">Logout</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <main>
                <div className="hero py-5 bg-light">
                    <div className="container text-center">
                        <h2 className="mb-2">
                            {detail.name}
                        </h2>
                        <div className="text-muted mb-4">
                            {detail.description}
                        </div>
                        <div>
                            <div>
                                <small>For user domains</small>
                            </div>
                            <small><span className="text-primary"> {detail.allowed_domains}</span></small>
                        </div>
                    </div>
                </div>

                <div className="py-5">
                    <div className="container">

                        <div className="row justify-content-center ">
                            <div className="col-lg-5 col-md-6">
                                <div className="input-group mb-5">
                                    <input type="text" className="form-control form-link" readOnly value={`http://localhost:8080/forms/${slug}`} />
                                    <a href="#"  onClick={() => handleRes(detail.slug)} className="btn btn-primary">Answers</a>
                                </div>

                                <ul className="nav nav-tabs mb-2 justify-content-center">
                                    <li className="nav-item">
                                        <a className="nav-link active" href="detail-form.html">Questions</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#" onClick={() => handleClick(detail.slug)}>Responses</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-lg-5 col-md-6">

                                {detail.questions?.map((quest) =>
                                    <div className="question-item card card-default my-4" key={quest.id}>
                                        <div className="card-body">
                                            <div className="form-group my-3">
                                                <input type="text" placeholder="Question" className="form-control" value={quest.name} disabled />
                                            </div>

                                            <div className="form-group my-3">
                                                <select name="choice_type" className="form-select" disabled>
                                                    <option>Choice Type</option>
                                                    <option value="short answer">Short Answer</option>
                                                    <option value="paragraph">Paragraph</option>
                                                    <option selected value={quest.choice_type}>{quest.choice_type}</option>
                                                    <option value="dropdown">Dropdown</option>
                                                    <option value="checkboxes">Checkboxes</option>
                                                </select>
                                            </div>

                                            {(quest.choice_type === 'multiple choice' || quest.choice_type === 'dropdown' || quest.choice_type === 'checkboxes') &&
                                                <div className="form-group my-3">
                                                    <textarea placeholder="Choices" className="form-control" name="choices" rows="4" disabled>{quest.choices}</textarea>
                                                    <div className="form-text">
                                                        Separate choices using comma ",".
                                                    </div>
                                                </div>
                                            }

                                            <div className="form-check form-switch" aria-colspan="my-3">
                                                <input className="form-check-input" type="checkbox" role="switch" id="required" checked disabled />
                                                <label className="form-check-label" htmlFor="required">Required</label>
                                            </div>
                                            <div className="mt-3">
                                                <button type="button" onClick={() => deleteQuest(quest.id)} className="btn btn-outline-danger">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="question-item card card-default my-4">
                                    <div className="card-body">
                                    {Object.values(errors).map((error) => (
                        <p id="error" className="text-danger">{error}</p>
                    ))}
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group my-3">
                                                <input type="text" placeholder="Question" className="form-control" name="name" value={formData.name} onChange={handleChange} />
                                            </div>

                                            <div className="form-group my-3">
                                                <select name="choice_type" value={formData.choice_type} className="form-select" onChange={handleChange}>
                                                    <option disabled value="">Choose Type</option>
                                                    <option value="short answer">Short Answer</option>
                                                    <option value="paragraph">Paragraph</option>
                                                    <option value="date">Date</option>
                                                    <option value="multiple choice">Multiple Choice</option>
                                                    <option value="dropdown">Dropdown</option>
                                                    <option value="checkboxes">Checkboxes</option>
                                                </select>
                                            </div>

                                            {(['multiple choice', 'dropdown', 'checkboxes'].includes(formData.choice_type)) && (
    <div className="form-group my-3">
        <textarea
            placeholder="Choices"
            className="form-control"
            name="choices"
            rows="4"
            value={formData.choices}
            onChange={handleChange}
        ></textarea>
        <div className="form-text">
            Separate choices using comma ",".
        </div>
    </div>
)}


                                            <div className="form-check form-switch" aria-colspan="my-3">
                                                <input className="form-check-input" type="checkbox" role="switch" id="required" checked={formData.is_required} onChange={handleChange} />
                                                <label className="form-check-label" htmlFor="required">Required</label>
                                            </div>
                                            <div className="mt-3">
                                                <button type="submit" className="btn btn-outline-primary">Save</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}

export default Detailform;
