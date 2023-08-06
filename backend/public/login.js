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
    
    // try {
    //     const response = axios.post("http://localhost:3000/user/login", inputData)
    //     if(response.request.status == 200) {
    //         alert(response.data.message);
    //         window.location.href = "./signup.html";
    //     }
    //     else{
    //         throw new Error ("Failed To Login, Try Again!")
    //     }
    // }
    // catch(err) {
    //     console.log(err);
    //     console.log(err.response.data.message);
    //     document.body.innerHTML+=`<div style="color:red;">${err.response.data.message}<div>`;
    // }

    axios.post("http://localhost:3000/user/login", inputData)
    .then((response) => {
        console.log(response);
        if(response.request.status == 201) {
            alert(response.data.message);
            localStorage.setItem('token',response.data.token);
            console.log(response.data.user);
            localStorage.setItem('username', response.data.user.name);
            window.location.href = "./mainpage.html";
        }
        else{
            throw new Error ("Failed To Login, Try Again!")
        }
    })
    .catch((err) => {
        console.log(err);
        console.log(err.response.data.message);
        document.body.innerHTML+=`<div style="color:red;">${err.response.data.message}<div>`; 
    })
    emailInput.value='';
    passwordInput.value = ''; 
}