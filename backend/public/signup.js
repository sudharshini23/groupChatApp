const myForm = document.getElementById('my-form');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const numberInput  = document.getElementById('number');
const passwordInput = document.getElementById('password');

myForm.addEventListener('submit', onSubmit);

async function onSubmit(event) {
    event.preventDefault();
    try {
        const name = nameInput.value;
        const email = emailInput.value;
        const number = numberInput.value;
        const password = passwordInput.value;

        const inputData = {
            name,
            email,
            number,
            password,
        };

        console.log(inputData);

        let res = await axios.post("http://localhost:3000/user/signup", inputData)
        console.log(res);
        if(res.status == 200) {
            alert(res.data.message);
            window.location.href="./login.html";
        }
    }
    catch(err) {
        console.log(err);
        document.body.innerHTML+=`<div style="color:red;">${err.response.data.message}<div>`; 
    }
    
    nameInput.value = '';
    emailInput.value='';
    numberInput.value = '';  
    passwordInput.value = ''; 
}