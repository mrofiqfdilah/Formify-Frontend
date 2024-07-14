import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Login from './Pages/Auth/Login';
import Home from './Pages/Home';
import './css/bootstrap.css';
import './css/style.css';
import Createform from './Pages/Forms/Createform';
import Detailform from './Pages/Forms/Detailform';
import Allresponse from './Pages/Response/Allresponse';
import Submitresponse from './Pages/Response/Submitresponse';


const router =createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/createform',
    element: <Createform />
  },
  {
    path: '/detailform/:slug',
    element: <Detailform />
  },
  {
    path: '/allresponse/:slug',
    element: <Allresponse />
  },
  {
    path: '/submitresponse/:slug',
    element: <Submitresponse />
  }
]);

const rooter = ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <RouterProvider router={router}/>
  </React.StrictMode>
);


