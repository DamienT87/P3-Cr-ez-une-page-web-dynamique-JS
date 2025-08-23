import { generateWorks, createBlock, enableAdmin, openModale, closeModale, deleteProject } from './function.js'

//Création de la fonction main pour pouvoir attendre le résultat de ma fonction generate works.
async function main(){
    //Génération des projets et des boutons catégorie via l'API
    let allWorks = await generateWorks();

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
            const filtreWorks = bouton.id === 'Tous'
                                        ? allWorks
                                        : allWorks.filter(work => work.category?.name === bouton.id);
            createBlock(filtreWorks, divGallery);
        })
    })

    if(localStorage.getItem('token')){
        //les boutons de l'admin apparaisse grâce à cette fonction.
        enableAdmin();

        
        const btnModifier = document.getElementById("btn-modifier");
        
        btnModifier.addEventListener("click", () =>{
            //Ouverture de la modale
            openModale(allWorks);

            const divGallery = document.querySelector('.gallery-modale');
            divGallery.addEventListener('click', async (event) =>{
                //Gestion de la suppression de projets
                if(event.target.classList.contains('poubelle-suppression')){
                    const dataIdProjet = event.target.dataset.id;
                    const deleteOk = await deleteProject(dataIdProjet);

                    if(deleteOk){
                        //Suppression de la vignette image + poubelle (remonte a la balise figure et supprime)
                        event.target.closest('figure').remove();

                        const idNum = Number(dataIdProjet);
                        allWorks = allWorks.filter(work => work.id !== idNum);
                        const mainGallery = document.querySelector('.gallery');
                        mainGallery.innerHTML = '';
                        createBlock(allWorks, mainGallery);
                    }
                }
            })

            //Fermeture de la modale
            const divBackgroundModale = document.querySelector(".background-modale");
            const croixFermeture = document.getElementById("croix-fermeture");

            divBackgroundModale.addEventListener('click', (event) => {
                if(event.target === divBackgroundModale || event.target === croixFermeture){
                    closeModale();
                }
            })
        })
    }    
}

main();
