const main = document.querySelector("main");
const categoryLinks = document.querySelectorAll("nav a");

const response = await fetch("/api/images");
const images = await response.json();

function shuffle(items) {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

const categories = [...categoryLinks]
    .map((link) => link.textContent.trim())
    .filter((category) => category !== "all");
const counts = shuffle([5, 6, 7, 9, 11, 12, 12]);
const categoryImages = Object.fromEntries(
    categories.map((category, index) => [category, shuffle(images).slice(0, counts[index])]),
);

function renderImages(filenames) {
    main.replaceChildren();

    for (const filename of filenames) {
        const item = document.createElement("div");
        const image = document.createElement("img");
        const caption = document.createElement("p");

        image.src = `./assets/${encodeURIComponent(filename)}`;
        image.alt = filename;
        caption.textContent = filename;

        item.append(image, caption);
        main.append(item);
    }
}

for (const link of categoryLinks) {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const selectedCategory = link.textContent.trim();
        categoryLinks.forEach((categoryLink) => categoryLink.classList.remove("active"));
        link.classList.add("active");

        renderImages(selectedCategory === "all" ? images : categoryImages[selectedCategory]);
    });
}

const allLink = [...categoryLinks].find((link) => link.textContent.trim() === "all");
allLink.classList.add("active");
renderImages(images);
