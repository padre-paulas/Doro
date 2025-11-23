// Menu toggle functionality
const menuButton = document.getElementById('menu-button');
const menuDropdown = document.getElementById('menu-dropdown');

menuButton.addEventListener('click', function() {
    menuDropdown.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('#navbar')) {
        menuDropdown.classList.remove('active');
    }
});
