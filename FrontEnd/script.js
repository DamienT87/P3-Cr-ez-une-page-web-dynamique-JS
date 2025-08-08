import { generateWorks, createBlock, enableAdmin, openModale, closeModale } from './function.js'

//Création de la fonction main pour pouvoir attendre le résultat de ma fonction generate works.
async function main(){
    //Génération des projets et des boutons catégorie via l'API
    const allWorks = await generateWorks();

    //Filtre sur les boutons.
    const boutons = document.querySelectorAll('.btn-categories');
    boutons.forEach(bouton =>{
        bouton.addEventListener("click", () => {
            //Je récupére l'ID du bouton dans une variable
            const boutonID = bouton.id;

            //Je vide ma divGallery avec innerHTML à vide
            const divGallery = document.querySelector('.gallery');
            divGallery.innerHTML ="";
            
            //Filtre sur l'id des boutons
            if(boutonID !== 'Tous'){
                const filtreWorks = allWorks.filter(work => work.category.name === bouton.id)
                createBlock(filtreWorks, divGallery);
            }else{
                const filtreWorks = allWorks.filter(work => work.category.name)
                createBlock(filtreWorks, divGallery);
            }
        })
    })

    if(localStorage.getItem('token')){
        //les boutons de l'admin apparaisse grâce à cette fonction.
        enableAdmin();

        
        const btnModifier = document.getElementById("btn-modifier");
        
        btnModifier.addEventListener("click", () =>{
            //Ouverture de la modale
            openModale(allWorks);

            //Fermeture de la modale
            const divBackgroundModale = document.querySelector(".background-modale");
            const croixFermeture = document.getElementById("croix-fermeture");
            closeModale(divBackgroundModale);
            closeModale(croixFermeture);
        })
    }    
}

main();
