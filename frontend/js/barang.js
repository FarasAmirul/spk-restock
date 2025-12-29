import { BASE_URL } from "./config.js";

const tabelBarang = document.getElementById("tabelBarang");
const formBarang = document.getElementById("formBarang");

function loadBarang() {
  fetch(`${BASE_URL}/barang`)
    .then(res => res.json())
    .then(data => {
      tabelBarang.innerHTML = "";

      data.forEach((b, i) => {
        tabelBarang.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${b.nama}</td>
            <td>${b.stok}</td>
            <td>${b.penjualan}</td>
            <td>${b.lead_time}</td>
            <td>${b.harga}</td>
            <td>
              <button 
                class="btn-danger" 
                data-id="${b.id}">
                Hapus
              </button>
            </td>
          </tr>
        `;
      });

      // 🔴 PASANG EVENT SETELAH HTML TERBENTUK
      document.querySelectorAll(".btn-danger").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          hapusBarang(id);
        });
      });
    });
}

formBarang.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    nama: nama.value,
    stok: stok.value,
    penjualan: penjualan.value,
    lead_time: lead_time.value,
    harga: harga.value
  };

  fetch(`${BASE_URL}/barang`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(() => {
    formBarang.reset();
    loadBarang();
  });
});

function hapusBarang(id) {
  if (!confirm("Hapus barang ini?")) return;

  fetch(`${BASE_URL}/barang/${id}`, {
    method: "DELETE"
  }).then(() => loadBarang());
}

loadBarang();
