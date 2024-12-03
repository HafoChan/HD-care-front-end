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
    localStorage.clear()
}

export const setImg = (userImg) => {
    localStorage.setItem("userImg",userImg)
}

export const setRole = (role) => {
    localStorage.setItem("role",role)
}

export const getRole = () => {
    return localStorage.getItem("role")
}


