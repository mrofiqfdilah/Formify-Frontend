import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Createform(){

    const navigate = useNavigate();

    const [name,setName] = useState([]);

    const [errors,setErrors] = useState({});

    const [formData,setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    allowed_domains: '',
    limit_one_response: false
    }); 

    const handleChange = (event) => {
        const {name,value,type,checked} = event.target;
        setFormData((prevdata) => ({
        ...prevdata,
        [name]: type === 'checkbox' ? checked : value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const accessToken = localStorage.getItem('accessToken');
            const dataToSend = {
                ...formData,
                allowed_domains: formData.allowed_domains.split(',')
            };
            const response = await axios.post(`http://127.0.0.1:8000/api/v1/forms`, dataToSend, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
            });

            navigate('/home');
        }catch(error){
            if(error.response.data.errors){
                setErrors(error.response.data.errors)
            }else{
                setErrors({'general': 'Create form failed'})
            }
        }
    }

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

    useEffect(() => {
    const nameuser = localStorage.getItem('name');
    setName(nameuser);
    });

    return (
        <>
         <nav class="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
      <div class="container">
        <a class="navbar-brand" href="/home">Formify</a>
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
            <h2>Create Form</h2>
         </div>
      </div>

      <div class="py-5">
         <div class="container">
            <div class="row">
               <div class="col-md-6 col-lg-4">
               {Object.values(errors).map((error) => (
                        <p id="error" className="text-danger">{error}</p>
                    ))}
                  <form onSubmit={handleSubmit}>
                  
                     <div class="form-group mb-3">
                        <label for="name" class="mb-1 text-muted">Form Name</label>
                        <input type="text" id="name" onChange={handleChange} value={formData.name} name="name" class="form-control" autofocus />
                     </div>

                    
                     <div class="form-group my-3">
                        <label for="slug" class="mb-1 text-muted">Form Slug</label>
                        <input type="text" id="slug" onChange={handleChange} value={formData.slug} name="slug" class="form-control" />
                     </div>

                     <div class="form-group my-3">
                        <label for="description" class="mb-1 text-muted">Description</label>
                        <textarea id="description" onChange={handleChange} value={formData.description} name="description" rows="4" class="form-control"></textarea>
                     </div>
                     
                  
                     <div class="form-group my-3">
                        <label for="allowed-domains" class="mb-1 text-muted">Allowed Domains</label>
                        <input type="text" id="allowed-domains" onChange={handleChange} value={formData.allowed_domains} name="allowed_domains" class="form-control" />
                        <div class="form-text">Separate domains using comma ",". Ignore for public access.</div>
                     </div>
                     
                    
                     <div class="form-check form-switch" aria-colspan="my-3">
                        <input type="checkbox" id="limit_one_response" name="limit_one_response" onChange={handleChange}  checked={formData.limit_one_response} class="form-check-input" role="switch"/>
                        <label class="form-check-label" for="limit_one_response">Limit to 1 response</label>
                      </div>

                     <div class="mt-4">
                        <button type="submit" class="btn btn-primary">Save</button>
                     </div>
                  </form>

               </div>
            </div>
         </div>
      </div>
    </main>
   
        </>
    );
}

export default Createform;