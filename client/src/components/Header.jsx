import React from 'react'
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <button onClick={handleSubmit}>Logout</button>
  )
}

export default Header