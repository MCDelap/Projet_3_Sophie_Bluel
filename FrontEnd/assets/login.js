// ============================================================
// GESTION DE L'AUTHENTIFICATION
// ============================================================
// Ce script intercepte la soumission du formulaire, envoie les
// identifiants à l'API et stocke le jeton de session.

// Récupération de l'élément formulaire dans le DOM pour manipuler l'événement d'envoi
const formLogin = document.querySelector("#login");

// Écoute de l'événement "submit". On utilise 'async' car on va effectuer une requête HTTP (fetch)
formLogin.addEventListener("submit", async (event) => {
  // Empêche le rechargement par défaut de la page pour gérer l'envoi en JavaScript
  event.preventDefault();

  // Récupération des valeurs saisies par l'utilisateur via les ID des inputs
  const baliseEmail = document.getElementById("email");
  const email = baliseEmail.value;

  const baliseMotdepasse = document.getElementById("password");
  const motdepasse = baliseMotdepasse.value;

  // Envoi d'une requête POST asynchrone vers l'API avec les identifiants
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",

    // On précise à l'API que le corps de la requête est au format JSON
    headers: { "Content-Type": "application/json" },

    // Transformation de l'objet JavaScript en chaîne JSON pour le transport HTTP
    body: JSON.stringify({
      email: email,
      password: motdepasse,
    }),
  });

  // Vérification du code statut de la réponse
  if (response.ok) {
    // Extraction des données de la réponse
    const data = await response.json();

    // Stockage du jeton (token) dans le localStorage pour maintenir la session utilisateur
    window.localStorage.setItem("token", data.token);

    // Redirection vers la page d'accueil une fois l'authentification réussie
    window.location.href = "index.html";
  } else {
    // Gestion d'erreur simplifiée : affichage d'une alerte en cas d'identifiants invalides
    alert("Identifiant ou mot de passe incorrect");
  }
});
