import { authentificationUser } from './function.js'

//Sélection du form
const formLogin = document.querySelector('.form-login');

function login(){

    //Ecoute lors du submit du formulaire
    formLogin.addEventListener("submit", async (event) => {
        event.preventDefault();

        //Je recupére la valeur de mon input email et de mon input password
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        //Utilisations de la fonction d'authentification
        const result = await authentificationUser(email, password);

        if(result){
            //Je dépose le token d'authentification dans le localStorage
            localStorage.setItem('token', result.token)
            location.href = 'index.html'

            console.log(result);
        }
    })
}

login();
