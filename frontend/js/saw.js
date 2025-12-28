import { BASE_URL } from "./config.js";

const btnHitung = document.getElementById("btnHitung");
const tabelHasil = document.getElementById("tabelHasil");
const tabelNormalisasi = document.getElementById("tabelNormalisasi");

// ===============================
// RENDER NORMALISASI
// ===============================
function renderNormalisasi(data) {
  tabelNormalisasi.innerHTML = "";

  data.forEach(b => {
    tabelNormalisasi.innerHTML += `
      <tr>
        <td>${b.nama}</td>
        <td>${b.nilai["Stok Barang"]}</td>
        <td>${b.nilai["Penjualan"]}</td>
        <td>${b.nilai["Lead Time"]}</td>
        <td>${b.nilai["Harga"]}</td>
      </tr>
    `;
  });
}

// ===============================
// RENDER HASIL SAW
// ===============================
function renderHasil(data) {
  tabelHasil.innerHTML = "";

  data.forEach(item => {
    tabelHasil.innerHTML += `
      <tr>
        <td>${item.ranking}</td>
        <td>${item.nama}</td>
        <td>${item.nilai_preferensi}</td>
      </tr>
    `;
  });
}

// ===============================
// EVENT BUTTON (FIX FINAL)
// ===============================
btnHitung.addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Silakan login terlebih dahulu");
      window.location.href = "login.html";
      return;
    }

    const res = await fetch(`${BASE_URL}/saw`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    const data = await res.json();

    renderHasil(data.hasil);

    // Normalisasi OPTIONAL (jika backend kirim)
    if (data.normalisasi) {
      renderNormalisasi(data.normalisasi);
    }

  } catch (error) {
    console.error(error);
    alert("Akses ditolak. Silakan login ulang.");
    window.location.href = "login.html";
  }
});
