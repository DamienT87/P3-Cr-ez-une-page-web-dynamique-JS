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
function createBalise(balise, id, text, src, alt, nomClass){
        const element = document.createElement(balise);
        if (id){
            element.id = id;
        }

        if (text){
            element.innerText = text;
        }

        if (src){
            element.src = src;
        }

        if (alt){
            element.alt = alt;
        }
        
        if (nomClass){
            element.className = nomClass;
        }

        return element;
}

export function createBlock(nomTableauSource, section){
    
    for(let i = 0; i < nomTableauSource.length; i++ ){
        //Construction de la balise <figure>
        const figure = createBalise('figure');

        //Construction de la balise <img>
        //Attribution des valeur aux attributs src et alt de la balise <img>
        const img = createBalise('img', null, null, nomTableauSource[i].imageUrl, nomTableauSource[i].title)

        //Construction de la balise <figcaption> et attribution d'une valeur 
        const figcaption = createBalise('figcaption', null, nomTableauSource[i].title);


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
    console.log(categoriesWork);

    //Ici je converti mon Set(categoriesWork) qui me construit un objet avec les valeurs uniques du tableau categorieWork
    //Puisque c'est un objet je le converti en tableau pour le parcourir plus facilement
    const categories = [...new Set(categoriesWork)];
    console.log(categories);



    //Section dans laquelle je vais rajouter la div où il y aura mes boutons
    const sectionPortfolio = document.getElementById('portfolio');

    //Creation de ma div qui va contenir mes boutons, avec la classe list-categorie
    const divCategorie = document.createElement('div')
    divCategorie.classList.add('list-categorie');

    sectionPortfolio.insertBefore(divCategorie, divGallery);

    //Création du bouton "Tous"
    const btnTous = createBalise('button', 'Tous', 'Tous');
    btnTous.classList.add('btn-categories');
    divCategorie.appendChild(btnTous);


    //Boucle foreach pour créé des boutons pour chaque catégorie
    categories.forEach(category => {
        
        //Création du bouton et ajout du text et d'un id pour chaque bouton
        const btnCategories = createBalise('button', category, category)
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
    const spanModifier = createBalise('span', 'btn-modifier');
    spanModifier.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> modifier'
    spanModifier.classList.add('modifier')

    divTitreProjets.appendChild(spanModifier);


}

export function openModale(works){
    //Je récupère dans mon parametre de la fonction le resultat de l'API

    //Je construit ma structure html.
    const body = document.querySelector('body');

    //<section class="background-modale"></section>
    const sectionBackgroundModale = createBalise('section', null, null, null, null, 'background-modale');

        //<div class="modale"></div>
        const divModale = createBalise('div', null, null, null, null, 'modale');

            //<i id="croix-fermeture" class="fa-solid fa-xmark"></i> --> La croix pour fermer la page
            const croixFermeture = createBalise('i', 'croix-fermeture', null, null, null, "fa-solid fa-xmark");
            //<h3>Galerie Photo</h3>
            const titreGalleryPhoto = createBalise('h3', null, 'Galerie Photo');
            //<div class="gallery-modale"></div>
            const divGalleryModale = createBalise('div', null, null, null, null, 'gallery-modale');

                works.forEach(work => {
                    //<figure class="img-modale">
                    const figureImgGallery = createBalise('figure', null, null, null, null, 'figure-modale');
                    
                        //<img>
                        const imgGallery = createBalise('img', null, null, work.imageUrl, null, );
                        //<i id="poubelle-suppression" class="fa-solid fa-trash-can"></i> --> la poubelle en haut a droite de l'image
                        const poubelleImg = createBalise('i', 'poubelle-suppression', null, null, null, "fa-regular fa-trash-can");
                        figureImgGallery.appendChild(imgGallery);
                        figureImgGallery.appendChild(poubelleImg);
                        divGalleryModale.appendChild(figureImgGallery);

                });


            //<button type="submit" class="btn-connexion">Ajouter une photo</button>
            const btnAjouterPhoto = createBalise('button', 'btn-add-photo', 'Ajouter une photo', null, null, 'btn-connexion')



    
    divModale.appendChild(croixFermeture);
    divModale.appendChild(titreGalleryPhoto);
    divModale.appendChild(divGalleryModale);
    divModale.appendChild(btnAjouterPhoto);

    sectionBackgroundModale.appendChild(divModale);

    body.appendChild(sectionBackgroundModale);


}

export function closeModale(elementFermeture){
    elementFermeture.addEventListener("click", (event) =>{
        if(event.target === elementFermeture){
            const sectionModale = document.querySelector(".background-modale");
            sectionModale.remove();
        }
    })
}




