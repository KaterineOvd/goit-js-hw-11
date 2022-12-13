import './css/hw11.css';
import Notiflix from 'notiflix';
import { PixabayApi } from './js/pixabay.js';
import makeGalleryCard from './templates/galleryCard.hbs';
import onInputChange from "./js/onInputChange.js";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox('.gallery a', { CaptionDelay: 250 });

const searchFormRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const scrollDiv = document.querySelector('.target-element');

const inputCheckbox = document.querySelector(".checkbox");
const body = document.querySelector("body");

// const observerOptions = {
//     root: null,
//     rootMargin: '0px 0px 500px 0px',
//     threshold: 1
// }

const observer = new IntersectionObserver(
    async (entries, observer) => {
    if (entries[0].isIntersecting) {
        pixabayApi.page += 1;

        try {
            const { data } = await pixabayApi.fetchPhotos();
            galleryRef.insertAdjacentHTML('beforeend', makeGalleryCard(data.hits));
            lightbox.refresh();

            if (pixabayApi.page === Math.ceil(data.totalHits / pixabayApi.per_page)) {
                observer.unobserve(scrollDiv);
            }

             

        } catch (err) {
            console.log(err);
        }

        const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 3,
            behavior: "smooth",
        });
    };
}, 
{ 
    root: null,
    rootMargin: '0px 0px 500px 0px',
    threshold: 1});


const pixabayApi = new PixabayApi();

const onSearchFormSubmit = async event => {
    event.preventDefault();

    pixabayApi.page = 1;
    pixabayApi.searchQuery = event.target.elements.searchQuery.value;

    try {
        const { data } = await pixabayApi.fetchPhotos();

        if (!pixabayApi.searchQuery) {
            Notiflix.Notify.failure("Хоч щось потрібно ввести...");
            return;
        }

        if (data.totalHits === 0) {
            Notiflix.Notify.failure("Ото запит!!!  В нас таких картинок немає :(");
            event.target.elements.searchQuery.value = "";
            galleryRef.innerHTML = "";
            return;
        }

        if (data.totalHits < pixabayApi.per_page) {
            galleryRef.innerHTML = makeGalleryCard(data.hits);
            lightbox.refresh();
            return;
        }
        Notiflix.Notify.info(`Урррра - є контакт, ми знайшли ${data.totalHits} картинок :)`);
        galleryRef.innerHTML = makeGalleryCard(data.hits);
        lightbox.refresh();
        observer.observe(scrollDiv);
    } catch (err) {
        console.log(err);
    }
};

searchFormRef.addEventListener('submit', onSearchFormSubmit);
// ------------------theme--------------------

inputCheckbox.addEventListener("change", onInputChange);

function checkTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark-theme") {
        inputCheckbox.checked = true;
        body.classList.replace("light-theme", "dark-theme");

    }
};

checkTheme();

scrollDiv