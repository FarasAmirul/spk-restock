import { BASE_URL } from "./config.js";

const tabelKriteria = document.getElementById("tabelKriteria");
const formKriteria = document.getElementById("formKriteria");

function loadKriteria() {
  fetch(`${BASE_URL}/kriteria`)
    .then(res => res.json())
    .then(data => {
      tabelKriteria.innerHTML = "";

      data.forEach((k, i) => {
        tabelKriteria.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${k.kode}</td>
            <td>${k.nama}</td>
            <td>${k.bobot}</td>
            <td>${k.atribut}</td>
            <td>
              <button class="btn-danger" data-id="${k.id}">
                Hapus
              </button>
            </td>
          </tr>
        `;
      });

      // 🔴 EVENT HAPUS
      document.querySelectorAll(".btn-danger").forEach(btn => {
        btn.addEventListener("click", () => {
          hapusKriteria(btn.dataset.id);
        });
      });
    });
}

formKriteria.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    kode: kode.value,
    nama: nama.value,
    bobot: bobot.value,
    atribut: atribut.value
  };

  fetch(`${BASE_URL}/kriteria`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(() => {
    formKriteria.reset();
    loadKriteria();
  });
});

function hapusKriteria(id) {
  if (!confirm("Hapus kriteria ini?")) return;

  fetch(`${BASE_URL}/kriteria/${id}`, {
    method: "DELETE"
  }).then(() => loadKriteria());
}

loadKriteria();
