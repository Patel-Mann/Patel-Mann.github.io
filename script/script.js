    document.addEventListener('DOMContentLoaded', function() {
        const menuButton = document.querySelector('.menu-button');
        const closeButton = document.querySelector('.close-button');
        const overlayMenu = document.getElementById('overlay-menu');
        const navRight = document.querySelector('.nav-right');

        menuButton.addEventListener('click', function() {
            overlayMenu.classList.add('active');
        });

        closeButton.addEventListener('click', function() {
            overlayMenu.classList.remove('active');
        });
    });

    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const themeIcon = document.getElementById('theme-icon');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    window.addEventListener('load', () => {
        const theme = localStorage.getItem('theme');
        const themeIcon = document.getElementById('theme-icon');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
