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

            const btnAddPhoto = document.getElementById('btn-add-photo');
            btnAddPhoto.addEventListener("click", () =>{

                //J'affiche ma div d'ajout projet et je cache ma div galllery au clic
                const divAjoutProjets = document.querySelector('.ajout-projets');
                divAjoutProjets.classList.remove('invisible');
                divGallery.classList.add('invisible');

                //J'affiche ma fleche retour et pause un addEventListener pour retourner 
                const flecheRetour = document.getElementById('fleche-retour');
                flecheRetour.classList.remove('cacher');

                flecheRetour.addEventListener("click", () =>{
                    //Remise à l'état initianle sur la gallery lors de la prochaine ouverture
                    const divAjoutProjets = document.querySelector('.ajout-projets');
                    divAjoutProjets.classList.add('invisible');

                    const divGalleryModale = document.querySelector('.gallery-modale');
                    divGalleryModale.classList.remove('invisible');

                    const flecheRetour = document.getElementById('fleche-retour');
                    flecheRetour.classList.add('cacher');
                })

                
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
