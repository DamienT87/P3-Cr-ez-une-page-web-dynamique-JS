//Fonction de récupération des données via l'API
export async function getData(url){
    try{
        const response = await fetch(url);
        const data = await response.json();
        return data
    }catch{
        console.error("Erreur lors du fetch :", error);
    }
}




//Fonction de création de balise
function createBalise(balise, id, text, src, alt){
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



