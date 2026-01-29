const gallery = document.querySelector(".gallery");
const token = localStorage.getItem("token");

// --- FONCTION POUR AFFICHER LES PROJETS (GALERIE PRINCIPALE) ---
function displayGallery(worksList) {
    gallery.innerHTML = "";
    worksList.forEach(function(work) {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        image.src = work.imageUrl;
        image.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// --- CHARGEMENT INITIAL DES PROJETS ---
async function loadWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    displayGallery(works);
}

loadWorks();

// --- INTERFACE ADMINISTRATEUR (MODE CONNECTÉ) ---
if (token) {

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

    // Création du bouton "Modifier" à côté de Mes Projets
    const portfolioTitle = document.querySelector("#portfolio h2");
    if (portfolioTitle) {
        const editBtn = document.createElement("a");
        editBtn.href = "#";
        editBtn.classList.add("modify-link");
        editBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';

        editBtn.addEventListener("click", openModal);
        portfolioTitle.appendChild(editBtn);
    }

    // GESTION DE LA FENETRE MODALE
    const modalContainer = document.querySelector("#modal-container");
    const modalWrapper = document.querySelector(".modal-wrapper");

    // FONCTION DE SUPPRESSION
    async function deleteWork(workId, figureElement) {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
            figureElement.remove();
            loadWorks();
        } else {
            alert("Erreur lors de la suppression du projet.");
        }
    }

    // Fonction pour générer la vue galerie
    async function showGalleryView() {
        modalWrapper.innerHTML = ""; 

        const modalNav = document.createElement("div");
        modalNav.classList.add("modal-nav");
        const btnClose = document.createElement("button");
        btnClose.classList.add("modal-close");
        btnClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        btnClose.addEventListener("click", closeModal);
        modalNav.appendChild(btnClose);

        const modalView = document.createElement("div");
        modalView.classList.add("modal-view");

        const title = document.createElement("h3");
        title.textContent = "Galerie photo";

        const modalGalleryContent = document.createElement("div");
        modalGalleryContent.classList.add("modal-gallery-content");

        const hr = document.createElement("hr");

        const btnAddPhoto = document.createElement("button");
        btnAddPhoto.classList.add("btn-add-photo");
        btnAddPhoto.textContent = "Ajouter une photo";
        btnAddPhoto.addEventListener("click", showAddPhotoView);

        modalView.appendChild(title);
        modalView.appendChild(modalGalleryContent);
        modalView.appendChild(hr);
        modalView.appendChild(btnAddPhoto);

        modalWrapper.appendChild(modalNav);
        modalWrapper.appendChild(modalView);

        await displayModalGallery();
    }
    
        // VUE FORMULAIRE D'AJOUT (A venir)
    function showAddPhotoView() {
    modalWrapper.innerHTML = "";

    const modalNav = document.createElement("div");
    modalNav.classList.add("modal-nav");

    const btnReturn = document.createElement("button");
    btnReturn.classList.add("modal-return");
    btnReturn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
   
    btnReturn.addEventListener("click", showGalleryView); 

    const btnClose = document.createElement("button");
    btnClose.classList.add("modal-close");
    btnClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    btnClose.addEventListener("click", closeModal);

    modalNav.appendChild(btnReturn);
    modalNav.appendChild(btnClose);

    const modalView = document.createElement("div");
    modalView.classList.add("modal-view");

    const title = document.createElement("h3");
    title.textContent = "Ajout photo";

    const formContainer = document.createElement("div");
    formContainer.id = "modal-form-container";

    const placeholderText = document.createElement("p");
    placeholderText.style.textAlign = "center";
    placeholderText.style.padding = "20px";
    placeholderText.textContent = "Zone du formulaire d'ajout (À venir)";

    formContainer.appendChild(placeholderText);
    modalView.appendChild(title);
    modalView.appendChild(formContainer);

    modalWrapper.appendChild(modalNav);
    modalWrapper.appendChild(modalView);
}

    // Fonction pour remplir les photos
    async function displayModalGallery() {
        const modalGalleryContent = document.querySelector(".modal-gallery-content");
        
        if (modalGalleryContent) {
            const response = await fetch("http://localhost:5678/api/works");
            const works = await response.json();

            works.forEach(work => {
                const figure = document.createElement("figure");
                figure.classList.add("modal-figure");

                figure.innerHTML = `
                    <img src="${work.imageUrl}" alt="${work.title}">
                    <span class="trash-icon"><i class="fa-solid fa-trash-can"></i></span>
                `;

                 // Ciblage de la poubelle pour activer la suppression
                const trashBtn = figure.querySelector(".trash-icon");
                trashBtn.addEventListener("click", (event) => {
                    event.preventDefault();
                    if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
                        deleteWork(work.id, figure);
                    }
                });

                modalGalleryContent.appendChild(figure);
            });
        }
    }

    // GESTION DE L'OUVERTURE ET FERMETURE
    function openModal(event) {
        event.preventDefault();
        modalContainer.style.display = "flex";
        showGalleryView(); 
    }

    function closeModal() {
        modalContainer.style.display = "none";
        modalWrapper.innerHTML = "";
    }

    modalContainer.addEventListener("click", (event) => {
        if (event.target === modalContainer) {
            closeModal();
        }
    });

    const editBtnAction = document.querySelector(".modify-link");
    if (editBtnAction) {
        editBtnAction.addEventListener("click", openModal);
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



 
