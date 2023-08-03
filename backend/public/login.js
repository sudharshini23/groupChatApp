const { response } = require("express");

const myForm = document.getElementById('my-form');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

myForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
    event.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    const inputData = {
        email,
        password,
    };
    console.log(inputData);
    
    try {
        const response = axios.post("http://localhost:3000/user/login", inputData)
        if(response.request.status == 200) {
            alert(response.data.message);
            window.location.href = "./signup.html";
        }
        else{
            throw new Error ("Failed To Login, Try Again!")
        }
    }
    catch(err) {
        console.log(err);
        console.log(err.response.data.message);
        document.body.innerHTML+=`<div style="color:red;">${err.response.data.message}<div>`;
    }
    // const response = axios.post("http://localhost:3000/user/login", inputData)
    // .then((response) => {
    //     if(response.request.status == 201) {
    //         alert(response.data.message);
    //         window.location.href = "./signup.html";
    //     }
    // })
    emailInput.value='';
    passwordInput.value = ''; 
}