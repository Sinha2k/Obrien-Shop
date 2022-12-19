import React,{createContext,useState,useEffect} from "react";
import UserApi from "./components/Api/UserApi";
export const GlobalState = createContext()

export const DataProvider = ({children})=>{
    // const [token,setToken] = useState(false)
    // useEffect(()=>{
    //     const firstLogin = localStorage.getItem('firstLogin')
    //     if(firstLogin){
    //         const refreshToken = async ()=>{
    //             const res = await axios.get('/user/refresh_token')
    //             setToken(res.data.accesstoken)
    //             setTimeout(()=>{
    //                 refreshToken()
    //             },10 * 60 * 1000)
    //         }
    //         refreshToken()
    //     }
    // },[])
    const state = {
        userAPI : UserApi()
    }
    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}