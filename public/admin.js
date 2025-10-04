// Fetch and populate batches table
async function loadBatches() {
  try {
    const res = await fetch("/batches");
    const batches = await res.json();
    const tbody = document.getElementById("batchTable");
    tbody.innerHTML = "";

    batches.forEach(batch => {
      const tr = document.createElement("tr");

      // Ensure date is valid and formatted correctly
      const dateValue = batch.date
        ? new Date(batch.date).toISOString().split("T")[0]
        : "";

      tr.innerHTML = `
        <td>${batch.batch_no}</td>
        <td><input type="number" step="0.1" value="${batch.fat ?? ""}" data-id="${batch._id}" data-field="fat"></td>
        <td><input type="number" step="0.1" value="${batch.snf ?? ""}" data-id="${batch._id}" data-field="snf"></td>
        <td><input type="number" step="0.1" value="${batch.water ?? ""}" data-id="${batch._id}" data-field="water"></td>
        <td><input type="number" step="0.1" value="${batch.protein ?? ""}" data-id="${batch._id}" data-field="protein"></td>
        <td><input type="date" value="${dateValue}" data-id="${batch._id}" data-field="date"></td>
        <td>
          <button data-id="${batch._id}" class="updateBtn action-btn update-btn">Update</button>
          <button data-id="${batch._id}" class="deleteBtn action-btn delete-btn">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Attach event listeners safely
    tbody.querySelectorAll(".updateBtn").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        const row = e.target.closest("tr");

        const fat = row.querySelector('input[data-field="fat"]').value;
        const snf = row.querySelector('input[data-field="snf"]').value;
        const water = row.querySelector('input[data-field="water"]').value;
        const protein = row.querySelector('input[data-field="protein"]').value;
        const date = row.querySelector('input[data-field="date"]').value;

        await fetch(`/update-batch/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fat, snf, water, protein, date }),
        });

        loadBatches(); // reload table after update
      });
    });

    tbody.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        if (confirm("Are you sure you want to delete this batch?")) {
          await fetch(`/delete-batch/${id}`, { method: "POST" });
          loadBatches(); // reload table after delete
        }
      });
    });

  } catch (err) {
    console.error("Error loading batches:", err);
  }
}

// Fetch and populate phones table (if exists)
async function loadPhones() {
  const tbody = document.getElementById("phonesTable");
  if (!tbody) return; // skip if no phones table

  try {
    const res = await fetch("/phones");
    const phones = await res.json();
    tbody.innerHTML = "";

    phones.forEach(p => {
      const tr = document.createElement("tr");

      // Fallback if p.date is missing
      const dateStr = p.date ? new Date(p.date).toLocaleString() : "N/A";

      tr.innerHTML = `
        <td>${p.phoneNumber}</td>
        <td>${dateStr}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Error loading phones:", err);
  }
}

// Load tables on page load
window.addEventListener("DOMContentLoaded", () => {
  loadBatches();
  loadPhones();
});
