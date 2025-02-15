/* eslint-disable no-unused-vars */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Login from './pages/Login.jsx'
import GenerateQRCode from './components/GenerateQRCode.jsx';
import StudentQRReader from './components/StudentQRReader.jsx';
import PrivateRoute from './components/PrivateRouter.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: 'faculty/',
            children: [
              {
                path: 'generate-qr-code/',
                element: <GenerateQRCode />
              }
            ]
          },
          {
            path: 'student/',
            children: [
              {
                path: 'qr-reader/',
                element: <StudentQRReader />
              }
            ]
          }
        ]
      },
      
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)