const cuisines = [
    { name: "Italian", image: "images/italian.jpg" },
    { name: "Mexican", image: "images/mexican.jpg" },
    { name: "Japanese", image: "images/japanese.jpg" },
    { name: "Indian", image: "images/indian.jpg" }
];

const menuContainer = document.getElementById("menu");

function displayMenu() {
    menuContainer.innerHTML = "";
    cuisines.forEach(cuisine => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="${cuisine.image}" alt="${cuisine.name}" style="width:100%; border-radius:5px;">
            <h3>${cuisine.name}</h3>
        `;
        menuContainer.appendChild(card);
    });
}

document.getElementById("viewMenu").addEventListener("click", displayMenu);