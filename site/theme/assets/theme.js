document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const applyTheme = (theme) => {
        body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('theme', theme);
    };

    const toggleTheme = () => {
        const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    };

    // Apply saved theme or system preference on initial load
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (systemPrefersDark) {
        applyTheme('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});
