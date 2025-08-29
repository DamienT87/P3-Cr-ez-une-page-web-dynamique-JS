//Fonction de récupération des données via l'API
export async function getData(url){
    try{
        const response = await fetch(url);
        const data = await response.json();
        return data
    }catch(error){
        console.error("Erreur lors du fetch :", error);
    }
}

//Fonction pour log un user
export async function authentificationUser(email, password){
    const baliseErreur = document.getElementById('error-message');

    try{
        //fecth en mode post pour envoyer les identifiants mot de pass
        const demande = await fetch("http://localhost:5678/api/users/login",{
                        method: 'POST',
                        headers :{
                        "Content-type": "application/json; charset=UTF-8"  
                        },
                        body :JSON.stringify({
                            "email" : email,
                            "password": password,
                        })
        })
        
        if(demande.status === 200){
            const data = await demande.json();
            baliseErreur.innerText = '';
            return data;
        }else{
            if(demande.status === 401){
                throw new Error("Utilisateur non autorisé");
            }else{
                throw new Error("Utilisateur introuvable");
            }
        } 
    }catch(error){
        baliseErreur.innerText = error.message;
    }

}


//Fonction de création de balise
export function createBalise(balise, options = {}){
    const element = document.createElement(balise);
    // On parcourt les clés de l'objet "options"
    for (const [key, value] of Object.entries(options)) {
        if (key === "text") {
            element.innerText = value;
        } else if (key === "class") {
            const classes = Array.isArray(value) ? value : String(value).split(/\s+/).filter(Boolean);
            classes.forEach(c => element.classList.add(c));
        } else {
            element.setAttribute(key, value);
        }
    }

        return element;
}

export function createBlock(nomTableauSource, section){
    
    for(let i = 0; i < nomTableauSource.length; i++ ){
        //Construction de la balise <figure>
        const figure = createBalise('figure');

        //Construction de la balise <img>
        //Attribution des valeur aux attributs src et alt de la balise <img>
        const img = createBalise('img', {src: nomTableauSource[i].imageUrl, alt: nomTableauSource[i].title})

        //Construction de la balise <figcaption> et attribution d'une valeur 
        const figcaption = createBalise('figcaption', {text: nomTableauSource[i].title});


        //Imbrication des balises et de leur contenu
        figure.appendChild(img);
        figure.appendChild(figcaption);
        section.appendChild(figure);
    }
}


export async function generateWorks(){
    const getWorks = await getData("http://localhost:5678/api/works");


   const divGallery = document.querySelector('.gallery');
   createBlock(getWorks, divGallery);

    //Je récupére les categories de tout les projets dans un tableau
    const categoriesWork = getWorks.map(work => work.category.name);

    //Ici je converti mon Set(categoriesWork) qui me construit un objet avec les valeurs uniques du tableau categorieWork
    //Puisque c'est un objet je le converti en tableau pour le parcourir plus facilement
    const categories = [...new Set(categoriesWork)];


    //Section dans laquelle je vais rajouter la div où il y aura mes boutons
    const sectionPortfolio = document.getElementById('portfolio');

    //Creation de ma div qui va contenir mes boutons, avec la classe list-categorie
    const divCategorie = document.createElement('div')
    divCategorie.classList.add('list-categorie');

    sectionPortfolio.insertBefore(divCategorie, divGallery);

    //Création du bouton "Tous"
    const btnTous = createBalise('button', {id: 'Tous', text: 'Tous'});
    btnTous.classList.add('btn-categories');
    divCategorie.appendChild(btnTous);


    //Boucle foreach pour créé des boutons pour chaque catégorie
    categories.forEach(category => {
        
        //Création du bouton et ajout du text et d'un id pour chaque bouton
        const btnCategories = createBalise('button', {id: category, text: category})
        btnCategories.classList.add('btn-categories');

        //Intégration de chaque bouton dans la div créée auparavant
        divCategorie.appendChild(btnCategories);

    });

    return getWorks;
}

export function enableAdmin(){
    //Je répère l'id de mon lien login dans le nav et le transforme en logout.
    const loginLink = document.getElementById('login-link');
    loginLink.innerText="logout";
    loginLink.href="#";

    //J'écoute le click sur mon lien logout pour enlever le token de mon localStorage et de reload ma page
    loginLink.addEventListener("click", () =>{
        localStorage.removeItem("token");
        location.reload();
    })

    //Je configure l'appartion du "modifier" à côté du titre Mes Projets
    //Je cible ma div "titre-projets" pour ajouter mon span à l'intérieur
    const divTitreProjets = document.querySelector('.titre-projets');
    const spanModifier = createBalise('span', {id: 'btn-modifier', class:'modifier'});
    spanModifier.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> modifier'

    divTitreProjets.appendChild(spanModifier);


}

export function openModale(works){
    //je récupère ma section globale de modale pour gérer la class invisible
    const sectionBackgroundModale = document.querySelector('.background-modale');
    sectionBackgroundModale.classList.remove('invisible');

    //<div class="gallery-projets">
    const divGalleryProjets = document.querySelector('.gallery-projets')
    
    
    works.forEach(work => {
        //<figure class="img-modale">
        const figureImgGallery = createBalise('figure', {class: 'figure-modale'});
        
            //<img>
            const imgGallery = createBalise('img', {src: work.imageUrl, alt: work.title});
            
            //<i id="poubelle-suppression" class="fa-regular fa-trash-can poubelle-suppression"></i> --> la poubelle en haut a droite de l'image
            const poubelleImg = createBalise('i', {class: "fa-regular fa-trash-can poubelle-suppression"});
            
            //Attribution d'un data-id sur poubelleImg pour pouvoir le cibler quand on voudra supprimer un projet
            poubelleImg.dataset.id = work.id;

            //Création du bloc figure et attachement de ce bloc à la div modale
            figureImgGallery.appendChild(imgGallery);
            figureImgGallery.appendChild(poubelleImg);
            
            divGalleryProjets.appendChild(figureImgGallery);


    });

}

export function closeModale(){
  // Vide la galerie modale (pour regénérer proprement au prochain open)
  const divGalleryProjets = document.querySelector('.gallery-projets');
  divGalleryProjets.innerHTML = "";

  //Cache toute la modale
  const sectionModale = document.querySelector(".background-modale");
  sectionModale.classList.add('invisible');

  //Remise à l'état initianle sur la gallery lors de la prochaine ouverture
  const divAjoutProjets = document.querySelector('.ajout-projets');
  divAjoutProjets.classList.add('invisible');

  const divGalleryModale = document.querySelector('.gallery-modale');
  divGalleryModale.classList.remove('invisible');

  const flecheRetour = document.getElementById('fleche-retour');
  flecheRetour.classList.add('cacher');
}

export async function deleteProject(id){
    if(!id || !localStorage.getItem('token')){
        return false;
    }else{
        const token = localStorage.getItem('token');
        const url = `http://localhost:5678/api/works/${id}`;

        try{
            //Requete de suppression
            const requestDelete = await fetch(url,{
                        method: 'DELETE',
                        headers: {
                            "Authorization": `Bearer ${token}` 
                        }
                    })
            //Test des différentes réponses 
            if (requestDelete.ok) {
                return true;
            } else if (requestDelete.status === 401) {
                console.error("Non autorisé");
            } else if (requestDelete.status === 500) {
                console.error("Comportement inattendu");
            } else {
                console.error("Suppression échouée :", requestDelete.status);
            }
            return false;
        }catch (error){
            console.error("Erreur: ", error);
            return false
        }
    }
}

export function checkFormulaire(){
    //Je récupère les champs de mon formulaire pour vérifié si ils ont été complété où non
    const inputImage = document.getElementById('form-ajout-image');
    const inputTitre = document.getElementById('form-titre');
    const selectCategorie = document.getElementById('form-categorie');
    const btnValider = document.getElementById('btn-valider-photo');

    if(inputImage.files.length > 0 && inputTitre.value.trim() !== "" && selectCategorie.value !== "") {
        btnValider.disabled = false;
    }else{
        btnValider.disabled = true;
    }
}


export function resetFormAjoutProjets(){
    //Je réinitialise les champs de mon formulaire
    const divAjoutProjets = document.querySelector('.ajout-projets');
    const form = divAjoutProjets.querySelector('form');
    form.reset();

    
    const divAjoutImages = document.querySelector('.ajout-images');
    if(divAjoutImages.classList.contains('invisible')){
        const imgPreview = document.querySelector('.img-preview');
        imgPreview.remove();
        divAjoutImages.classList.remove('invisible');
    }
}

