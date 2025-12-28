import { BASE_URL } from "./config.js"

document.getElementById("btnLogin").addEventListener("click", async () => {
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const error = document.getElementById("error")

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json()

    if (!res.ok) {
      error.textContent = "Username atau password salah"
      return
    }

    localStorage.setItem("token", data.token)
    window.location.href = "index.html"

  } catch {
    error.textContent = "Server tidak tersedia"
  }
})
