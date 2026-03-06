const form = document.getElementById("internshipForm");
const internshipList = document.getElementById("internshipList");

async function fetchInternships() {
  const res = await fetch("/api/internships");
  const data = await res.json();

  internshipList.innerHTML = "";

  data.forEach(internship => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <h3>${internship.company}</h3>
      <p><strong>Role:</strong> ${internship.role}</p>
      <p><strong>Status:</strong> ${internship.status}</p>
      <p><strong>Location:</strong> ${internship.location || "N/A"}</p>
      <p><strong>Date:</strong> ${internship.date_applied || "N/A"}</p>
      <p>${internship.notes || ""}</p>
    `;

    internshipList.appendChild(div);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const internship = {
    company: document.getElementById("company").value,
    role: document.getElementById("role").value,
    status: document.getElementById("status").value,
    location: document.getElementById("location").value,
    notes: document.getElementById("notes").value,
    date_applied: document.getElementById("date_applied").value
  };

  await fetch("/api/internships", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(internship)
  });

  form.reset();
  fetchInternships();
});

fetchInternships();