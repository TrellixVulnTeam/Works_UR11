const slider = document.querySelector('.banner__container');
const slider1 = document.querySelector('.swiper-container1');
const slider2 = document.querySelector('.editions__container');
const slider3 = document.querySelector('.projects__container');
const slider4 = document.querySelector('.events__swiper');

let swiper = new Swiper(slider, {
    loop: true,

    spaceBetween: 30,
    effect: 'fade',
    centeredSlides: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    scrollbar: {
        el: '.swiper-scrollbar',
    },
})



let swiper1 = new Swiper(slider1, {
    loop: false,
    autoHeight: false,
    slidesPerView: 3,
    slidesPerColumn: 2,
    slidesPerGroup: 3,

    breakpoints: {
        1: {
            spaceBetween: 10,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerGroup: 1,
            pagination: {
                el: '.gallery__pagination',
                type: 'custom',
                renderCustom: function(swiper1, current, total) {
                    return current + ' / ' + total;
                }
            }
        },
        550: {
            slidesPerView: 2,
            slidesPerColumn: 2,
            slidesPerGroup: 2,
            spaceBetween: 34,
        },
        1024: {
            slidesPerView: 2,
            slidesPerColumn: 2,
            slidesPerGroup: 2,
            spaceBetween: 32,
            pagination: {
                el: '.gallery__pagination',
                type: 'custom',
                renderCustom: function(swiper1, current, total) {
                    return current + ' / ' + (total / 6);
                }
            }
        },
        1300: {
            slidesPerView: 3,
            slidesPerColumn: 2,
            slidesPerGroup: 3,
        }
    },

    spaceBetween: 40,

    pagination: {
        el: '.gallery__pagination',
        type: 'custom',
        renderCustom: function(swiper1, current, total) {
            return current + ' / ' + ('' + total / 2).slice(2);
        }
    },

    navigation: {
        nextEl: '.gallery__btn-next',
        prevEl: '.gallery__btn-prev',
    },
});

let swiper2 = new Swiper(slider2, {
    loop: false,
    autoHeight: false,
    slidesPerView: 3,
    slidesPerGroup: 1,

    breakpoints: {
        320: {},
        768: {
            slidesPerView: 2,
            slidesPerGroup: 1,
            spaceBetween: 36,
        },
        900: {
            slidesPerView: 2,
            slidesPerGroup: 1,
            spaceBetween: 42,
        },
        1501: {
            slidesPerView: 3,
            slidesPerGroup: 1,
            spaceBetween: 46,
        }
    },

    pagination: {
        el: '.editions__pagination',
        type: 'custom',
        renderCustom: function(swiper2, current, total) {
            return current + ' / ' + total;
        }
    },

    navigation: {
        nextEl: '.editions__btn-next',
        prevEl: '.editions__btn-prev',
    },
});



window.onresize = function(event) {
    if (window.innerWidth <= 700) {
        swiper2.destroy();
    }
};

window.onload = function(event) {
    if (window.innerWidth <= 700) {
        swiper2.destroy();
    }
};


let swiper3 = new Swiper(slider3, {
    loop: false,
    autoHeight: false,
    slidesPerView: 3,
    slidesPerGroup: 1,

    breakpoints: {
        320: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 20,
        },
        760: {
            slidesPerView: 2,
            slidesPerGroup: 1,
            spaceBetween: 32,
        },
        1024: {
            slidesPerView: 2,
            slidesPerGroup: 1,
            spaceBetween: 48,
        },
        1300: {
            slidesPerView: 3,
            slidesPerGroup: 1,
            spaceBetween: 50,
        }
    },

    navigation: {
        nextEl: '.projects__btn-next',
        prevEl: '.projects__btn-prev',
    },
});

let swiper4 = new Swiper(slider4, {
    spaceBetween: 10,
    pagination: {
        el: '.swiper-pagination',
    },
});