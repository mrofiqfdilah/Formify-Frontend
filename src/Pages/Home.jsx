import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Detailform from "./Forms/Detailform";

function Home()
{
    const navigate = useNavigate();

    const [forms,setForms] = useState([]);

    const [name,setName] = useState([]);

    const fetchForms = async () => {
        try{
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/forms`, {
            headers: {
                'Authorization' : `Bearer ${accessToken}`
            }
            });

           if(response.data['forms']){
            setForms(response.data['forms']);
           }

        }catch(error){

        }
    }

    useEffect(() => {
        const namelooged = localStorage.getItem('name');
        setName(namelooged);


        fetchForms(); 
    });

    const logout = async (event) => {
        event.preventDefault();
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.post(`http://127.0.0.1:8000/api/v1/auth/logout`,{}, {
            headers: {
                'Authorization' : `Bearer ${accessToken}`
            }
        });

        localStorage.removeItem('accessToken');

        navigate('/');

    }

    const handleDetail = (slug) => {
        navigate(`/detailform/${slug}`);
    }

    return(
        <>
       <nav class="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
      <div class="container">
        <a class="navbar-brand" href="manage-forms.html">Formify</a>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
         <li class="nav-item">
           <a class="nav-link active" href="#">{name}</a>
         </li> 
         <li class="nav-item">
            <a href="#" onClick={logout} class="btn bg-white text-primary ms-4">Logout</a>
         </li>
       </ul> 
      </div>
    </nav>

    <main>

      <div class="hero py-5 bg-light">
         <div class="container">
            <a href="/createform" class="btn btn-primary">
               Create Form
            </a>
         </div>
      </div>

      <div class="list-form py-5">
         <div class="container">
            <h6 class="mb-3">List Form</h6>

            {forms.map((form) => 
            <a href="#" onClick={() => handleDetail(form.slug)} class="card card-default mb-3">
               <div class="card-body">
                  <h5 class="mb-1">{form.name}</h5>
                  <small class="text-muted">@{form.slug} {form.limit_one_response ? (<p>limit for 1 response</p>) : (<p>no limit response</p>)}</small>
               </div>
            </a>
)}
         </div>
      </div>
      
    </main>
   
        </>
    );
}

export default Home;