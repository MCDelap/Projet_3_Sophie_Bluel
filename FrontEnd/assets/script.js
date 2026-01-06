const gallery = document.querySelector(".gallery");

// 1. FONCTION POUR AFFICHER LES PROJETS
function displayGallery(worksList) {
    gallery.innerHTML = ""; 

    for (let i = 0; i < worksList.length; i++) {
        const work = worksList[i]; 

        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        image.src = work.imageUrl;
        image.alt = work.title;

        figcaption.textContent = work.title;

        figure.appendChild(image);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    }
}

// 2. CHARGEMENT INITIAL DES PROJETS
async function loadWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    displayGallery(works);
}

loadWorks();

// 3. GESTION DES FILTRES
const portfolio = document.querySelector("#portfolio");
const filtersContainer = document.createElement("ul");
filtersContainer.classList.add("filters");

function changeSelectedColor(selectedButton) {
    const allButtons = document.querySelectorAll(".filter-btn");
    allButtons.forEach(button => {
        button.classList.remove("active");
    });
    selectedButton.classList.add("active");
}

// --- CRÉATION DU BOUTON "TOUS" ---
const liAll = document.createElement("li");
const btnAll = document.createElement("button");
btnAll.textContent = "Tous";
btnAll.classList.add("filter-btn");
btnAll.classList.add("active");

btnAll.addEventListener("click", async () => {
    changeSelectedColor(btnAll);
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    displayGallery(works); 
});

liAll.appendChild(btnAll);
filtersContainer.appendChild(liAll);

// 4. CRÉATION DES BOUTONS DE CATÉGORIES
async function displayCategories() {
    
    const responseCategories = await fetch("http://localhost:5678/api/categories");
    const categories = await responseCategories.json();

    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.classList.add("filter-btn");
        button.textContent = category.name;

        button.addEventListener("click", async () => {
            changeSelectedColor(button);
            const responseWorks = await fetch("http://localhost:5678/api/works");
            const allWorks = await responseWorks.json();
            
            const filteredWorks = allWorks.filter(work => {
                return work.categoryId === category.id;
            });
            
            displayGallery(filteredWorks);
        });

        li.appendChild(button);
        filtersContainer.appendChild(li);
    }

    portfolio.insertBefore(filtersContainer, gallery);
}

displayCategories();




 
