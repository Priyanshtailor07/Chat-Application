
import { createSlice,createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from 'axios';
import { startTransition } from "react";

//Async thunk for register

export const registerUser=createAsyncThunk(
    "auth/registerUser",
        async(userData,{rejctedWithValue})=>{
            try{
                const response=await axios.post("/api/auth/register",userData);
                return response.data;
            }
            catch(error){
                return rejctedWithValue(error.response.data.message|| "Registration failed");
            }
        },
);



//Asyn Thunk for login
export const loginUser= createAsyncThunk(

    'auth/loginUser',
    async ({ username,password},{rejectWithValue})=>{
        try{
            // API response
            const response =await axios.post('/api/auth/login',{username,password});
            return response.data;
        }
        catch(error){
            return rejctedWithValue(error.response.data.message|| "Login failed");
        }
    }

);



const authSlice= createSlice({
    name:'auth',
    initialState:{
        user:JSON.parse(localStorage.getItem("user"))|| null,
        token:localStorage.getItem("token")|| null,
        isAuthenticated:false,
        isLoading:false,
        error:null,
    },
        reducers:{
            logout:(state)=>{
                state.user=null;
                state.isAuthenticated=false;
                state.error=null;
                state.token=null;
                

                // removing local storage here
                localStorage.clear();
            },
        },
        extraReducers:(builder)=>{  


            builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading= true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading= false;
                state.user = action.payload;
                state.token = action.payload.token;
                localStorage.setItem("user", JSON.stringify(action.payload));
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading= false;
                state.error = action.payload;
            })            
            
           .addCase(loginUser.pending,(state)=>{
                state.isLoading=true;
                state.error=null
            })
            .addCase(loginUser.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.user= action.payload;
                state.token=action.payload.token;
                            //here we have to store the token
                localStorage.setItem("user",JSON.stringify(action.payload));
                localStorage.setItem("token",action.payload.token);
                state.isAuthenticated=true;
    
            })
            .addCase(loginUser.rejected,(state,action)=>{
                state.isLoading =false;
                state.error =action.payload|| 'Login failed';
                state.user=null;
                state.isAuthenticated=false;
            });
        },

})
export const {logout}= authSlice.actions;

export default authSlice.reducer;