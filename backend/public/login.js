const myForm = document.getElementById('my-form');
const forgotBtn = document.getElementById('fgt-btn');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

myForm.addEventListener('submit', onSubmit);

async function onSubmit(event) {
    event.preventDefault();
    try {
        const email = emailInput.value;
        const password = passwordInput.value;
        const inputData = {
            email,
            password,
        };
        console.log(inputData);
        let response = await axios.post("http://localhost:3000/user/login", inputData)
        console.log(response);
        if(response.status == 200) {
            emailInput.value='';
            passwordInput.value = ''; 
            console.log(response.data.token)
            alert(response.data.message);
            localStorage.setItem('token',response.data.token);
            // console.log(response.data.user);
            // localStorage.setItem('username', response.data.user.name);
            window.location.href = 'mainpage.html'
        }
    }
    catch(error) {
        console.log(error);
        if(error.response.status === 401) {
            document.getElementById('error-text').innerHTML+=`<div style="color:red;">${error.response.data.message}<div>`;
        }
        if(error.response.status === 404) {
            document.getElementById('error-text').innerHTML+=`<div style="color:red;">${error.response.data.message}<div>`;
        }
    }

    forgotBtn.onclick = async (e) => {
        window.location.href = 'forgot.html';
    }
    





    // JUST TRAIL
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

}
