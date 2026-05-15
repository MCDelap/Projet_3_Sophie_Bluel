/* * SCRIPT PRINCIPAL DU PORTFOLIO
 * Ce script gère l'affichage dynamique des projets via l'API,
 * la gestion des filtres pour les visiteurs, et les fonctionnalités
 * d'administration (modale, suppression et ajout de projets) après authentification.
 */

// ============================================================
// ÉTAPE 2 : INITIALISATION ET AFFICHAGE DES TRAVAUX
// ============================================================

const gallery = document.querySelector(".gallery");
const token = localStorage.getItem("token");

// --- ÉTAPE 2.2 : Manipulation du DOM pour la galerie principale ---

const displayGallery = (worksList) => {
  gallery.innerHTML = "";
  worksList.forEach((work) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    image.src = work.imageUrl;
    image.alt = work.title;
    figcaption.textContent = work.title;

    figure.append(image, figcaption);
    gallery.append(figure);
  });
};

// --- ÉTAPE 2.1 : Appel API Fetch pour récupérer les travaux ---

async function loadWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  displayGallery(works);
}
loadWorks();

// Fonctions utilitaires pour l'ajout immédiat (Étape 8.2)

function addWorkToGallery(work) {
  // Création des éléments pour la galerie principale
  const figure = document.createElement("figure");
  const image = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  // Attribution des données du nouveau projet (provenant du serveur)
  image.src = work.imageUrl;
  image.alt = work.title;
  figcaption.textContent = work.title;

  // Insertion dans le DOM pour un affichage instantané sans recharger la page
  figure.append(image, figcaption);
  gallery.append(figure);
}

function addWorkToModal(work) {
  const modalGalleryContent = document.querySelector(".modal-gallery-content");

  if (modalGalleryContent) {
    const figure = document.createElement("figure");
    figure.classList.add("modal-figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    // Ajout du nouveau projet à la vue galerie de la modale
    figure.append(img);
    modalGalleryContent.append(figure);
  }
}

// ============================================================
// ADAPTATION DE L'INTERFACE SELON LA CONNEXION
// ============================================================

if (token) {
  // ------------------------------------------------------------
  // ÉTAPE 5 : MODE ADMINISTRATEUR (Connecté)
  // ------------------------------------------------------------

  // --- ÉTAPE 5.3 : Affichage de la bannière et gestion du Logout ---

  // On affiche la barre noire d'édition en haut de page
  const banner = document.querySelector(".banner-edition");
  if (banner) banner.style.display = "flex";

  // Transformation du lien "login" en "logout"
  const loginLink = document.querySelector("#login-link");
  if (loginLink) {
    loginLink.textContent = "logout";
    loginLink.addEventListener("click", (event) => {
      event.preventDefault();

      // Suppression du jeton d'authentification pour fermer la session
      localStorage.removeItem("token");

      // Redirection vers la page d'accueil pour rafraîchir l'état de l'interface
      window.location.href = "index.html";
    });
  }

  // --- ÉTAPE 5.3 : Création dynamique du bouton "Modifier" ---

  // Ajout du lien d'édition à côté du titre "Mes Projets"
  const portfolioTitle = document.querySelector("#portfolio h2");
  if (portfolioTitle) {
    const editBtn = document.createElement("a");
    editBtn.href = "#";
    editBtn.classList.add("modify-link");

    // Création de l'icône de modification (FontAwesome)
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-regular", "fa-pen-to-square");

    // Assemblage de l'icône et du texte dans le bouton
    editBtn.append(editIcon, " modifier");

    // Déclenchement de l'ouverture de la modale au clic
    editBtn.addEventListener("click", openModal);

    // Insertion du bouton dans le titre H2
    portfolioTitle.append(editBtn);
  }

  // ÉTAPE 6 : GESTION DE LA MODALE

  const modalContainer = document.querySelector("#modal-container");
  const modalWrapper = document.querySelector(".modal-wrapper");

  // --- ÉTAPE 6 : Construction de la vue "Galerie" de la modale ---

  async function showGalleryView() {
    // On vide le contenu actuel de la modale pour éviter les doublons
    modalWrapper.innerHTML = "";

    // Création de la barre de navigation (bouton fermer)
    const modalNav = document.createElement("div");
    modalNav.classList.add("modal-nav");
    const btnClose = document.createElement("button");
    btnClose.classList.add("modal-close");
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fa-solid", "fa-xmark");
    btnClose.append(closeIcon);
    btnClose.addEventListener("click", closeModal);
    modalNav.append(btnClose);

    // Création de la structure de la vue galerie
    const modalView = document.createElement("div");
    modalView.classList.add("modal-view");
    const title = document.createElement("h3");
    title.textContent = "Galerie photo";
    const modalGalleryContent = document.createElement("div");
    modalGalleryContent.classList.add("modal-gallery-content");
    const hr = document.createElement("hr");

    // Bouton pour basculer vers la vue d'ajout de photo
    const btnAddPhoto = document.createElement("button");
    btnAddPhoto.classList.add("btn-add-photo");
    btnAddPhoto.textContent = "Ajouter une photo";
    btnAddPhoto.addEventListener("click", showAddPhotoView);

    // Assemblage des éléments dans le wrapper
    modalView.append(title, modalGalleryContent, hr, btnAddPhoto);
    modalWrapper.append(modalNav, modalView);

    // Chargement effectif des photos
    await displayModalGallery();
  }

  // --- ÉTAPE 6 (Suite) : Affichage des photos avec option de suppression ---

  async function displayModalGallery() {
    const modalGalleryContent = document.querySelector(
      ".modal-gallery-content",
    );

    if (modalGalleryContent) {
      // Récupération des travaux pour l'affichage interne à la modale
      const response = await fetch("http://localhost:5678/api/works");
      const works = await response.json();

      works.forEach((work) => {
        const figure = document.createElement("figure");
        figure.classList.add("modal-figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        // Création de l'icône de suppression (poubelle)
        const trashSpan = document.createElement("span");
        trashSpan.classList.add("trash-icon");
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can");
        trashSpan.append(trashIcon);

        figure.append(img, trashSpan);

        // --- ÉTAPE 7 : Écouteur pour la suppression ---

        trashSpan.addEventListener("click", (event) => {
          event.preventDefault();

          // Demande de confirmation avant action irréversible
          if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
            // Appel de la fonction de suppression avec l'ID du projet et l'élément DOM à retirer
            deleteWork(work.id, figure);
          }
        });

        modalGalleryContent.append(figure);
      });
    }
  }

  // --- ÉTAPE 7 : Logique technique de suppression via l'API ---

  async function deleteWork(workId, figureElement) {
    // Envoi de la requête DELETE au serveur avec le jeton d'authentification
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      // Si le serveur confirme, on retire l'élément de la modale immédiatement
      figureElement.remove();

      // On rafraîchit également la galerie principale en arrière-plan
      loadWorks();
    } else {
      // Gestion d'erreur si la suppression échoue (ex: token expiré)
      alert("Erreur lors de la suppression du projet.");
    }
  }

  // --- ÉTAPE 8.1 : Construction de la vue "Ajout Photo" ---

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

    // --- ÉTAPE 8.1 : Upload & Preview ---

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

    // --- ÉTAPE 8.1 : Champs de texte ---

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

    // --- ÉTAPE 8.1 : Chargement dynamique des catégories

    async function loadCategories() {
      const response = await fetch("http://localhost:5678/api/categories");
      const categories = await response.json();

      categories.forEach((category) => {
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

    form.append(
      uploadContainer,
      labelTitle,
      inputTitle,
      labelCat,
      selectCat,
      hr,
      btnSubmit,
    );
    modalView.append(title, form);
    modalWrapper.append(modalNav, modalView);

    // --- LOGIQUE DE VALIDATION ET D'ENVOI ---

    // --- ÉTAPE 8.1 : Logique de validation en temps réel ---

    const checkForm = () => {
      // 1. On vérifie si une image a été sélectionnée
      const imageReady = inputFile.files[0] !== undefined;
      // 2. On vérifie si le titre est rempli (trim() supprime les espaces inutiles)
      const titleReady = inputTitle.value.trim() !== "";
      // 3. On vérifie si une catégorie est sélectionnée dans la liste
      const categoryReady = selectCat.value !== "";

      // Si les 3 conditions sont réunies, on active visuellement le bouton
      if (imageReady && titleReady && categoryReady) {
        btnSubmit.classList.add("active");
      } else {
        // Sinon, le bouton reste grisé (état par défaut)
        btnSubmit.classList.remove("active");
      }
    };

    // Écouteurs d'événements pour déclencher la vérification à chaque saisie
    inputTitle.addEventListener("input", checkForm);
    selectCat.addEventListener("change", checkForm);

    // Écouteur pour la gestion du fichier image (Aperçu + Validation)
    inputFile.addEventListener("change", () => {
      const file = inputFile.files[0];

      if (file) {
        // Création d'une URL temporaire pour afficher l'aperçu de l'image choisie
        const imageUrl = URL.createObjectURL(file);
        previewImg.src = imageUrl;
        previewImg.style.display = "block";

        // On masque les éléments d'upload (icône, bouton, texte) pour laisser place à l'image
        [iconImg, labelFile, infoText].forEach(
          (element) => (element.style.display = "none"),
        );
      }
      checkForm();
    });

    // --- ÉTAPE 8.2 : Envoi FormData et actualisation ---

    form.addEventListener("submit", async (event) => {
      // On empêche le rechargement par défaut de la page
      event.preventDefault();

      // On envoie les données uniquement si le formulaire est complet (bouton actif)
      if (btnSubmit.classList.contains("active")) {
        // Utilisation de FormData pour empaqueter les fichiers et les champs texte
        const formData = new FormData(form);

        // Envoi de la requête POST avec le jeton d'authentification
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (response.ok) {
          // On récupère l'objet créé par l'API
          const newWork = await response.json();

          // Mise à jour dynamique des deux galeries
          addWorkToGallery(newWork);
          addWorkToModal(newWork);

          // Fermeture de la modale après succès
          closeModal();
        } else {
          alert("Erreur lors de l'ajout du projet.");
        }
      } else {
        alert("Merci de remplir tous les champs du formulaire.");
      }
    });
  }

  // --- ÉTAPE 6 : Fonctions d'ouverture et de fermeture ---

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
  // ------------------------------------------------------------
  // ÉTAPE 3 & 4 : MODE VISITEUR (Filtres)
  // ------------------------------------------------------------

  const portfolio = document.querySelector("#portfolio");
  const filtersContainer = document.createElement("ul");
  filtersContainer.classList.add("filters");

  function changeSelectedColor(selectedButton) {
    const allButtons = document.querySelectorAll(".filter-btn");
    allButtons.forEach((button) => button.classList.remove("active"));
    selectedButton.classList.add("active");
  }

  // --- ÉTAPE 3 : Création du bouton "Tous" ---

  const liAll = document.createElement("li");
  const btnAll = document.createElement("button");
  btnAll.textContent = "Tous";
  btnAll.classList.add("filter-btn", "active");

  // Ecouteur du bouton "Tous"
  btnAll.addEventListener("click", () => {
    changeSelectedColor(btnAll);
    loadWorks();
  });

  liAll.append(btnAll);
  filtersContainer.append(liAll);

  // --- ÉTAPE 4 : Création dynamique des filtres de catégories ---

  async function displayCategories() {
    // Récupération des catégories depuis l'API
    const responseCategories = await fetch(
      "http://localhost:5678/api/categories",
    );
    const categories = await responseCategories.json();

    categories.forEach((category) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.classList.add("filter-btn");
      button.textContent = category.name;

      button.addEventListener("click", async () => {
        changeSelectedColor(button);

        // Récupération de la version la plus récente des travaux pour le filtrage
        const responseWorks = await fetch("http://localhost:5678/api/works");
        const allWorks = await responseWorks.json();

        // Logique de filtrage : on compare l'ID du travail avec l'ID de la catégorie du bouton
        const filteredWorks = allWorks.filter(
          (work) => work.categoryId === category.id,
        );

        // Mise à jour de l'affichage avec le tableau filtré
        displayGallery(filteredWorks);
      });

      li.append(button);
      filtersContainer.append(li);
    });

    // Insertion des filtres dans le DOM avant la galerie
    portfolio.insertBefore(filtersContainer, gallery);
  }
  displayCategories();
}
