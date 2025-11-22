async function makeMod() {
  const requester = localStorage.getItem("nickname");
  const target = document.getElementById("modname").value;
  const res = await fetch("/make-mod", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requester, target })
  });
  const data = await res.json();
  alert(data.success ? "Mod ernannt!" : data.message);
}

async function banUser() {
  const requester = localStorage.getItem("nickname");
  const target = document.getElementById("banname").value;
  const res = await fetch("/ban-user", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requester, target })
  });
  const data = await res.json();
  alert(data.success ? "Nutzer gesperrt!" : data.message);
}

async function fetchLists() {
  const res = await fetch("/admin-info");
  const data = await res.json();

  const userList = document.getElementById("userList");
  const bannedList = document.getElementById("bannedList");

  userList.innerHTML = "";
  bannedList.innerHTML = "";

  for (const [name, role] of Object.entries(data.users)) {
    const li = document.createElement("li");
    li.textContent = `${name} (${role})`;
    userList.appendChild(li);
  }

  for (const name of data.banned) {
    const li = document.createElement("li");
    li.textContent = name;
    bannedList.appendChild(li);
  }
}

fetchLists();
