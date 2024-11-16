import { get, set } from "@/hooks/use-local-storage";


export const setToken = (accessToken,refreshToken) =>{
    set("accessToken",accessToken)
    set("refreshToken",refreshToken)
}


export const getToken = () =>{
    get("accessToken")
}
