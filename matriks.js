/**
 * KalkulatorMatriks
 * Sebuah objek yang berisi kumpulan fungsi untuk melakukan operasi matriks
 * berdasarkan materi yang telah dipelajari.
 * Matriks direpresentasikan sebagai array 2D (array di dalam array), contoh: [[1, 2], [3, 4]]
 */
const KalkulatorMatriks = {

    /**
     * Memeriksa apakah dua matriks memiliki ordo (dimensi) yang sama.
     * @param {number[][]} A - Matriks pertama.
     * @param {number[][]} B - Matriks kedua.
     * @returns {boolean} - True jika ordo sama.
     */
    _isOrdoSama(A, B) {
        return A.length === B.length && A[0].length === B[0].length;
    },

    /**
     * Memeriksa apakah matriks adalah matriks persegi.
     * @param {number[][]} A - Matriks.
     * @returns {boolean} - True jika matriks persegi.
     */
    _isPersegi(A) {
        return A.length === A[0].length;
    },

    /**
     * Penjumlahan dua matriks (A + B).
     * @param {number[][]} A - Matriks pertama.
     * @param {number[][]} B - Matriks kedua.
     * @returns {number[][]} - Matriks hasil penjumlahan.
     */
    tambah: function(A, B) {
        if (!this._isOrdoSama(A, B)) {
            throw new Error("Operasi tidak valid: Ordo kedua matriks harus sama untuk penjumlahan.");
        }
        const hasil = [];
        for (let i = 0; i < A.length; i++) {
            hasil[i] = [];
            for (let j = 0; j < A[0].length; j++) {
                hasil[i][j] = A[i][j] + B[i][j];
            }
        }
        return hasil;
    },

    /**
     * Transpos sebuah matriks (A').
     * Mengubah baris menjadi kolom dan sebaliknya.
     * @param {number[][]} A - Matriks yang akan ditranspos.
     * @returns {number[][]} - Matriks hasil transpos.
     */
    transpos: function(A) {
        const hasil = [];
        for (let j = 0; j < A[0].length; j++) {
            hasil[j] = [];
            for (let i = 0; i < A.length; i++) {
                hasil[j][i] = A[i][j];
            }
        }
        return hasil;
    },

    /**
     * Perkalian matriks dengan skalar (bilangan).
     * @param {number[][]} A - Matriks.
     * @param {number} skalar - Bilangan pengali.
     * @returns {number[][]} - Matriks hasil perkalian.
     */
    kaliSkalar: function(A, skalar) {
        const hasil = [];
        for (let i = 0; i < A.length; i++) {
            hasil[i] = [];
            for (let j = 0; j < A[0].length; j++) {
                hasil[i][j] = A[i][j] * skalar;
            }
        }
        return hasil;
    },

    /**
     * Perkalian dua matriks (A x B).
     * @param {number[][]} A - Matriks pertama.
     * @param {number[][]} B - Matriks kedua.
     * @returns {number[][]} - Matriks hasil perkalian.
     */
    kaliMatriks: function(A, B) {
        if (A[0].length !== B.length) {
            throw new Error("Operasi tidak valid: Jumlah kolom matriks A harus sama dengan jumlah baris matriks B.");
        }
        const hasil = new Array(A.length).fill(0).map(() => new Array(B[0].length).fill(0));
        for (let i = 0; i < A.length; i++) {
            for (let j = 0; j < B[0].length; j++) {
                for (let k = 0; k < A[0].length; k++) {
                    hasil[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return hasil;
    },

    /**
     * Menghitung determinan matriks persegi.
     * @param {number[][]} A - Matriks persegi.
     * @returns {number} - Nilai determinan.
     */
    determinan: function(A) {
        if (!this._isPersegi(A)) {
            throw new Error("Operasi tidak valid: Determinan hanya bisa dihitung pada matriks persegi.");
        }
        // Kasus basis: matriks 1x1
        if (A.length === 1) {
            return A[0][0];
        }
        // Kasus basis: matriks 2x2
        if (A.length === 2) {
            return A[0][0] * A[1][1] - A[0][1] * A[1][0];
        }
        // Kasus rekursif untuk ordo > 2 (menggunakan ekspansi kofaktor)
        let det = 0;
        for (let j = 0; j < A[0].length; j++) {
            const subMatriks = A.slice(1).map(baris => baris.filter((_, index) => index !== j));
            const tanda = (j % 2 === 0) ? 1 : -1;
            det += tanda * A[0][j] * this.determinan(subMatriks);
        }
        return det;
    },

    /**
     * Menghitung invers dari sebuah matriks.
     * @param {number[][]} A - Matriks yang akan diinvers.
     * @returns {number[][]} - Matriks invers.
     */
    invers: function(A) {
        const det = this.determinan(A);
        if (det === 0) {
            throw new Error("Matriks singular, tidak memiliki invers.");
        }
        
        // Kasus untuk matriks 2x2 (lebih sederhana)
        if (A.length === 2) {
            const adj = [
                [A[1][1], -A[0][1]],
                [-A[1][0], A[0][0]]
            ];
            return this.kaliSkalar(adj, 1 / det);
        }

        // Menghitung matriks kofaktor
        const kofaktor = [];
        for (let i = 0; i < A.length; i++) {
            kofaktor[i] = [];
            for (let j = 0; j < A.length; j++) {
                const subMatriks = A.filter((_, baris) => baris !== i).map(baris => baris.filter((_, kolom) => kolom !== j));
                const tanda = ((i + j) % 2 === 0) ? 1 : -1;
                kofaktor[i][j] = tanda * this.determinan(subMatriks);
            }
        }

        // Adjoint adalah transpos dari matriks kofaktor
        const adjoint = this.transpos(kofaktor);

        // Invers = (1/det) * Adjoint
        return this.kaliSkalar(adjoint, 1 / det);
    }
};


// --- SISTEM INPUT INTERAKTIF ---

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mulaiKalkulatorPerkalian() {
    console.log("\n--- Kalkulator Perkalian Matriks ---");
    
    rl.question('Masukkan ordo matriks A (baris spasi kolom): ', (ordoA) => {
        const [barisA, kolomA] = ordoA.split(' ').map(Number);

        // Validasi input ordo A
        if (isNaN(barisA) || isNaN(kolomA) || barisA <= 0 || kolomA <= 0) {
            console.error("Input tidak valid. Harap masukkan dua angka positif untuk baris dan kolom.");
            rl.close();
            return;
        }

        rl.question('Masukkan ordo matriks B (baris spasi kolom): ', (ordoB) => {
            const [barisB, kolomB] = ordoB.split(' ').map(Number);

            // Validasi input ordo B
            if (isNaN(barisB) || isNaN(kolomB) || barisB <= 0 || kolomB <= 0) {
                console.error("Input tidak valid. Harap masukkan dua angka positif untuk baris dan kolom.");
                rl.close();
                return;
            }

            // Validasi syarat perkalian matriks
            if (kolomA !== barisB) {
                console.error(`\nError: Perkalian matriks tidak dapat dilakukan.`);
                console.error(`Jumlah kolom Matriks A (${kolomA}) harus sama dengan jumlah baris Matriks B (${barisB}).`);
                rl.close();
                return;
            }

            console.log(`\nOrdo Matriks A: ${barisA}x${kolomA}`);
            console.log(`Ordo Matriks B: ${barisB}x${kolomB}`);
            console.log("Ordo valid untuk perkalian.");
            console.log("Langkah selanjutnya adalah menginput elemen untuk setiap matriks.");
            
            // Untuk saat ini, kita berhenti di sini sesuai permintaan.
            rl.close();
        });
    });
}

// Memulai program
mulaiKalkulatorPerkalian();
