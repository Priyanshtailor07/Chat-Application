
import { createSlice,createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from 'axios';
import { startTransition } from "react";
const API=axios.create({baseURL:"http://localhost:4000"})
//Async thunk for register

export const registerUser=createAsyncThunk(
    "auth/registerUser",
        async(userData,{rejctedWithValue})=>{
            try{
                const response=await API.post("/api/auth/register",userData);
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
    async (credentials,{rejectWithValue})=>{
        try{
            // API response
              console.log("Data being sent to backend:", credentials);
        
            const response =await API.post('/api/auth/login',credentials);
            console.log(response.data);
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
           user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
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
                    .addCase(loginUser.fulfilled, (state, action) => {
                    state.loading = false;
                    state.token = action.payload.token;
                    state.user = action.payload.user;
                    localStorage.setItem("token", action.payload.token); //
                    localStorage.setItem("user", JSON.stringify(action.payload.user)); //
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