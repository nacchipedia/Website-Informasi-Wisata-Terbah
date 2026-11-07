document.addEventListener('DOMContentLoaded', () => {

    // 1. Cari tombol Submit
    const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
    let submitBtn = null;

    for (let btn of buttons) {
        // Cek teks di dalam tombol atau nilai value-nya
        const teksTombol = btn.textContent || btn.value || "";
        if (teksTombol.trim().toLowerCase() === 'submit') {
            submitBtn = btn;
            break;
        }
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', async function (e) {
            e.preventDefault(); // Mencegah reload halaman

            // 2. Pencarian Kotak Input Super Fleksibel (Anti-Gagal)
            const allInputs = document.querySelectorAll('input, textarea');
            let textBox = null;

            for (let el of allInputs) {
                // Baca tipe inputannya
                const type = el.getAttribute('type') ? el.getAttribute('type').toLowerCase() : 'text';

                // Abaikan jika itu checkbox, tombol submit, atau radio button
                if (type !== 'checkbox' && type !== 'submit' && type !== 'button' && type !== 'radio') {
                    textBox = el; // Menangkap kotak ketikan pertama yang ditemukan
                    break;
                }
            }

            if (!textBox) {
                alert("Sistem masih tidak dapat mendeteksi kotak ketikan. Pastikan tag HTML Anda menggunakan <input> atau <textarea>.");
                return;
            }

            let pesan = textBox.value;
            let nama = "Anonim";
            let email = "-";

            // Validasi pesan kosong
            if (!pesan || pesan.trim() === "") {
                alert("Pesan saran tidak boleh kosong!");
                return;
            }

            // 3. Ubah teks tombol sementara (loading effect)
            const isInputTag = submitBtn.tagName.toLowerCase() === 'input';
            const originalText = isInputTag ? submitBtn.value : submitBtn.textContent;

            if (isInputTag) submitBtn.value = "Mengirim...";
            else submitBtn.textContent = "Mengirim...";

            submitBtn.style.opacity = "0.7";
            submitBtn.disabled = true;

            try {
                // 4. Kirim data ke API server (ke database)
                const response = await fetch('/api/saran', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nama, email, pesan })
                });

                const data = await response.json();

                if (data.success) {
                    alert("✅ Terima kasih! Masukan Anda telah tersimpan ke dalam database.");
                    textBox.value = ""; // Kosongkan form setelah sukses
                } else {
                    alert("❌ Gagal mengirim masukan.");
                }
            } catch (error) {
                alert("❌ Terjadi kesalahan pada server. Pastikan terminal (backend) Anda sedang berjalan.");
                console.error(error);
            } finally {
                // Kembalikan tombol ke keadaan semula
                if (isInputTag) submitBtn.value = originalText;
                else submitBtn.textContent = originalText;

                submitBtn.style.opacity = "1";
                submitBtn.disabled = false;
            }
        });
    }
});