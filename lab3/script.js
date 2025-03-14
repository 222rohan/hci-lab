document.addEventListener("DOMContentLoaded", function() {
    const menuItems = [
        { name: "Indian", img: "images/indian.jpg" },
        { name: "Italian", img: "images/italian.jpg" },
        { name: "Japanese", img: "images/japanese.jpg" },
        { name: "Mexican", img: "images/mexican.jpg" },
        { name: "Thai", img: "images/thai.jpg" },
    ];

    const menuContainer = document.getElementById("menu-container");

    menuItems.forEach(item => {
        const menuItem = document.createElement("div");
        menuItem.classList.add("menu-item");

        menuItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.price}</p>
        `;

        menuContainer.appendChild(menuItem);
    });
});