document.addEventListener("DOMContentLoaded", function () {
    const navbarItems = document.querySelectorAll('.navbar .nav-item');

    navbarItems.forEach(item => {
        item.addEventListener('click', function () {
            navbarItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 10) {
        navbar.classList.add("sticky");
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("sticky");
        navbar.classList.remove("scrolled");
    }
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

window.onscroll = function () { showScrollButton() };

function showScrollButton() {
    let scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

document.getElementById("scrollToTopBtn").onclick = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ==========================================
// KODE UNTUK RENDER GALERI DINAMIS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Memastikan elemen gallery-container ada di halaman ini
    const galleryContainer = document.getElementById('gallery-container');
    if (galleryContainer) {
        fetchGalleries();
    }
});

async function fetchGalleries() {
    try {
        // Memanggil API GET dari Node.js (server.js)
        const response = await fetch('/api/galleries');
        const galleries = await response.json();

        const container = document.getElementById('gallery-container');

        // Bersihkan teks tulisan "Memuat galeri dari database..."
        container.innerHTML = '';

        // Jika database masih kosong
        if (galleries.length === 0) {
            container.innerHTML = '<p style="color: white; text-align: center; width: 100%;">Belum ada foto galeri.</p>';
            return;
        }

        // Loop (ulang) setiap data dari database dan rakit menjadi HTML
        galleries.forEach(item => {
            const cardHTML = `
            <div class="card">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path>
              </svg>
              <img src="${item.imageUrl}" class="image-nd" alt="${item.title}">
              <div class="card__content">
                <p class="card__title">${item.title}</p>
                <p class="card__description">${item.description}</p>
              </div>
            </div>`;

            // Masukkan elemen card yang sudah dirakit ke dalam container
            container.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error("Gagal mengambil data galeri:", error);
        document.getElementById('gallery-container').innerHTML = '<p style="color: red; text-align: center; width: 100%;">Gagal memuat galeri wisata dari server.</p>';
    }
}