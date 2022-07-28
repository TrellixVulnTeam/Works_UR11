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

    let catList = document.querySelector('.editions__subname'); // клик по названию списка

    catList.addEventListener('click', function(event) {
        let c = document.querySelectorAll('.editions__check'); // выбирает все label в списке
        c.forEach(function(item) {
            item.classList.toggle("editions__hidden"); //скрывает/открывает
            if (item.querySelector(".editions__checkitem").checked) // если инпут checked то не скрывает его
                item.classList.remove("editions__hidden");
        })
    })

    // спойлер на 320 в Изданиях

});