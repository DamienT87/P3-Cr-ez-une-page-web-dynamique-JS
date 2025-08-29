import { generateWorks, createBalise, createBlock, enableAdmin, openModale, closeModale, deleteProject, checkFormulaire, resetFormAjoutProjets } from './function.js'

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
                    //Reset du formulaire
                    resetFormAjoutProjets();

                    //Remise à l'état initianle sur la gallery lors de la prochaine ouverture
                    const divAjoutProjets = document.querySelector('.ajout-projets');
                    divAjoutProjets.classList.add('invisible');

                    const divGalleryModale = document.querySelector('.gallery-modale');
                    divGalleryModale.classList.remove('invisible');

                    const flecheRetour = document.getElementById('fleche-retour');
                    flecheRetour.classList.add('cacher');
                })

                const inputImage = document.getElementById('form-ajout-image');
                const divPreview = document.querySelector('.container');
                const divAjoutImager = document.querySelector('.ajout-images');

                inputImage.addEventListener('change', () =>{
                    //Je récupére l'image choisi grâce à mon input
                    const imgSelect = inputImage.files[0];
                    const reader = new FileReader();
                    if(imgSelect){
                        

                        //Je lance la fonction une fois que mon reader à fini de charger.
                        reader.onload = function(event){
                            //Création d'une balise img 
                            const previewImage = createBalise('img', {src: event.target.result, alt: imgSelect.name, class: 'img-preview'})

                            //Je vide ma div ou ma preview va se placer
                            divAjoutImager.classList.add('invisible');
                            divPreview.appendChild(previewImage);
                        }
                    }

                    //Je lance la lecture de l'image via l'URL créée par readAsDataUrl
                    reader.readAsDataURL(imgSelect);

                })











                

                //Ecoute des différents inputs pour metttre le bouton en disabled ou non
                const inputTitre = document.getElementById('form-titre');
                const selectCategorie = document.getElementById('form-categorie');

                inputImage.addEventListener('change', checkFormulaire);
                inputTitre.addEventListener('input', checkFormulaire);
                selectCategorie.addEventListener('change', checkFormulaire);

                
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
