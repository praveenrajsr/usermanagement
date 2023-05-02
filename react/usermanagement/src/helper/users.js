export const fetchUsersList =  (token) =>{

    return fetch(`http://localhost:8000/api/users/`, {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(token)
        },
    }).then(resp => {
        return resp.json()
    }).catch(err=>console.log(err))

}

export const addUser = async (e, token, next=null) =>{
    e.preventDefault()
    let response = await fetch('http://localhost:8000/api/users/', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(token)
        },
        body:JSON.stringify({'name': e.target.name.value, 'phone': e.target.mobile.value, 'email': e.target.email.value,'password': e.target.password.value, 'is_premium': e.target.premium.checked, 'staff': e.target.staff.checked })
    })
    if(response.ok){
        next()
    }else{
        alert("something went wrong")
    }
}

export const deleteUser = async (id, token, next=null) =>{
    let response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(token)
        },
    })
    if(response.ok ){
        if(next){
            next()
        }
    }else{
        alert("something went wrong")
    }
}

export const editUser = async (id, token,data, next=null) =>{
    let response = await fetch(`http://localhost:8000/api/users/${id}/`, {
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(token)
        },
        body: JSON.stringify(data)
    })

    if(response.ok){
        if(next){
            next()
        }
    }else{
        alert("something went wrong")
    }
    return data
}