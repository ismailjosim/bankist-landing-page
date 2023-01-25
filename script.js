'use strict';

///////////////////////////////////////
///////////// Modal window ///////////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// Navigation
const nav = document.querySelector('.nav');

// scroll btn
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

// tabs
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

// Sticky Navigation
const header = document.querySelector('.header');

// OPEN MODAL WINDOW CLASS
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
// CLOSE MODAL WINDOW
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// OPEN MODAL WINDOW
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Page smooth Navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//=============================================>
//=====================> Create Smooth Scrolling
// add event to the btn
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//======================================>
//=====================> Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause
  if (!clicked) return;
  // remove active class from tabs and content
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Active tab class
  clicked.classList.add('operations__tab--active');

  // Active content Area
  document
    .querySelector(`.operations__content--${ clicked.dataset.tab }`)
    .classList.add('operations__content--active');
});

//===================================================>
// Menu Fade animation: Except for the active nav-link
// event
const handlerHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    //add event
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handlerHover.bind(0.5));
nav.addEventListener('mouseout', handlerHover.bind(1));
//===================================================>
//================================> Sticky Navigation
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${ navHeight }px`,
});
headerObserver.observe(header);
//===================================================>
//==========================> Reveal sections

const allSection = document.querySelectorAll('.section');

// Reveal Section callback function
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  // gard class
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  // unobserve the observer
  observer.unobserve(entry.target);
};

// section Observer
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.25,
});

allSection.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
//===================================================>
//==========================> REVEAL ELEMENT ON SCROLL
const imgTargets = document.querySelectorAll('img[data-src]');

// CALLBACK FUNCTION
const loadImg = function (entries, observer) {
  const [entry] = entries;

  // Guard Class
  if (!entry.isIntersecting) return;

  // or: replace src to data-src
  entry.target.src = entry.target.dataset.src;

  // Remove lazy load class
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  // stop observing the images
  observer.unobserve(entry.target);
};

// Intersection Observer API
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

// looping
imgTargets.forEach(img => imgObserver.observe(img));

//===================================================>
//==========================> Slider
// All select element
const sliders = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  // current slide variable
  let currentSlide = 0;
  const maxSlide = slides.length;
  slides.forEach(
    (slide, index) => (slide.style.transform = `translateX(${ 100 * index }%)`)
  );
  const goToSlide = function (slid) {
    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${ 100 * (index - slid) }%)`)
    );
  };
  // dot Container Function
  const dotContainer = document.querySelector('.dots');

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `
      <button class="dots__dot" data-slide="${ i }"></button>`
      );
    });
  };

  // active dot function
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${ slide }"]`)
      .classList.add('dots__dot--active');
  };

  // btn next Slide function
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // btn previous Slide function
  const previousSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // CALL ALL FUNCTION INIT FUNCTION
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  //=================== ALL EVENT HANDLERS
  // btn: next slide
  btnRight.addEventListener('click', nextSlide);
  // btn: next slide
  btnLeft.addEventListener('click', previousSlide);

  // Key Event
  document.addEventListener('keydown', function (e) {
    // console.log(e);
    // if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') previousSlide();

    // short circuiting
    e.key === 'ArrowRight' && nextSlide();
  });

  // DOT EVENT BUTTON
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log('DOT');
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
sliders();
