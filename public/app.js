const statusFilter = document.getElementById("statusFilter");
const form = document.getElementById("internshipForm");
const internshipList = document.getElementById("internshipList");
const searchInput = document.getElementById("searchInput");
const sortFilter = document.getElementById("sortFilter");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const totalCount = document.getElementById("totalCount");
const appliedCount = document.getElementById("appliedCount");
const interviewCount = document.getElementById("interviewCount");
const offerCount = document.getElementById("offerCount");
const rejectedCount = document.getElementById("rejectedCount");

let editingId = null;

cancelEditBtn.classList.add("hidden");

async function updateStats() {
  const res = await fetch("/api/internships");
  const data = await res.json();

  const total = data.length;
  const applied = data.filter(item => item.status === "Applied").length;
  const interview = data.filter(item => item.status === "Interview").length;
  const offer = data.filter(item => item.status === "Offer").length;
  const rejected = data.filter(item => item.status === "Rejected").length;

  totalCount.textContent = total;
  appliedCount.textContent = applied;
  interviewCount.textContent = interview;
  offerCount.textContent = offer;
  rejectedCount.textContent = rejected;
}

async function fetchInternships() {
  await updateStats();

  const status = statusFilter ? statusFilter.value : "All";
  const search = searchInput ? searchInput.value.trim() : "";

  const res = await fetch(
    `/api/internships?status=${encodeURIComponent(status)}&search=${encodeURIComponent(search)}`
  );
  const data = await res.json();

  const sortValue = sortFilter ? sortFilter.value : "newest";

  if (sortValue === "oldest") {
    data.sort((a, b) => a.id - b.id);
  } else if (sortValue === "az") {
    data.sort((a, b) => a.company.localeCompare(b.company));
  } else {
    data.sort((a, b) => b.id - a.id);
  }

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
  cancelEditBtn.classList.remove("hidden");

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
  cancelEditBtn.classList.add("hidden");
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

cancelEditBtn.addEventListener("click", () => {
  resetForm();
});



fetchInternships();

if (statusFilter) {
  statusFilter.addEventListener("change", fetchInternships);
}

if (searchInput) {
  searchInput.addEventListener("input", fetchInternships);
}

if (sortFilter) {
  sortFilter.addEventListener("change", fetchInternships);
}