document.addEventListener('DOMContentLoaded', () => {
    // Ambil semua elemen interaktif dari DOM
    const selectOperasi = document.getElementById('operasi');
    const tombolBuatMatriks = document.getElementById('tombol-buat-matriks');
    const tombolHitung = document.getElementById('tombol-hitung');

    const containerA = document.getElementById('matriks-a-container');
    const barisAInput = document.getElementById('baris-a');
    const kolomAInput = document.getElementById('kolom-a');
    const gridA = document.getElementById('grid-a');

    const containerB = document.getElementById('matriks-b-container');
    const barisBInput = document.getElementById('baris-b');
    const kolomBInput = document.getElementById('kolom-b');
    const gridB = document.getElementById('grid-b');

    const areaHasil = document.getElementById('area-hasil');
    const outputHasil = document.getElementById('output-hasil');

    // --- FUNGSI HELPER ---

    /**
     * Membuat grid input matriks secara dinamis.
     * @param {number} rows - Jumlah baris.
     * @param {number} cols - Jumlah kolom.
     * @param {HTMLElement} container - Elemen div untuk menampung grid.
     */
    function buatGrid(rows, cols, container) {
        container.innerHTML = ''; // Kosongkan grid sebelumnya
        container.style.gridTemplateColumns = `repeat(${cols}, 60px)`;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = '0';
                input.dataset.baris = i;
                input.dataset.kolom = j;
                container.appendChild(input);
            }
        }
    }

    /**
     * Membaca nilai dari grid input dan mengubahnya menjadi array 2D.
     * @param {HTMLElement} gridContainer - Elemen div yang berisi input matriks.
     * @returns {number[][]} - Matriks dalam format array 2D.
     */
    function getMatrixFromGrid(gridContainer) {
        const rows = parseInt(gridContainer.parentElement.querySelector('input[id^="baris-"]').value);
        const cols = parseInt(gridContainer.parentElement.querySelector('input[id^="kolom-"]').value);
        const matriks = [];
        for (let i = 0; i < rows; i++) {
            matriks[i] = [];
            for (let j = 0; j < cols; j++) {
                const input = gridContainer.querySelector(`input[data-baris="${i}"][data-kolom="${j}"]`);
                matriks[i][j] = parseFloat(input.value) || 0; // Ambil nilai, atau 0 jika kosong
            }
        }
        return matriks;
    }

    /**
     * Menampilkan hasil perhitungan (matriks atau nilai) di area hasil.
     * @param {number[][] | number} hasil - Hasil perhitungan.
     */
    function displayResult(hasil) {
        outputHasil.innerHTML = ''; // Kosongkan hasil sebelumnya
        if (typeof hasil === 'number') {
            outputHasil.style.textAlign = 'center';
            outputHasil.textContent = hasil;
        } else if (Array.isArray(hasil)) {
            const table = document.createElement('table');
            hasil.forEach(rowData => {
                const tr = document.createElement('tr');
                rowData.forEach(cellData => {
                    const td = document.createElement('td');
                    // Tampilkan 2 angka desimal jika bukan integer
                    td.textContent = Number.isInteger(cellData) ? cellData : cellData.toFixed(2);
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });
            outputHasil.appendChild(table);
        }
        areaHasil.style.display = 'block';
    }

    /**
     * Menampilkan pesan error di area hasil.
     * @param {string} message - Pesan error.
     */
    function displayError(message) {
        outputHasil.innerHTML = `<span style="color: red;">${message}</span>`;
        areaHasil.style.display = 'block';
    }

    // --- EVENT LISTENERS & LOGIKA UTAMA ---

    function aturTampilanOperasi() {
        const operasi = selectOperasi.value;
        if (operasi === 'determinan' || operasi === 'invers' || operasi === 'transpos') {
            containerB.style.display = 'none';
        } else {
            containerB.style.display = 'block';
        }
        gridA.innerHTML = '';
        gridB.innerHTML = '';
        areaHasil.style.display = 'none';
        tombolHitung.disabled = true;
    }

    tombolBuatMatriks.addEventListener('click', () => {
        try {
            // Selalu bersihkan error lama setiap kali tombol ditekan
            areaHasil.style.display = 'none';
            outputHasil.innerHTML = '';

            const barisA = parseInt(barisAInput.value);
            const kolomA = parseInt(kolomAInput.value);
            const operasi = selectOperasi.value;

            if (isNaN(barisA) || isNaN(kolomA) || barisA < 1 || kolomA < 1) {
                throw new Error('Ordo Matriks A tidak valid.');
            }

            // VALIDASI BARU: Cek apakah operasi butuh matriks persegi
            if ((operasi === 'determinan' || operasi === 'invers') && barisA !== kolomA) {
                throw new Error(`Operasi '${operasi}' memerlukan matriks persegi. Jumlah baris (${barisA}) harus sama dengan jumlah kolom (${kolomA}).`);
            }

            buatGrid(barisA, kolomA, gridA);

            if (operasi !== 'determinan' && operasi !== 'invers' && operasi !== 'transpos') {
                const barisB = parseInt(barisBInput.value);
                const kolomB = parseInt(kolomBInput.value);
                if (isNaN(barisB) || isNaN(kolomB) || barisB < 1 || kolomB < 1) {
                    throw new Error('Ordo Matriks B tidak valid.');
                }
                buatGrid(barisB, kolomB, gridB);
            }
            tombolHitung.disabled = false;
        } catch (e) {
            displayError(e.message);
            tombolHitung.disabled = true;
        }
    });

    tombolHitung.addEventListener('click', () => {
        try {
            const operasi = selectOperasi.value;
            const matriksA = getMatrixFromGrid(gridA);
            let matriksB, hasil;

            // Validasi untuk operasi yang butuh matriks B
            if (operasi === 'tambah' || operasi === 'kurang' || operasi === 'kali') {
                matriksB = getMatrixFromGrid(gridB);
            }

            switch (operasi) {
                case 'tambah':
                    hasil = KalkulatorMatriks.tambah(matriksA, matriksB);
                    break;
                case 'kurang':
                    // Fungsi pengurangan belum ada, kita bisa buat dari fungsi tambah dan kaliSkalar
                    const negB = KalkulatorMatriks.kaliSkalar(matriksB, -1);
                    hasil = KalkulatorMatriks.tambah(matriksA, negB);
                    break;
                case 'kali':
                    hasil = KalkulatorMatriks.kaliMatriks(matriksA, matriksB);
                    break;
                case 'determinan':
                    hasil = KalkulatorMatriks.determinan(matriksA);
                    break;
                case 'invers':
                    hasil = KalkulatorMatriks.invers(matriksA);
                    break;
                case 'transpos':
                    hasil = KalkulatorMatriks.transpos(matriksA);
                    break;
                default:
                    throw new Error('Operasi tidak dikenal.');
            }
            displayResult(hasil);
        } catch (e) {
            displayError(e.message);
        }
    });

    selectOperasi.addEventListener('change', aturTampilanOperasi);

    aturTampilanOperasi(); // Panggil di awal
});
