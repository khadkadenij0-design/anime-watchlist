console.log("Anime script is working!");
const animeGrid = document.getElementById("anime-grid");

const message = document.getElementById("message");

const searchForm = document.getElementById("search-form");

const searchInput = document.getElementById("search-input");

const featuredAnime = [

    "One Piece",

    "Jujutsu Kaisen",

    "Naruto: Shippuden",

    "Kimi no Na wa",

    "Attack on Titan",

    "Demon Slayer"

];

let animeList = [];

async function searchAnime(title) {

    const url =

        "https://api.tenrai.org/v1/anime?q=" +

        encodeURIComponent(title) +

        "&limit=1&sfw=true";

    const response = await fetch(url);

    if (!response.ok) {

        throw new Error("Could not load anime");

    }

    const result = await response.json();

    return result.data[0];

}

function showAnime(anime) {

    const card = document.createElement("article");

    card.className = "anime-card";

    const image = document.createElement("img");

    image.src = anime.images.jpg.large_image_url;

    image.alt = anime.title;

    image.loading = "lazy";

    const info = document.createElement("div");

    info.className = "card-info";

    const title = document.createElement("h3");

    title.textContent = anime.title;

    const year = document.createElement("p");

    year.textContent = "Year: " + (anime.year || "Unknown");

    const rating = document.createElement("p");

    rating.className = "rating";

    rating.textContent = "★ " + (anime.score || "Not rated");

    const button = document.createElement("button");

    button.className = "add-button";

    button.textContent = "＋ Add to Watchlist";

    button.addEventListener("click", () => {

        addToWatchlist(anime);

    });

    info.append(title, year, rating, button);

    card.append(image, info);

    return card;

}

function displayAnime(list) {

    animeGrid.replaceChildren();

    if (list.length === 0) {

        message.textContent = "No anime found. Try another title.";

        return;

    }

    message.textContent = "";

    list.forEach(anime => {

        animeGrid.appendChild(showAnime(anime));

    });

}

async function loadFeaturedAnime() {

    message.textContent = "Loading anime posters...";

    for (const title of featuredAnime) {

        try {

            const anime = await searchAnime(title);

            if (anime && !animeList.some(item => item.mal_id === anime.mal_id)) {

                animeList.push(anime);

                displayAnime(animeList);

            }

        } catch (error) {

            console.error(error);

        }

        // Avoid sending requests too quickly.

        await new Promise(resolve => setTimeout(resolve, 1100));

    }

    message.textContent = animeList.length

        ? ""

        : "Anime could not load. Check your internet connection and try again.";

}

searchForm.addEventListener("submit", async event => {

    event.preventDefault();

    const query = searchInput.value.trim();

    if (!query) {

        displayAnime(animeList);

        return;

    }

    message.textContent = "Searching...";

    animeGrid.replaceChildren();

    try {

        searchForm.addEventListener("submit", async event => {

    event.preventDefault();

    const query = searchInput.value.trim();

    if (!query) {

        displayAnime(animeList);

        return;

    }

    message.textContent = "Searching...";

    animeGrid.replaceChildren();

    try {

        const url =

            "https://api.tenrai.org/v1/anime?q=" +

            encodeURIComponent(query) +

            "&limit=12";

        const response = await fetch(url);

        if (!response.ok) {

            throw new Error("API error: " + response.status);

        }

        const result = await response.json();

        console.log("Search results:", result);

        displayAnime(result.data || []);

    } catch (error) {

        console.error("Anime search failed:", error);

        message.textContent =

            "Search failed. Please try again in a moment.";

    }

});
 

        if (!response.ok) {

            throw new Error("Search failed");

        }

        const result = await response.json();

        displayAnime(result.data);

    } catch (error) {

        message.textContent =

            "Search failed. Please wait a moment and try again.";

    }

});

let watchlist = JSON.parse(

    localStorage.getItem("animeWatchlist") || "[]"

);

function addToWatchlist(anime) {

    const alreadyAdded = watchlist.some(

        item => item.mal_id === anime.mal_id

    );

    if (alreadyAdded) {

        alert("This anime is already in your watchlist!");

        return;

    }

    watchlist.push({

        mal_id: anime.mal_id,

        title: anime.title,

        image: anime.images.jpg.large_image_url,

        year: anime.year || "Unknown",

        score: anime.score || "Not rated"

    });

    localStorage.setItem("animeWatchlist", JSON.stringify(watchlist));

    displayWatchlist();

    alert("Added to your watchlist!");

}

function displayWatchlist() {

    const section = document.getElementById("watchlist");

    section.replaceChildren();

    const heading = document.createElement("h2");

    heading.textContent = "📚 My Watchlist";

    section.appendChild(heading);

    if (watchlist.length === 0) {

        const empty = document.createElement("p");

        empty.textContent = "Your selected anime will appear here.";

        section.appendChild(empty);

        return;

    }

    const grid = document.createElement("div");

    grid.className = "anime-grid";

    watchlist.forEach(anime => {

        const card = document.createElement("article");

        card.className = "anime-card";

        const image = document.createElement("img");

        image.src = anime.image;

        image.alt = anime.title;

        image.loading = "lazy";

        const info = document.createElement("div");

        info.className = "card-info";

        const title = document.createElement("h3");

        title.textContent = anime.title;
        const genres = document.createElement("p");
genres.className = "anime-genres";
genres.textContent = anime.genres
   ? anime.genres.map(genre => genre.name).join(" • ")
   : "Genres unavailable";

        const removeButton = document.createElement("button");

        removeButton.className = "add-button";

        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {

            watchlist = watchlist.filter(

                item => item.mal_id !== anime.mal_id

            );

            localStorage.setItem(

                "animeWatchlist",

                JSON.stringify(watchlist)

            );

            displayWatchlist();

        });

        info.append(title, removeButton);

        card.append(image, info);

        grid.appendChild(card);

    });

    section.appendChild(grid);

}

displayWatchlist();

loadFeaturedAnime();
 
