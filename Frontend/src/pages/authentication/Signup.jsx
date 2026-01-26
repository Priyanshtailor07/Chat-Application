import React, { useState } from 'react'
import  {useSelector, useDispatch } from 'react-redux'
import { registerUser } from '../../redux/slices/authSlice'
import {useNavigate} from 'react-router-dom'

const Signup = () => {

  const [form,setFormData]=useState({username:'',email:'',password:''});
  const {loading,error}=useSelector((state=>state.auth));
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/chat');
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input name="username" placeholder="Username" onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 mb-6 border rounded" required />

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {loading ? 'Registering...' : 'Sign Up'}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Or continue with</p>
          <a 
            href="http://localhost:4002/api/auth/google" 
            className="inline-block w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Google OAuth
          </a>
        </div>
      </form>
    </div>
  )
}

export default Signup