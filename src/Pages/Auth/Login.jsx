import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(){

    const navigate = useNavigate();

    const [errors,setErrors] = useState({});

    const [formData,setFormData] = useState({
    email: '',
    password: ''
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevdata) => ({
        ...prevdata,
        [name]: value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{

            const response = await axios.post(`http://127.0.0.1:8000/api/v1/auth/login`, formData,);

            const { user } = response.data;

            const { accessToken } = user;

            const { name } = user;

            localStorage.setItem('accessToken', accessToken);

            localStorage.setItem('name', name);

            console.log(response.data);

            console.log(name);

            console.log(accessToken);

            navigate('/home');

        }catch(error){
            if(error.response.data.errors){
                setErrors(error.response.data.errors)
            }else{
                setErrors({'general': 'Email or password incorrect'})
            }
        }
    }


    return(
        <>
    <main>
      <section class="login">
         <div class="container">
            <div class="row justify-content-center">
               <div class="col-lg-5 col-md-6">
                  <h1 class="text-center mb-4">Formify</h1>
                  <div class="card card-default">
                     <div class="card-body">
                        <h3 class="mb-3">Login</h3>
                        {Object.values(errors).map((error) => (
                        <p id="error" className="text-danger">{error}</p>
                    ))}
                        <form onSubmit={handleSubmit}> 
                         
                           <div class="form-group my-3">
                              <label for="email" class="mb-1 text-muted">Email Address</label>
                              <input type="email" onChange={handleChange} id="email" name="email" value={formData.email} class="form-control" autofocus />
                           </div> 

                        
                           <div class="form-group my-3">
                              <label for="password" class="mb-1 text-muted">Password</label>
                              <input type="password" id="password"  onChange={handleChange} name="password" value={formData.password} class="form-control" />
                           </div>
                           
                           <div class="mt-4">
                              <button type="submit" class="btn btn-primary">Login</button>
                           </div>
                        </form>

                     </div>
                  </div> 
               </div>
            </div>
         </div>
      </section>
   </main>
        </>
    );
}

export default Login;