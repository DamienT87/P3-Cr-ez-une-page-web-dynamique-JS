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


export async function generateWorks(){
    const getWorks = await getData("http://localhost:5678/api/works");

    //Sélection de la div gallery
    const divGallery = document.querySelector('.gallery');

    //Boucle pour créer chaque élément
    for(let i = 0; i < getWorks.length; i++ ){
        
        //Construction de la balise <figure>
        const figure = document.createElement('figure');

        //Construction de la balise <img>
        const img = document.createElement('img');
        //Attribution des valeur aux attributs src et alt de la balise <img>
        img.src = getWorks[i].imageUrl;
        img.alt = getWorks[i].title;

        //Construction de la balise <figcaption> et attribution d'une valeur 
        const figcaption = document.createElement('figcaption');
        figcaption.innerText = getWorks[i].title;

        //Imbrication des balises et de leur contenu
        figure.appendChild(img);
        figure.appendChild(figcaption);
        divGallery.appendChild(figure);

    }
}
