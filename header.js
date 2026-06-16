document.addEventListener('DOMContentLoaded', function() {
    fetch('header.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load header');
            return response.text();
        })
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;

            // Highlight active nav link
            let currentPath = window.location.pathname.split('/').pop();
            if (currentPath === '' || currentPath === '/') {
                currentPath = 'index.html';
            }

            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Highlight Mobile Nav
            const mobileLinks = document.querySelectorAll('#mobile-menu a');
            mobileLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.className = "block py-3 text-base font-bold text-emerald-700 bg-emerald-50 rounded-lg px-3 transition-colors";
                } else {
                    link.className = "block py-3 text-base font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-lg px-3 transition-colors";
                }
            });

            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            if(mobileMenuBtn && mobileMenu) {
                mobileMenuBtn.addEventListener('click', () => {
                    mobileMenu.classList.toggle('open');
                });

                mobileMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        mobileMenu.classList.remove('open');
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
            const placeholder = document.getElementById('header-placeholder');
            if (placeholder) {
                placeholder.innerHTML = '<div style="padding:1rem;text-align:center;background:#f8fafc;border-bottom:1px solid #e2e8f0"><a href="index.html" style="color:#047857;font-weight:700">Zhonghua Secondary School</a></div>';
            }
        });
});
