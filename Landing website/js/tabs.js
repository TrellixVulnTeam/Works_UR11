document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".catalog__btn").forEach(function(catalogBtn) {
        catalogBtn.addEventListener("click", function(event) {
            const path = event.currentTarget.dataset.path;

            document.querySelectorAll(".catalog__right").forEach(function(workTab) {
                workTab.classList.remove("catalog__active");
            });
            document.querySelector(`[data-target='${path}']`).classList.add("catalog__active");
        });
    });

    document.querySelectorAll(".catalog__link").forEach(function(catalogBtn) {
        catalogBtn.addEventListener("click", function(event) {
            const path = event.currentTarget.dataset.path;

            document.querySelectorAll(".catalog__left").forEach(function(workTab) {
                workTab.classList.remove("catalog__active");
            });
            document.querySelector(`[data-target='${path}']`).classList.add("catalog__active");
        });
    });
});