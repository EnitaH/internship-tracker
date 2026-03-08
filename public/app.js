const statusFilter = document.getElementById("statusFilter");
const form = document.getElementById("internshipForm");
const internshipList = document.getElementById("internshipList");
const searchInput = document.getElementById("searchInput");
const sortFilter = document.getElementById("sortFilter");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const toast = document.getElementById("toast");
const formMessage = document.getElementById("formMessage");
const exportCsvBtn = document.getElementById("exportCsvBtn");

const totalCount = document.getElementById("totalCount");
const appliedCount = document.getElementById("appliedCount");
const interviewCount = document.getElementById("interviewCount");
const offerCount = document.getElementById("offerCount");
const rejectedCount = document.getElementById("rejectedCount");

let editingId = null;

cancelEditBtn.classList.add("hidden");

function clearFormMessage() {
  formMessage.textContent = "";
  formMessage.className = "form-message hidden";
}

function showFormError(message) {
  formMessage.textContent = message;
  formMessage.className = "form-message error";
}

function clearInputErrors() {
  document.getElementById("company").classList.remove("input-error");
  document.getElementById("role").classList.remove("input-error");
  document.getElementById("notes").classList.remove("input-error");
  document.getElementById("date_applied").classList.remove("input-error");
  document.getElementById("deadline").classList.remove("input-error");
}

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

let toastTimeout;

function showToast(message, type = "success") {
  clearTimeout(toastTimeout);

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  toastTimeout = setTimeout(() => {
    toast.className = "toast hidden";
  }, 2500);
}

function getDeadlineStatus(deadline) {
  if (!deadline) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "overdue";
  }

  if (diffDays <= 7) {
    return "due-soon";
  }

  return "normal";
}


function getDeadlineBadge(deadline) {
  const status = getDeadlineStatus(deadline);

  if (status === "overdue") {
    return `<span class="deadline-badge overdue">Overdue</span>`;
  }

  if (status === "due-soon") {
    return `<span class="deadline-badge due-soon">Due Soon</span>`;
  }

  return "";
}

function validateForm(internship) {
  clearFormMessage();
  clearInputErrors();

  const companyInput = document.getElementById("company");
  const roleInput = document.getElementById("role");
  const notesInput = document.getElementById("notes");
  const dateAppliedInput = document.getElementById("date_applied");
  const deadlineInput = document.getElementById("deadline");

  if (!internship.company || !internship.company.trim()) {
    companyInput.classList.add("input-error");
    showFormError("Company name is required.");
    return false;
  }

  if (internship.role.trim().length < 2) {
    roleInput.classList.add("input-error");
    showFormError("Role must be at least 2 characters long.");
    return false;
  }

  if (internship.notes.length > 300) {
    notesInput.classList.add("input-error");
    showFormError("Notes must be 300 characters or less.");
    return false;
  }

  if (internship.date_applied && internship.deadline) {
    const appliedDate = new Date(internship.date_applied);
    const deadlineDate = new Date(internship.deadline);

    if (deadlineDate < appliedDate) {
      dateAppliedInput.classList.add("input-error");
      deadlineInput.classList.add("input-error");
      showFormError("Application deadline cannot be earlier than the date applied.");
      return false;
    }
  }

  return true;
}
async function getFilteredAndSortedInternships() {
  const status = statusFilter ? statusFilter.value : "All";
  const search = searchInput ? searchInput.value.trim() : "";

  const res = await fetch(
    `/api/internships?status=${encodeURIComponent(status)}&search=${encodeURIComponent(search)}`
  );
  const data = await res.json();

  const sortValue = sortFilter ? sortFilter.value : "newest";

  if (sortValue === "oldest") {
    data.sort((a, b) => {
      const dateA = a.date_applied ? new Date(a.date_applied) : new Date(0);
      const dateB = b.date_applied ? new Date(b.date_applied) : new Date(0);
      return dateA - dateB;
    });
  } else if (sortValue === "az") {
    data.sort((a, b) => a.company.localeCompare(b.company));
  } else {
    data.sort((a, b) => {
      const dateA = a.date_applied ? new Date(a.date_applied) : new Date(0);
      const dateB = b.date_applied ? new Date(b.date_applied) : new Date(0);
      return dateB - dateA;
    });
  }

  return data;
}
    async function fetchInternships() {
  await updateStats();

  const data = await getFilteredAndSortedInternships();

  internshipList.innerHTML = "";

  if (data.length === 0) {
    internshipList.innerHTML = `<div class="empty-state">No applications yet.</div>`;
    return;
  }

  data.forEach(internship => {
    const deadlineStatus = getDeadlineStatus(internship.deadline);
    const deadlineBadge = getDeadlineBadge(internship.deadline);

    const div = document.createElement("div");
    div.classList.add("card");

    if (deadlineStatus === "overdue") {
      div.classList.add("card-overdue");
    }

    const statusClass = `status-${internship.status.toLowerCase()}`;

    div.innerHTML = `
      <h3>${internship.company}</h3>
      <p><strong>Role:</strong> ${internship.role}</p>
      <p><strong>Location:</strong> ${internship.location || "N/A"}</p>
      <p><strong>Date Applied:</strong> ${internship.date_applied || "N/A"}</p>
      <p><strong>Deadline:</strong> ${internship.deadline || "N/A"} ${deadlineBadge}</p>
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
          '${escapeSingleQuotes(internship.date_applied || "")}',
          '${escapeSingleQuotes(internship.deadline || "")}'
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

  internshipList.innerHTML = "";

  if (data.length === 0) {
    internshipList.innerHTML = `<div class="empty-state">No applications yet.</div>`;
    return;
  }

  data.forEach(internship => {
    const deadlineStatus = getDeadlineStatus(internship.deadline);
    const deadlineBadge = getDeadlineBadge(internship.deadline);

    const div = document.createElement("div");

    div.classList.add("card");
    if (deadlineStatus === "overdue") {
        div.classList.add("card-overdue");
    }

    const statusClass = `status-${internship.status.toLowerCase()}`;

div.innerHTML = `
  <h3>${internship.company}</h3>
  <p><strong>Role:</strong> ${internship.role}</p>
  <p><strong>Location:</strong> ${internship.location || "N/A"}</p>
  <p><strong>Date Applied:</strong> ${internship.date_applied || "N/A"}</p>
  <p><strong>Deadline:</strong> ${internship.deadline || "N/A"} ${deadlineBadge}</p>
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
      '${escapeSingleQuotes(internship.date_applied || "")}',
      '${escapeSingleQuotes(internship.deadline || "")}'
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

function escapeCsvValue(value) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function convertToCsv(data) {
  const headers = [
    "Company",
    "Role",
    "Status",
    "Location",
    "Date Applied",
    "Deadline",
    "Notes"
  ];

  const rows = data.map(item => [
    escapeCsvValue(item.company),
    escapeCsvValue(item.role),
    escapeCsvValue(item.status),
    escapeCsvValue(item.location || ""),
    escapeCsvValue(item.date_applied || ""),
    escapeCsvValue(item.deadline || ""),
    escapeCsvValue(item.notes || "")
  ]);

  return [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
}

function downloadCsv(filename, csvContent) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function escapeSingleQuotes(text) {
  return String(text).replace(/'/g, "\\'");
}

function editInternship(id, company, role, status, location, notes, date_applied, deadline) {
  editingId = id;

  document.getElementById("company").value = company;
  document.getElementById("role").value = role;
  document.getElementById("status").value = status;
  document.getElementById("location").value = location;
  document.getElementById("notes").value = notes;
  document.getElementById("date_applied").value = date_applied;
  document.getElementById("deadline").value = deadline;

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


  showToast("Internship deleted", "delete");
  fetchInternships();
}

function resetForm() {
  editingId = null;
  form.reset();
  form.querySelector("button[type='submit']").textContent = "Add Internship";

  cancelEditBtn.classList.add("hidden");
  clearFormMessage();
  clearInputErrors();
 }

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const internship = {
  company: document.getElementById("company").value.trim(),
  role: document.getElementById("role").value.trim(),
  status: document.getElementById("status").value,
  location: document.getElementById("location").value.trim(),
  notes: document.getElementById("notes").value.trim(),
  date_applied: document.getElementById("date_applied").value,
  deadline: document.getElementById("deadline").value
};

  if (!validateForm(internship)) {
  return;
    }

if (editingId) {
  await fetch(`/api/internships/${editingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(internship)
  });

  showToast("Internship updated", "info");
} else {
  await fetch("/api/internships", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(internship)
  });

  showToast("Internship added", "success");
}
  resetForm();
  fetchInternships();
});

if (cancelEditBtn) {
cancelEditBtn.addEventListener("click", () => {
  resetForm();
    });
}


fetchInternships();
if (exportCsvBtn) {
  exportCsvBtn.addEventListener("click", async () => {
    const data = await getFilteredAndSortedInternships();

    if (data.length === 0) {
      showToast("No internships to export", "info");
      return;
    }

    const csvContent = convertToCsv(data);
    downloadCsv("internships.csv", csvContent);
    showToast("CSV exported successfully", "success");
  });
}

if (statusFilter) {
  statusFilter.addEventListener("change", fetchInternships);
}

if (searchInput) {
  searchInput.addEventListener("input", fetchInternships);
}

if (sortFilter) {
  sortFilter.addEventListener("change", fetchInternships);
}