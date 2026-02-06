const gallery = document.querySelector(".gallery");
const token = localStorage.getItem("token");

// FONCTION POUR AFFICHER LES PROJETS (GALERIE PRINCIPALE)
const displayGallery = (worksList) => {
    gallery.innerHTML = "";
    worksList.forEach(work => {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        image.src = work.imageUrl;
        image.alt = work.title;
        figcaption.textContent = work.title;

        figure.append(image, figcaption);
        gallery.append(figure);
    });
}

// CHARGEMENT INITIAL DES PROJETS
async function loadWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    displayGallery(works);
}
loadWorks();

// INTERFACE ADMINISTRATEUR (MODE CONNECTÉ)
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
        
        const editIcon = document.createElement("i");
        editIcon.classList.add("fa-regular", "fa-pen-to-square");

        editBtn.append(editIcon, " modifier");
        editBtn.addEventListener("click", openModal);
        portfolioTitle.append(editBtn);
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

    // FONCTION POUR GÉNÉRER LA VUE GALERIE
    async function showGalleryView() {
        modalWrapper.innerHTML = ""; 

        const modalNav = document.createElement("div");
        modalNav.classList.add("modal-nav");

        const btnClose = document.createElement("button");
        btnClose.classList.add("modal-close");
        const closeIcon = document.createElement("i");
        closeIcon.classList.add("fa-solid", "fa-xmark");
        btnClose.append(closeIcon);

        btnClose.addEventListener("click", closeModal);
        modalNav.append(btnClose);

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

        modalView.append(title, modalGalleryContent, hr, btnAddPhoto);
        modalWrapper.append(modalNav, modalView);

        await displayModalGallery();
    }
    
    // FORMULAIRE D'AJOUT
    function showAddPhotoView() {
        modalWrapper.innerHTML = "";

        const modalNav = document.createElement("div");
        modalNav.classList.add("modal-nav");

        const btnReturn = document.createElement("button");
        btnReturn.classList.add("modal-return");
        const returnIcon = document.createElement("i");
        returnIcon.classList.add("fa-solid", "fa-arrow-left");
        btnReturn.append(returnIcon);
        btnReturn.addEventListener("click", showGalleryView);

        const btnClose = document.createElement("button");
        btnClose.classList.add("modal-close");
        const closeIconAdd = document.createElement("i");
        closeIconAdd.classList.add("fa-solid", "fa-xmark");
        btnClose.append(closeIconAdd);
        btnClose.addEventListener("click", closeModal);

        modalNav.append(btnReturn, btnClose);

        const modalView = document.createElement("div");
        modalView.classList.add("modal-view");

        const title = document.createElement("h3");
        title.textContent = "Ajout photo";

        const form = document.createElement("form");
        form.id = "modal-form-add";

        // Upload & Preview
        const uploadContainer = document.createElement("div");
        uploadContainer.className = "upload-container";

        const iconImg = document.createElement("i");
        iconImg.className = "fa-regular fa-image";

        const labelFile = document.createElement("label");
        labelFile.setAttribute("for", "file-upload");
        labelFile.className = "btn-file";
        labelFile.textContent = "+ Ajouter photo";

        const inputFile = document.createElement("input");
        inputFile.type = "file";
        inputFile.id = "file-upload";
        inputFile.name = "image"; 
        inputFile.style.display = "none";
        inputFile.accept = "image/png, image/jpeg";

        const infoText = document.createElement("p");
        infoText.textContent = "jpg, png : 4mo max";

        const previewImg = document.createElement("img");
        previewImg.style.display = "none";

    uploadContainer.append(previewImg, iconImg, labelFile, inputFile, infoText);

    // Champs de texte
    const labelTitle = document.createElement("label");
    labelTitle.textContent = "Titre";
    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.name = "title";

    const labelCat = document.createElement("label");
    labelCat.textContent = "Catégorie";
    const selectCat = document.createElement("select");
    selectCat.name = "category";
    
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "-- Choisir --";
    selectCat.append(defaultOption);

    // Chargement des catégories depuis l’API
    async function loadCategories() {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            selectCat.append(option);
        });
    }
    loadCategories();

    const hr = document.createElement("hr");

    const btnSubmit = document.createElement("button");
    btnSubmit.type = "submit";
    btnSubmit.className = "btn-submit";
    btnSubmit.textContent = "Valider";

    form.append(uploadContainer, labelTitle, inputTitle, labelCat, selectCat, hr, btnSubmit);

    modalView.append(title, form);
    modalWrapper.append(modalNav, modalView);

    // --- LOGIQUE DE VALIDATION ET D'ENVOI ---

    // Fonction pour vérifier si le bouton doit devenir vert (active)
    const checkForm = () => {
        const imageReady = inputFile.files[0] !== undefined;
        const titleReady = inputTitle.value.trim() !== "";
        const categoryReady = selectCat.value !== "";

        if (imageReady && titleReady && categoryReady) {
            btnSubmit.classList.add("active");
        } else {
            btnSubmit.classList.remove("active");
        }
    };

    // Écouteurs pour mettre à jour le bouton en temps réel
    inputTitle.addEventListener("input", checkForm);
    selectCat.addEventListener("change", checkForm);

    // Écouteur pour l'image (Preview + Poids + Validation)
    inputFile.addEventListener("change", () => {
        const file = inputFile.files[0];
        if (file) {
            const maxSize = 4 * 1024 * 1024; 
            if (file.size <= maxSize) {
                const imageUrl = URL.createObjectURL(file);
                previewImg.src = imageUrl;
                previewImg.style.display = "block";
                // On cache l'icône, le bouton bleu et le texte d'info
                [iconImg, labelFile, infoText].forEach(element => element.style.display = "none");
            } else {
                alert("Le fichier est trop volumineux (4 Mo maximum).");
                inputFile.value = ""; 
            }
        }
        checkForm(); 
    });

    // Envoi du formulaire à l'API
    form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // On envoie uniquement si le bouton est actif
    if (btnSubmit.classList.contains("active")) {

        const formData = new FormData(form);

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });

        if (response.ok) {
            await loadWorks();
            closeModal();

        } else {
            alert("Erreur lors de l'ajout du projet.");
        }

        } else {
        alert("Merci de remplir tous les champs du formulaire.");
    }   
});
}

    // REMPLISSAGE DES PHOTOS DANS LA MODALE
    async function displayModalGallery() {
        const modalGalleryContent = document.querySelector(".modal-gallery-content");
        
        if (modalGalleryContent) {
            const response = await fetch("http://localhost:5678/api/works");
            const works = await response.json();

            works.forEach(work => {
                const figure = document.createElement("figure");
                figure.classList.add("modal-figure");

                const img = document.createElement("img");
                img.src = work.imageUrl;
                img.alt = work.title;

                const trashSpan = document.createElement("span");
                trashSpan.classList.add("trash-icon");
                const trashIcon = document.createElement("i");
                trashIcon.classList.add("fa-solid", "fa-trash-can");
                trashSpan.append(trashIcon);

                figure.append(img, trashSpan);
    
                trashSpan.addEventListener("click", (event) => {
                    event.preventDefault();
                    if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
                        deleteWork(work.id, figure);
                    }
                });

                modalGalleryContent.append(figure);
            });
        }
    }

    // GESTION DE L'OUVERTURE ET FERMETURE
    function openModal(event) {
        if (event) event.preventDefault();
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

 } else {
    // MODE VISITEUR (Filtres)
    const portfolio = document.querySelector("#portfolio");
    const filtersContainer = document.createElement("ul");
    filtersContainer.classList.add("filters");

    function changeSelectedColor(selectedButton) {
        const allButtons = document.querySelectorAll(".filter-btn");
        allButtons.forEach(button => button.classList.remove("active"));
        selectedButton.classList.add("active");
    }

    // CRÉATION DU BOUTON "TOUS"
    const liAll = document.createElement("li");
    const btnAll = document.createElement("button");
    btnAll.textContent = "Tous";
    btnAll.classList.add("filter-btn", "active");

    btnAll.addEventListener("click", () => {
        changeSelectedColor(btnAll);
        loadWorks();
    });

    liAll.append(btnAll);
    filtersContainer.append(liAll);

    // CRÉATION DES BOUTONS DE CATÉGORIES
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

                li.append(button);
                filtersContainer.append(li);
            });
            portfolio.insertBefore(filtersContainer, gallery);
        }
        displayCategories();
    }
