import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Allresponse() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [detail, setDetail] = useState({});
    const [responses, setResponses] = useState([]);
    const [questions, setQuestions] = useState([]);

    const fetch = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            console.log("Fetching form details for slug:", slug);

            const response = await axios.get(`http://127.0.0.1:8000/api/v1/forms/${slug}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log("Form response data:", response.data);

            if (response.data.form) {
                setDetail(response.data.form);
            }
        } catch (error) {
            console.error("Error fetching form details:", error);
        }
    }

    const responseHandle = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            console.log("Fetching form responses for slug:", slug);

            const response = await axios.get(`http://127.0.0.1:8000/api/v1/forms/${slug}/responses`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log("Form responses data:", response.data);

            if (response.data.responses) {
                setResponses(response.data.responses);
                // Assuming all responses have the same questions, we take the first response's questions
                if (response.data.responses.length > 0) {
                    setQuestions(Object.keys(response.data.responses[0].answers));
                }
            }
        } catch (error) {
            console.error("Error fetching form responses:", error);
        }
    }

    useEffect(() => {
        fetch();
        responseHandle();
    }, [slug]);

    return (
        <>
            <nav className="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
                <div className="container">
                    <a className="navbar-brand" href="/manage-forms">Formify</a>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Administrator</a>
                        </li>
                        <li className="nav-item">
                            <button type="button" className="btn bg-white text-primary ms-4">Logout</button>
                        </li>
                    </ul>
                </div>
            </nav>

            <main>
                <div className="hero py-5 bg-light">
                    <div className="container text-center">
                        <h2 className="mb-2">{detail.name}</h2>
                        <div className="text-muted mb-4">{detail.description}</div>
                        <div>
                            <div><small>For user domains</small></div>
                            <small><span className="text-primary">{detail.allowed_domains}</span></small>
                        </div>
                    </div>
                </div>

                <div className="py-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-5 col-md-6">
                                <div className="input-group mb-5">
                                    <input type="text" className="form-control form-link" readOnly value={`http://localhost:8080/forms/${slug}`} />
                                    <a href="submit-form.html" className="btn btn-primary">Copy</a>
                                </div>
                                <ul className="nav nav-tabs mb-2 justify-content-center">
                                    <li className="nav-item">
                                        <a className="nav-link" href="detail-form.html">Questions</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link active" href="responses.html">Responses</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-lg-10">
                                <table className="table mt-3">
                                    <caption>Total Responses: {responses.length}</caption>
                                    <thead>
                                        <tr className="text-muted">
                                            {questions.map((question, index) => (
                                                <th key={index}>{question}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {responses.map((response, index) => (
                                            <tr key={index}>
                                                {questions.map((question, qIndex) => (
                                                    <td key={qIndex}>{response.answers[question]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Allresponse;
