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
        
// FILTRES
const portfolio = document.querySelector("#portfolio");

const ul = document.createElement("ul");
ul.classList.add("filters");

const liTous = document.createElement("li");
const btnTous = document.createElement("button");
btnTous.textContent = "Tous";
btnTous.classList.add("filter-btn");

liTous.appendChild(btnTous);
ul.appendChild(liTous);

async function displayCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const li = document.createElement("li");
      const button = document.createElement("button");

      button.classList.add("filter-btn");
      button.textContent = category.name;
  
      li.appendChild(button);
      ul.appendChild(li);
  }

  portfolio.insertBefore(ul,gallery);

}

displayCategories();








 
