const statusFilter = document.getElementById("statusFilter");
const form = document.getElementById("internshipForm");
const internshipList = document.getElementById("internshipList");

let editingId = null;

async function fetchInternships() {
const status = statusFilter ? statusFilter.value : "All";
const res = await fetch(`/api/internships?status=${status}`);
  
  const data = await res.json();

  internshipList.innerHTML = "";

  if (data.length === 0) {
    internshipList.innerHTML = `<div class="empty-state">No applications yet.</div>`;
    return;
  }

  data.forEach(internship => {
    const div = document.createElement("div");
    div.classList.add("card");

    const statusClass = `status-${internship.status.toLowerCase()}`;

    div.innerHTML = `
      <h3>${internship.company}</h3>
      <p><strong>Role:</strong> ${internship.role}</p>
      <p><strong>Location:</strong> ${internship.location || "N/A"}</p>
      <p><strong>Date:</strong> ${internship.date_applied || "N/A"}</p>
      <p>${internship.notes || ""}</p>

      <span class="status-badge ${statusClass}">
        ${internship.status}
      </span>

      <div class="card-actions">
        <button class="edit-btn" onclick="editInternship(
          ${internship.id},
          '${escapeSingleQuotes(internship.company)}',
          '${escapeSingleQuotes(internship.role)}',
          '${escapeSingleQuotes(internship.status)}',
          '${escapeSingleQuotes(internship.location || "")}',
          '${escapeSingleQuotes(internship.notes || "")}',
          '${escapeSingleQuotes(internship.date_applied || "")}'
        )">
          Edit
        </button>

        <button class="delete-btn" onclick="deleteInternship(${internship.id})">
          Delete
        </button>
      </div>
    `;

    internshipList.appendChild(div);
  });
}

function escapeSingleQuotes(text) {
  return String(text).replace(/'/g, "\\'");
}

function editInternship(id, company, role, status, location, notes, date_applied) {
  editingId = id;

  document.getElementById("company").value = company;
  document.getElementById("role").value = role;
  document.getElementById("status").value = status;
  document.getElementById("location").value = location;
  document.getElementById("notes").value = notes;
  document.getElementById("date_applied").value = date_applied;

  form.querySelector("button[type='submit']").textContent = "Update Internship";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteInternship(id) {
  await fetch(`/api/internships/${id}`, {
    method: "DELETE"
  });

  if (editingId === id) {
    resetForm();
  }

  fetchInternships();
}

function resetForm() {
  editingId = null;
  form.reset();
  form.querySelector("button[type='submit']").textContent = "Add Internship";
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

  if (editingId) {
    await fetch(`/api/internships/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(internship)
    });
  } else {
    await fetch("/api/internships", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(internship)
    });
  }

  resetForm();
  fetchInternships();
});

fetchInternships();
if (statusFilter) {
  statusFilter.addEventListener("change", fetchInternships);
}