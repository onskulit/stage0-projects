let url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=6d4eabbdded91ebb031d80cbb3a592da';
const main = document.querySelector('.main');
const search = document.querySelector('.search');

async function getData() {
    const res = await fetch(url);
    const data = await res.json();
    checkMovie(data);
    for (let i = 0; i < data.results.length; i++) {
        createMovie(data, i);
    }
  }

getData(); 

search.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        deleteMovies();
        if (search.value) {
            url = `https://api.themoviedb.org/3/search/movie?query=${search.value}&api_key=3fd2be6f0c70a2a598f084ddfb75487c`;
        } else {
            url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=6d4eabbdded91ebb031d80cbb3a592da';
        }
        getData();
    }
});

// movie check

const checkMovie = (data) => {
    if (!data.results.length) {
        const noMovie = document.createElement('h1');
        noMovie.textContent = 'Sorry, there is no such movie :(';
        noMovie.classList.add('no-movie');
        main.appendChild(noMovie);
    }
}

// movies deletion

const deleteMovies = () => {
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
}

// Movie creation

const createMovie = (data, index) => {
    const movie = document.createElement('section');
    movie.classList.add('movie');
    main.appendChild(movie);

    const img = document.createElement('img');
    img.classList.add('cover');
    img.src = `https://image.tmdb.org/t/p/w1280${data.results[index].poster_path}`;
    img.alt = data.results[index].title;
    movie.appendChild(img);

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie-info');
    movie.appendChild(movieInfo);

    const movieTitle = document.createElement('h3');
    movieTitle.classList.add('movie-name');
    movieTitle.textContent = data.results[index].title;
    movieInfo.appendChild(movieTitle);

    const movieRating = document.createElement('span');
    movieRating.classList.add('movie-rating');
    movieRating.textContent = data.results[index].vote_average;
    changeRatingColor(data.results[index].vote_average, movieRating);
    movieInfo.appendChild(movieRating);

    const movieAdditionalInfo = document.createElement('div');
    movieAdditionalInfo.classList.add('movie-additional');
    movie.appendChild(movieAdditionalInfo);

    const  urlCredits = `https://api.themoviedb.org/3/movie/${data.results[index].id}/credits?api_key=6d4eabbdded91ebb031d80cbb3a592da&language=en-US`;

    async function getCrewMemberData(position) {
        const res = await fetch(urlCredits);
        const data = await res.json();
        
        const crewMembersName = crewMembersNamesToString(data, position);

        const positionTitle = crewMembersName.includes(',') ? (position + 's').toUpperCase() : position.toUpperCase();

        const crewMember = document.createElement('h3');
        crewMember.classList.add('additional-title');
        crewMember.textContent = `${positionTitle.toUpperCase()}: ${crewMembersName}`;
        movieAdditionalInfo.appendChild(crewMember);
    }  

    getCrewMemberData('Director');
    getCrewMemberData('Original Music Composer');
    
    const overviewTitle = document.createElement('h3');
    overviewTitle.classList.add('additional-title');
    overviewTitle.textContent = 'OVERVIEW';
    movieAdditionalInfo.appendChild(overviewTitle);

    const overviewContent = document.createElement('p');
    overviewContent.textContent = data.results[index].overview;
    movieAdditionalInfo.appendChild(overviewContent);
}

const changeRatingColor = (rating, element) => {
    if (rating <= 2.5) {
        element.style.color = 'brown';
    } else if (rating < 5) {
        element.style.color = 'red';
    } else if (rating < 7) {
        element.style.color = '#cacd00';
    } else {
        element.style.color = '#4cb41f';
    }
}

    
const crewMembersNamesToString = (data, position) => {
    let employees = [];

    for (let i = 0; i < data.crew.length; i++) {
        if (data.crew[i].job === position) {
            employees.push(data.crew[i].name);
        }
    }

    if (!employees.length) {
        return `not named`;
    } else if (!employees[1]) { // for some reason the length of the array is 1, even with two elements
        return employees[0];
    } else {
        return employees.join(', ');
    }
} 