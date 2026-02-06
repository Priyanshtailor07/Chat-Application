
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true
});
//Async thunk for register

export const registerUser=createAsyncThunk(
    "auth/registerUser",
        async(userData,{rejectWithValue})=>{
            try{
                const response=await API.post("/api/auth/register",userData);
                return response.data;
            }
            catch(error){
                return rejectWithValue(error.response?.data?.message || "Registration failed");
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
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }

);



const authSlice= createSlice({
    name:'auth',
    initialState:{
                user: JSON.parse(localStorage.getItem("user")) || null,
                accessToken: localStorage.getItem("accessToken") || null,
                refreshToken: localStorage.getItem("refreshToken") || null,
                loading: false,
    },
        reducers:{
            logout:(state)=>{
                state.user=null;
                state.isAuthenticated=false;
                state.error=null;
                state.accessToken=null;
                state.refreshToken=null;
                

                // removing local storage here
                localStorage.clear();
            },
        },
        extraReducers:(builder)=>{  


            builder
            .addCase(registerUser.pending, (state) => {
                state.loading= true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading= false;
                state.user = action.payload.user;
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading= false;
                state.error = action.payload;
            })            
            
           .addCase(loginUser.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
                    .addCase(loginUser.fulfilled, (state, action) => {
                    state.loading = false;
                    state.accessToken = action.payload.accessToken;
                    state.refreshToken = action.payload.refreshToken;
                    state.user = action.payload.user;
                    localStorage.setItem("accessToken", action.payload.accessToken);
                    localStorage.setItem("refreshToken", action.payload.refreshToken);
                    localStorage.setItem("user", JSON.stringify(action.payload.user));
                    })
            .addCase(loginUser.rejected,(state,action)=>{
                state.loading =false;
                state.error =action.payload|| 'Login failed';
                state.user=null;
                state.isAuthenticated=false;
            });
        },

})
export const {logout}= authSlice.actions;

export default authSlice.reducer;