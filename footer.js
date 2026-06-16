document.addEventListener("DOMContentLoaded", function () {
    fetch("footer.html")
        .then(response => {
            if (!response.ok) throw new Error("Failed to load footer");
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById("footer-placeholder");
            if (placeholder) {
                placeholder.outerHTML = data;
            }
        })
        .catch(error => {
            console.error("Error loading footer:", error);
            const placeholder = document.getElementById("footer-placeholder");
            if (placeholder) {
                placeholder.innerHTML = '<div style="padding:2rem 1rem;text-align:center;background:#0f172a;color:#94a3b8;font-size:0.75rem">&copy; 2026 Zhonghua Secondary School</div>';
            }
        });

    const backToTopBtn = document.createElement("button");
    backToTopBtn.innerHTML = "↑";
    backToTopBtn.className = "fixed bottom-8 right-8 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center text-xl font-bold opacity-0 pointer-events-none transition-all duration-300 hover:bg-emerald-700 hover:-translate-y-1 z-50 cursor-pointer border-2 border-white/20";
    backToTopBtn.setAttribute("aria-label", "Back to top");
    backToTopBtn.style.bottom = "2rem";
    backToTopBtn.style.right = "2rem";
    document.body.appendChild(backToTopBtn);

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.remove("opacity-0", "pointer-events-none");
            backToTopBtn.classList.add("opacity-100");
        } else {
            backToTopBtn.classList.remove("opacity-100");
            backToTopBtn.classList.add("opacity-0", "pointer-events-none");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
