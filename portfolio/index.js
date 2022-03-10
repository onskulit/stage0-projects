import i18Obj from './translate.js';

const hamburgerIcon = document.querySelector('.hamburger');
const navigation = document.querySelector('.nav-list');
const backdrop = document.querySelector('.backdrop');

const portfolioBtnsContainer = document.querySelector('.portfolio-buttons');
const portfolioBtns = document.querySelectorAll('.portfolio-button');
const portfolioImages = document.querySelectorAll('.portfolio-image');

const switchLngContainer = document.querySelector('.switch-lng');
const languages = document.querySelectorAll('.lng');

const switchThemeBtn = document.querySelector('.switch-theme'); 
const mainContainer = document.querySelector('main > .container');
const sectionTitle = document.querySelectorAll('.section-title');
const h2 = document.querySelectorAll('.section-title h2');
const lightThemeNodeLists = [sectionTitle, h2, portfolioBtns];

// adaptive menu creation

const closeHamburgerMenu = () => {
    hamburgerIcon.classList.remove('is-active');
    navigation.classList.remove('adaptive-menu');
    backdrop.classList.remove('active');
};

hamburgerIcon.addEventListener('click', () => {
    hamburgerIcon.classList.toggle('is-active');
    navigation.classList.toggle('adaptive-menu');
    backdrop.classList.toggle('active');
}); 

navigation.addEventListener('click', (event) => {
    if (event.target.classList.contains('nav-link')) {
        closeHamburgerMenu();
    }
});

backdrop.addEventListener('click', () => {
    closeHamburgerMenu();
});

// seasons changes in portfolio section

const removeGoldenBtn = () => {
    portfolioBtns.forEach((btn) => {
        if (btn.classList.contains('golden-button')) {
            btn.classList.remove('golden-button');
            btn.classList.add('empty-button');
        }
    });
};

const activateGoldenBtn = (target) => {
    target.classList.remove('empty-button');
    target.classList.add('golden-button');
}

portfolioBtnsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('portfolio-button')) {
        removeGoldenBtn();
        activateGoldenBtn(event.target);
        portfolioImages.forEach((img, index) => img.src = `./assets/img/${event.target.dataset.season}/${index + 1}.jpg`);
    }
});

const preloadImages = () => {
    const seasons = ['winter', 'spring', 'summer', 'autumn'];
    for (let season of seasons) {
        for(let i = 1; i <= 6; i++) {
            const img = new Image();
            img.src = `./assets/img/${season}/${i}.jpg`;
          }
    }
};

preloadImages();

// language change

const removeActiveLng = () => {
    languages.forEach((lng) => {
        if (lng.classList.contains('active')) {
            lng.classList.remove('active');
        }
    });
};

const activateLng = (target) => {
    target.classList.add('active');
};

const getTranslate = (lng) => {
    const translatableItems = document.querySelectorAll('[data-i18]');
    translatableItems.forEach((item) => {
        item.textContent = i18Obj[lng][item.dataset.i18];
    });
};

switchLngContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('lng')) {
        removeActiveLng();
        activateLng(event.target);
        getTranslate(event.target.dataset.lng);
    }
});

// theme change

const switchTheme = () => {
    mainContainer.classList.toggle('light-theme');
    for (let list of lightThemeNodeLists) {
        list.forEach((item) => {
            item.classList.toggle('light-theme');
        })
    }
}

switchThemeBtn.addEventListener('click', () => {
    switchThemeBtn.classList.toggle('active');
    switchTheme();
});
