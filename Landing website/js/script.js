window.addEventListener('DOMContentLoaded', function() {
    let subMenu = document.querySelectorAll('.category-menu__link'); // Список всех кнопок с саб меню(хедер)
    let mobMenu = document.querySelector('.menu-button-mob'); // Кнопка бургер меню
    let mobClose = document.querySelector('.menu-close-mob'); // Кнопка закрытия меню бургера
    let autoClose = document.querySelectorAll('.menu-wrap__link'); // Ссылки в бургер меню
    let searchForm = document.querySelector('.search__button'); // Кнопка поиска
    let seacrhFormClose = document.querySelector('.menu-closeSearch-mob'); // Закрытие формы поиска

    /* Появление формы поиска */
    searchForm.addEventListener('click', function(event) {
        if (event.currentTarget.type == 'button') {
            event.preventDefault();
            event.currentTarget.type = 'submit';
        }
        document.querySelector('.search-mob').classList.toggle('search-mob_active');
        document.querySelector('.search__text').classList.toggle('search__text_active');
        document.querySelector('.menu-closeSearch-mob').classList.toggle('menu-closeSearch-mob_active');
    });

    /* Закрытие формы поиска */
    seacrhFormClose.addEventListener('click', function(event) {
        document.querySelector('.search-mob').classList.toggle('search-mob_active');
        document.querySelector('.search__text').classList.toggle('search__text_active');
        document.querySelector('.menu-closeSearch-mob').classList.toggle('menu-closeSearch-mob_active');
        searchForm.type = 'button';
    });

    /* Появление бургер меню */
    mobMenu.addEventListener('click', function(event) {
        document.querySelector('.menu-container').classList.toggle('menu-container_active');
    });

    /* Закрытие бургера */
    mobClose.addEventListener('click', function() {
        document.querySelector('.menu-container').classList.toggle('menu-container_active');
    });

    autoClose.forEach(function(item) {
        item.addEventListener('click', function(event) {
            document.querySelector('.menu-container').classList.toggle('menu-container_active');
        })
    })

    /* Саб меню */
    subMenu.forEach(function(item) {
        item.addEventListener('click', function(event) {
            if (document.querySelector('.category-menu__link_active')) {
                if (event.currentTarget.classList.contains('category-menu__link_active')) {
                    event.currentTarget.classList.toggle('category-menu__link_active');
                } else {
                    document.querySelector('.category-menu__link_active').classList.remove('category-menu__link_active');
                    event.currentTarget.classList.toggle('category-menu__link_active');
                }
            } else {
                event.currentTarget.classList.toggle('category-menu__link_active');
            }
        });
    });

    //Карта яндекса


    ymaps.ready(init);

    function init() {
        var myMap = new ymaps.Map("map", {
            center: [55.75846806898367, 37.60108849999989],
            zoom: 14,
            controls: [],
        });

        if (window.matchMedia("(max-width: 1024px)").matches) {
            myMap.behaviors
                .disable(['drag', 'scrollZoom']);
        }

        var geolocationControl = new ymaps.control.GeolocationControl({
            options: {
                position: {
                    bottom: "300px",
                    right: "13px"

                }
            }
        });

        myMap.controls.add(geolocationControl);

        var zoomControl = new ymaps.control.ZoomControl({
            options: {
                size: "small",

                position: {
                    bottom: "370px",
                    right: "25px"

                }
            }
        });
        myMap.controls.add(zoomControl);

        var myPlacemark = new ymaps.Placemark([55.75846806898367, 37.60108849999989], {}, {
            iconLayout: 'default#image',
            iconImageHref: 'img/point.svg',
            iconImageSize: [20, 20],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemark);

        if (window.matchMedia("(max-width: 760px)").matches) {
            var myMap = new ymaps.Map("map2", {
                center: [55.75846806898367, 37.60108849999989],
                zoom: 14,
                controls: [],
            });

            myMap.behaviors
                .disable(['drag', 'scrollZoom']);

            var geolocationControl = new ymaps.control.GeolocationControl({
                options: {
                    position: {
                        bottom: "300px",
                        right: "13px"

                    }
                }
            });

            myMap.controls.add(geolocationControl);

            var zoomControl = new ymaps.control.ZoomControl({
                options: {
                    size: "small",

                    position: {
                        bottom: "370px",
                        right: "25px"

                    }
                }
            });
            myMap.controls.add(zoomControl);

            var myPlacemark = new ymaps.Placemark([55.75846806898367, 37.60108849999989], {}, {
                iconLayout: 'default#image',
                iconImageHref: 'img/point.svg',
                iconImageSize: [20, 20],
                iconImageOffset: [-3, -42]
            });
            myMap.geoObjects.add(myPlacemark);
        }
    }

    //Форма валидации

    new JustValidate('.contacts__form', {
        rules: {
            name: {
                required: true,
                minLength: 2,
                maxLenght: 10
            },
            tel: {
                required: true,
            },
        },
        messages: {
            name: {
                minLength: 'Слишком короткое имя',
                maxLenght: 'Слишком длинное имя',
            },
            name: 'Укажите имя',
            tel: 'Укажите номер',
        },

        submitHandler: function(form, values, ajax) {

            ajax({
                url: 'http://blanch-blanch.tmweb.ru/send.php',
                method: 'POST',
                data: values,
                async: true,
                callback: function(response) {
                    alert('Запрос отправлен! \nСтатус отправки:' + response)
                },
                error: function(response) {
                    alert('AJAX submit error! \nResponse from server:' + response)
                }
            });
        },
    });

    var selector = document.querySelector("input[type='tel']");

    var im = new Inputmask("+7 (999)-999-99-99");
    im.mask(selector);

});