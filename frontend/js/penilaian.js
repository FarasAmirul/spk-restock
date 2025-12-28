import { BASE_URL } from "./config.js";
function loadBarang() {
  fetch(`${BASE_URL}/barang`)
    .then(res => res.json())
    .then(data => {
      barang.innerHTML = '<option value="">Pilih Barang</option>';
      data.forEach(b => {
        barang.innerHTML += `<option value="${b.id}">${b.nama}</option>`;
      });
    });
}

function loadKriteria() {
  fetch(`${BASE_URL}/kriteria`)
    .then(res => res.json())
    .then(data => {
      kriteria.innerHTML = '<option value="">Pilih Kriteria</option>';
      data.forEach(k => {
        kriteria.innerHTML += `<option value="${k.id}">${k.kode} - ${k.nama}</option>`;
      });
    });
}

function loadNilai() {
  fetch(`${BASE_URL}/nilai`)
    .then(res => res.json())
    .then(data => {
      tabelPenilaian.innerHTML = "";
      data.forEach((n, i) => {
        tabelPenilaian.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${n.nama_barang}</td>
            <td>${n.nama_kriteria}</td>
            <td>${n.nilai}</td>
            <td>
              <button class="btn-danger" onclick="hapusNilai(${n.id})">
  Hapus
</button>

            </td>
          </tr>
        `;
      });
    });
}

formPenilaian.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    barang_id: barang.value,
    kriteria_id: kriteria.value,
    nilai: nilai.value
  };

  fetch(`${BASE_URL}/nilai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(() => {
    formPenilaian.reset();
    loadNilai();
  });
});

function hapusNilai(id) {
  fetch(`${BASE_URL}/nilai/${id}`, { method: "DELETE" })
    .then(() => loadNilai());
}

loadBarang();
loadKriteria();
loadNilai();
