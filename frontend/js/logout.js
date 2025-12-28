export function logout() {
  if (confirm("Yakin ingin logout?")) {
    localStorage.removeItem("token")
    window.location.href = "login.html"
  }
}
