document.addEventListener("DOMContentLoaded", function() {
    let btn = document.querySelector('.events__button')
    btn.addEventListener('click', function(open) {
        let eve = document.querySelectorAll(".events__item");
        eve.forEach(function(item) {
            item.style.display = "flex";
        })
        document.querySelector('.events__button').style.display = 'none';
    });

    //кнопка показа ВСЕ

    let catList = document.querySelector('.editions__subname');

    catList.addEventListener('click', function(event) {
        let c = document.querySelectorAll('.editions__check');
        c.forEach(function(item) {
            item.classList.toggle("editions__hidden");
        })
    })

    // спойлер на 320 в Изданиях

});