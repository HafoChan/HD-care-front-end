export const setItem = (accessToken,refreshToken,userImg) =>{
    localStorage.setItem("accessToken",accessToken)
    localStorage.setItem("refreshToken",refreshToken)
    localStorage.setItem("userImg",userImg)
}

export const getAccessToken = () =>{
    return localStorage.getItem("accessToken")
}

export const getRefreshToken = () =>{
    return localStorage.getItem("refreshToken")
}
export const getImg = () =>{
    return localStorage.getItem("userImg")
}

export const remove = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userImg")
}

export const setImg = (userImg) => {
    localStorage.setItem("userImg",userImg)
}


