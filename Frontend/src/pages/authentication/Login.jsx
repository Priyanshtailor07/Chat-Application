import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';

const Login = () => {
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const dispatch=useDispatch();
    const {isLoading,error}=useSelector((state)=>state.auth);

    const handleSubmit=(e)=>{
        e.preventDefault();
        dispatch(loginUser({username,password}));
    }

  return (
   
    
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
           {error && <p style={{color:'red'}}>{error}</p> }
           <div>
            <label >Username:</label>
            <input type="text" 
            value={username}
            onChange={(e)=>setUsername(e.target.value)} required />



           </div>
           <div>
            <label >Password:</label>
            <input type="password" 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)} required/>
           </div>

           <button type='submit' disabled={isLoading}>
            {isLoading?'Logging..':'Login'}
           </button>

        </form>
    
   
  )
}

export default Login