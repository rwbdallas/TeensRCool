async function login() {
  const nickname = document.getElementById("nickname").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, password })
  });

  const data = await res.json();
  if (data.success) {
    localStorage.setItem("nickname", nickname);
    window.location.href = "/chat.html";
  } else {
    document.getElementById("login-error").innerText = data.message;
  }
}
