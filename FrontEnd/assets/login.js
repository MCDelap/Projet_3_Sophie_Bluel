// FORMULAIRE DE CONNEXION

const formLogin = document.querySelector("#login");

formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const baliseEmail = document.getElementById("email");
    const email = baliseEmail.value;

    const baliseMotdepasse = document.getElementById("mot_de_passe");
    const motdepasse = baliseMotdepasse.value;

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: motdepasse
        })
    });

    if (response.ok) {
        const data = await response.json();
        window.localStorage.setItem("token", data.token);
        window.location.href = "index.html";
    } else {
        alert("Identifiant ou mot de passe incorrect");
    }
});