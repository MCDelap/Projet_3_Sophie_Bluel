//PROJETS
const gallery = document.querySelector(".gallery");

async function displayWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

    for (let i = 0; i < works.length; i++) {
      const work = works[i];
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");
        
      img.src = work.imageUrl;
      img.alt = work.title;
      figcaption.textContent = work.title;
        
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
  }
}

displayWorks();
        








 
