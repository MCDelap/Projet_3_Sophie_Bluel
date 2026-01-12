const gallery = document.querySelector(".gallery");
const token = localStorage.getItem("token");

// FONCTION POUR AFFICHER LES PROJETS
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

// CHARGEMENT INITIAL
async function loadWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    displayGallery(works);
}
loadWorks();

if (token) {
    // --- MODE CONNECTE ---
    const banner = document.querySelector(".banner-edition");
    if (banner) banner.style.display = "flex";

    const loginLink = document.querySelector("#login-link");
    if (loginLink) {
        loginLink.textContent = "logout";
        loginLink.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("token");
            window.location.href = "index.html";
        });
    }

    const portfolioTitle = document.querySelector("#portfolio h2");
    if (portfolioTitle) {
        const editBtn = document.createElement("a");
        editBtn.href = "#";
        editBtn.classList.add("modify-link");
        editBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
        portfolioTitle.appendChild(editBtn);
    }
    
    } else {
    // --- MODE VISITEUR (Filtres) ---
    const portfolio = document.querySelector("#portfolio");
    const filtersContainer = document.createElement("ul");
    filtersContainer.classList.add("filters");

    function changeSelectedColor(selectedButton) {
        const allButtons = document.querySelectorAll(".filter-btn");
        allButtons.forEach(button => button.classList.remove("active"));
        selectedButton.classList.add("active");
    }

// --- CRÉATION DU BOUTON "TOUS" ---
    const liAll = document.createElement("li");
    const btnAll = document.createElement("button");
    btnAll.textContent = "Tous";
    btnAll.classList.add("filter-btn", "active");
    btnAll.addEventListener("click", () => {
        changeSelectedColor(btnAll);
        loadWorks();
    });
    liAll.appendChild(btnAll);
    filtersContainer.appendChild(liAll);

liAll.appendChild(btnAll);
filtersContainer.appendChild(liAll);

// --- CRÉATION DES BOUTONS DE CATÉGORIES ---
    async function displayCategories() {
        const responseCategories = await fetch("http://localhost:5678/api/categories");
        const categories = await responseCategories.json();

        categories.forEach(category => {
            const li = document.createElement("li");
            const button = document.createElement("button");
            button.classList.add("filter-btn");
            button.textContent = category.name;

            button.addEventListener("click", async () => {
                changeSelectedColor(button);
                const responseWorks = await fetch("http://localhost:5678/api/works");
                const allWorks = await responseWorks.json();
                const filteredWorks = allWorks.filter(work => work.categoryId === category.id);
                displayGallery(filteredWorks);
            });

            li.appendChild(button);
            filtersContainer.appendChild(li);
        });
        portfolio.insertBefore(filtersContainer, gallery);
    }
    displayCategories();
}



 
