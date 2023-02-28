import * as checkWebp from './modules/checkWebp.js';
import * as func from './modules/functions.js';
import {
    API,
    categories,
    heroForm,
    inputCategory,
    formSearchBtn,
    formSearch,
    mainJokesDiv,
    menuBtn,
    menu,
    overlay,
} from './modules/variables.js';

checkWebp.isWebp();

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    menu.classList.toggle('menu-opened');
    overlay.classList.toggle('open');
});

overlay.addEventListener('click', () => {
    menuBtn.classList.remove('active');
    menu.classList.remove('menu-opened');
    overlay.classList.remove('open');
});

// create caregory buttons

func.controller(`${API}/categories`).then((response) => {
    const categoryUl = document.createElement('ul');
    categoryUl.classList.add('hero__category-list');

    response.forEach(category => {
        const categoryLi = document.createElement('li');
        const label = document.createElement('label');
        const input = document.createElement('input');
        categoryLi.classList.add('hero__categoty-el');

        input.type = 'radio';
        input.name = 'jokeCategory';
        input.value = category;
        input.setAttribute('id', category);
        label.setAttribute('for', category);

        label.innerText = category.toUpperCase();
        label.prepend(input);
        categoryLi.append(input);
        categoryLi.append(label);
        categoryUl.append(categoryLi);
    });
    categories.append(categoryUl);
});

heroForm.addEventListener('submit', e => {
    e.preventDefault();

    const choosenButton = document.querySelector('input[name=jokeType]:checked').value;

    if (choosenButton === 'random') {
        func.controller(`${API}/random`).then(data => func.renderCardJoke(mainJokesDiv, data));
    }
    if (choosenButton === 'category') {
        const choosenCategory = document.querySelector('input[name=jokeCategory]:checked').value;
        func.controller(`${API}/random?category=${choosenCategory}`).then(data =>
            func.renderCardJoke(mainJokesDiv, data)
        );
    }
    if (choosenButton === 'search') {
        func.controller(`${API}/search?query=${formSearch.value}`).then(data => {
            data.result.forEach((joke) => func.renderCardJoke(mainJokesDiv, joke));
        });
    }
});

inputCategory.addEventListener('change', () => {
    formSearch.classList.add('d-none');
    categories.classList.remove('d-none');
});

formSearchBtn.addEventListener('change', () => {
    categories.classList.add('d-none');
    formSearch.classList.remove('d-none');
});

func.renderFavJoke();
