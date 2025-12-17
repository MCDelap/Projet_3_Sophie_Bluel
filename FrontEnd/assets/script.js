//PROJETS
const gallery = document.querySelector(".gallery");

fetch("http://localhost:5678/api/works")
.then(response => response.json())
.then(works => {
    works.forEach(work => {

        const figure = document.createElement ("figure");
        const img = document.createElement ("img");
        const figcaption = document.createElement ("figcaption");
        
        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;
        
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);

        });

});


 





