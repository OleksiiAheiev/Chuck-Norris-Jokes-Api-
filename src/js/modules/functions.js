export const controller = (action) => fetch(action).then((data) => data.json());

export function renderCardJoke(container, joke) {
    const jokeCard = document.createElement('div');
    const heartSvg = 'img/svg/heart.svg';
    const likeSvg = 'img/svg/like.svg';
    const msgSvg = 'img/svg/message.svg';
    const linkSvg = 'img/svg/link.svg';

    const jokeMsg = document.createElement('span');
    const imgMsg = document.createElement('img');
    const jokeLike = document.createElement('span');
    const imgLike = document.createElement('img');
    const jokeLink = document.createElement('a');
    const jokeId = document.createElement('span');
    const linkImg = document.createElement('img');
    const jokeText = document.createElement('p');
    const typeInfo = document.createElement('div');

    const jokeInfo = document.createElement('p');
    const jokeType = document.createElement('p');

    jokeCard.classList.add('joke-card');
    jokeMsg.classList.add('joke-card__message');
    jokeLike.classList.add('joke-card__like');
    jokeId.classList.add('joke-card__id');
    jokeText.classList.add('joke-card__text');
    typeInfo.classList.add('joke-card__type-info');
    jokeInfo.classList.add('joke-card__type-info--info');

    imgLike.addEventListener('click', () => {
        createFavList(joke);
        !checkIncludingFavList(joke.id) ? (imgLike.src = heartSvg) : (imgLike.src = likeSvg);
    });

    !checkIncludingFavList(joke.id) ? (imgLike.src = heartSvg) : (imgLike.src = likeSvg);

    imgMsg.setAttribute('src', msgSvg);
    jokeLink.setAttribute('href', `${joke.url}`);
    linkImg.setAttribute('src', linkSvg);

    jokeId.innerHTML = 'ID:';
    jokeLink.innerText = joke.id;

    jokeMsg.append(imgMsg);
    jokeLike.append(imgLike);
    jokeId.append(jokeLink);
    jokeId.append(linkImg);

    jokeText.innerText = joke.value;
    jokeInfo.innerHTML = `Last update: ${getHoursSince(joke.updated_at)} haurs ago`;

    typeInfo.append(jokeInfo, jokeType);

    jokeCard.append(jokeMsg, jokeLike, jokeId, jokeText, typeInfo);

    if (joke.categories.length > 0) {
        jokeType.innerText = joke.categories;
        jokeType.classList.add('joke-card__type-info--joke-type');
        jokeType.style.display = 'inline-block';
    }

    container.append(jokeCard);
}

export function getHoursSince(dateStr) {
    const startDate = new Date(dateStr);
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - startDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return Math.floor(diffInHours);
}

function checkFavInLocalStorage() {
    return localStorage.getItem('favoriteList') ? JSON.parse(localStorage.getItem('favoriteList')) : [];
}

function checkIncludingFavList(id) {
    return checkFavInLocalStorage().find((joke) => joke.id === id);
}

function addJokeToFAvList(joke) {
    const favList = checkFavInLocalStorage();
    favList.push(joke);

    localStorage.setItem('favoriteList', JSON.stringify(favList));
    renderFavJoke();
}

function removeJokeFromFavList(joke) {
    const favList = checkFavInLocalStorage();
    const filterFav = favList.filter((favJoke) => favJoke.id !== joke.id);

    localStorage.setItem('favoriteList', JSON.stringify(filterFav));
    renderFavJoke();
}

function createFavList(joke) {
    if (!checkIncludingFavList(joke.id)) {
        addJokeToFAvList(joke);
    } else {
        removeJokeFromFavList(joke);
    }
}

export function renderFavJoke() {
    const jokesDiv = document.querySelectorAll('.hero__right-jokes, .header__right-menu');

    jokesDiv.forEach((jokeDiv) => {
        jokeDiv.innerHTML = '';
        checkFavInLocalStorage().forEach((favJoke) => renderCardJoke(jokeDiv, favJoke));
    });
}
