// Année auto
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Menu mobile
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');

if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('hidden') === false;
        menuBtn.setAttribute('aria-expanded', String(isOpen));
    });
}

// Formulaire mailto
const form = document.getElementById('contactForm');
const msg = document.getElementById('formMsg');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = data.get('name');
        const email = data.get('email');
        const message = data.get('message');
        const subject = encodeURIComponent('Contact depuis MonSite');
        const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        // ⚠️ Remplace l’adresse ci-dessous par la tienne
        window.location.href = `mailto:leo.michard@gmail.com?subject=${subject}&body=${body}`;
        if (msg) msg.textContent = 'Ouverture de votre application mail…';
    });
}
console.log("Flow AI site active");
