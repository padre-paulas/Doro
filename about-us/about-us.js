document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menu-button');
    const menuDropdown = document.getElementById('menu-dropdown');

    if (menuButton && menuDropdown) {
        menuButton.addEventListener('click', function() {
            menuDropdown.classList.toggle('active');
        });

        document.addEventListener('click', function(event) {
            if (!event.target.closest('#navbar')) {
                menuDropdown.classList.remove('active');
            }
        });
    }

    const streakButton = document.getElementById('streak-button');
    const streakModal = document.getElementById('streak-modal');
    const modalClose = document.querySelector('.modal-close');

    if (streakButton && streakModal && modalClose) {
        streakButton.addEventListener('click', function(event) {
            event.preventDefault();
            streakModal.classList.add('active');
        });

        modalClose.addEventListener('click', function() {
            streakModal.classList.remove('active');
        });

        streakModal.addEventListener('click', function(event) {
            if (event.target === streakModal) {
                streakModal.classList.remove('active');
            }
        });
    }
});
