document.addEventListener("DOMContentLoaded", function () {
    const pekerjaToggle = document.getElementById("pekerjaToggle");
    const pekerjaSubmenu = document.getElementById("pekerjaSubmenu");
    const dashboardLink = document.getElementById("dashboardLink");
    const absensiLink = document.getElementById("absensiLink");
    const kehadiranLink = document.getElementById("kehadiranLink");
    const pengupahanLink = document.getElementById("pengupahanLink");
    const materialLink = document.getElementById("materialLink");
    const progressLink = document.getElementById("progressLink");
    const laporanLink = document.getElementById("laporanLink");

    const dashboardSection = document.getElementById("dashboardSection");
    const absensiSection = document.getElementById("absensiSection");
    const kehadiranSection = document.getElementById("kehadiranSection");
    const pengupahanSection = document.getElementById("pengupahanSection");
    const materialSection = document.getElementById("materialSection");
    const progressSection = document.getElementById("progressSection");
    const laporanSection = document.getElementById("laporanSection");

    const attendanceForm = document.getElementById("attendanceForm");
    const workerNameInput = document.getElementById("workerName");
    const attendanceRecordDateInput = document.getElementById("attendanceRecordDate");
    const attendanceStatusInput = document.getElementById("attendanceStatus");
    const attendanceSalaryInput = document.getElementById("attendanceSalary");
    const attendanceSubmitButton = document.getElementById("attendanceSubmitButton");
    const editCancelButton = document.getElementById("editCancelButton");
    const attendanceTableBody = document.getElementById("attendanceTableBody");
    const attendanceSummaryBody = document.getElementById("attendanceSummaryBody");
    const pengupahanSummaryBody = document.getElementById("pengupahanSummaryBody");
    const countHadir = document.getElementById("countHadir");
    const countIzin = document.getElementById("countIzin");
    const countSakit = document.getElementById("countSakit");
    const countAlpha = document.getElementById("countAlpha");
    const totalPaidOutput = document.getElementById("totalPaid");
    const totalDueOutput = document.getElementById("totalDue");
    const totalPengeluaranOutput = document.getElementById("pengeluaran");
    const materialCardValue = document.getElementById("material");
    const materialForm = document.getElementById("materialForm");
    const materialNameInput = document.getElementById("materialName");
    const materialDescriptionInput = document.getElementById("materialDescription");
    const materialPriceInput = document.getElementById("materialPrice");
    const materialTableBody = document.getElementById("materialTableBody");
    const dashboardMaterialBody = document.getElementById("dashboardMaterialBody");
    const progressForm = document.getElementById("progressForm");
    const progressNameInput = document.getElementById("progressName");
    const progressDescriptionInput = document.getElementById("progressDescription");
    const progressPercentInput = document.getElementById("progressPercent");
    const progressSubmitButton = document.getElementById("progressSubmitButton");
    const progressCancelButton = document.getElementById("progressCancelButton");
    const progressTableBody = document.getElementById("progressTableBody");
    const activityTableBody = document.getElementById("activityTableBody");
    const laporanTableBody = document.getElementById("laporanTableBody");
    const exportLaporanButton = document.getElementById("exportLaporanButton");
    const upahTable = document.getElementById("upahTable");

    const sections = {
        dashboard: dashboardSection,
        absensi: absensiSection,
        kehadiran: kehadiranSection,
        pengupahan: pengupahanSection,
        material: materialSection,
        progress: progressSection,
        laporan: laporanSection,
    };

    const linkMap = {
        dashboard: dashboardLink,
        absensi: absensiLink,
        kehadiran: kehadiranLink,
        pengupahan: pengupahanLink,
        material: materialLink,
        progress: progressLink,
        laporan: laporanLink,
    };

    // ====== LOCAL STORAGE FUNCTIONS ======
    function loadDataFromStorage() {
        attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
        materialRecords = JSON.parse(localStorage.getItem('materialRecords')) || [];
        progressRecords = JSON.parse(localStorage.getItem('progressRecords')) || [];
    }

    function saveToStorage() {
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        localStorage.setItem('materialRecords', JSON.stringify(materialRecords));
        localStorage.setItem('progressRecords', JSON.stringify(progressRecords));
    }

    // Load data dari storage saat page load
    let attendanceRecords = [];
    let materialRecords = [];
    let progressRecords = [];
    loadDataFromStorage();

    let editingIndex = null;
    let progressEditingIndex = null;

    if (!pekerjaToggle || !pekerjaSubmenu) {
        return;
    }

    pekerjaToggle.addEventListener("click", function (event) {
        event.preventDefault();
        pekerjaSubmenu.classList.toggle("show");
        pekerjaSubmenu.classList.toggle("collapsed");

        const icon = pekerjaToggle.querySelector(".submenu-icon");
        if (icon) {
            icon.classList.toggle("fa-chevron-down");
            icon.classList.toggle("fa-chevron-up");
        }
    });

    function showSection(sectionKey) {
        Object.keys(sections).forEach((key) => {
            if (!sections[key]) {
                return;
            }
            sections[key].classList.toggle("d-none", key !== sectionKey);
        });

        Object.values(linkMap).forEach((link) => {
            if (link) {
                link.classList.remove("active-menu");
            }
        });

        if (linkMap[sectionKey]) {
            linkMap[sectionKey].classList.add("active-menu");
        }
    }

    function renderAttendanceTable() {
        if (attendanceRecords.length === 0) {
            attendanceTableBody.innerHTML = "<tr><td colspan=\"5\" class=\"text-center text-muted\">Belum ada data absensi.</td></tr>";
            return;
        }

        attendanceTableBody.innerHTML = attendanceRecords
            .map((record, index) => {
                return `
                    <tr>
                        <td>${record.name}</td>
                        <td>${record.status}</td>
                        <td>Rp${record.salary.toLocaleString('id-ID')}</td>
                        <td>${record.date}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-outline-primary edit-attendance-btn" data-index="${index}">Edit</button>
                        </td>
                    </tr>
                `;
            })
            .join("");
    }

    function renderKehadiranSection() {
        const counts = { Hadir: 0, Izin: 0, Sakit: 0, Alpha: 0 };
        attendanceRecords.forEach((record) => {
            if (counts[record.status] !== undefined) {
                counts[record.status] += 1;
            }
        });

        countHadir.textContent = counts.Hadir;
        countIzin.textContent = counts.Izin;
        countSakit.textContent = counts.Sakit;
        countAlpha.textContent = counts.Alpha;

        if (attendanceRecords.length === 0) {
            attendanceSummaryBody.innerHTML = "<tr><td colspan=\"3\" class=\"text-center text-muted\">Belum ada data kehadiran.</td></tr>";
            return;
        }

        attendanceSummaryBody.innerHTML = attendanceRecords
            .map((record) => {
                return `<tr><td>${record.name}</td><td>${record.status}</td><td>${record.date}</td></tr>`;
            })
            .join("");
    }

    function renderPayrollSummary() {
        const payroll = {};
        attendanceRecords.forEach((record) => {
            const name = record.name.trim();
            if (!payroll[name]) {
                payroll[name] = {
                    name,
                    totalSalary: 0,
                    totalPaid: 0,
                    totalDue: 0,
                    sessions: 0,
                };
            }
            payroll[name].totalSalary += Number(record.salary) || 0;
            payroll[name].sessions += 1;
            if (record.paid) {
                payroll[name].totalPaid += Number(record.salary) || 0;
            } else {
                payroll[name].totalDue += Number(record.salary) || 0;
            }
        });

        const rows = Object.values(payroll);
        const dashboardRows = rows.length
            ? rows
                  .map((item) => {
                      const status = item.totalDue === 0 ? "Lunas" : item.totalPaid === 0 ? "Belum Bayar" : "Proses";
                      const badgeClass = item.totalDue === 0 ? "badge bg-success" : item.totalPaid === 0 ? "badge bg-danger" : "badge bg-warning text-dark";
                      return `
                        <tr>
                            <td>${item.name}</td>
                            <td>Rp${item.totalSalary.toLocaleString("id-ID")}</td>
                            <td><span class="${badgeClass}">${status}</span></td>
                        </tr>`;
                  })
                  .join("")
            : "<tr><td colspan=\"3\" class=\"text-center text-muted\">Belum ada data pengupahan.</td></tr>";

        const pengupahanRows = rows.length
            ? rows
                  .map((item) => {
                      const status = item.totalDue === 0 ? "Lunas" : item.totalPaid === 0 ? "Belum Bayar" : "Proses";
                      const badgeClass = item.totalDue === 0 ? "badge bg-success" : item.totalPaid === 0 ? "badge bg-danger" : "badge bg-warning text-dark";
                      const nextPaidState = item.totalDue === 0 ? "false" : "true";
                      const actionLabel = item.totalDue === 0 ? "Tandai Belum Bayar" : "Tandai Lunas";
                      return `
                        <tr>
                            <td>${item.name}</td>
                            <td>Rp${item.totalSalary.toLocaleString("id-ID")}</td>
                            <td>Rp${item.totalPaid.toLocaleString("id-ID")}</td>
                            <td>Rp${item.totalDue.toLocaleString("id-ID")}</td>
                            <td><span class="${badgeClass}">${status}</span></td>
                            <td>
                                <button type="button" class="btn btn-sm btn-outline-primary toggle-payment-btn" data-name="${item.name.trim().toLowerCase()}" data-pay="${nextPaidState}">${actionLabel}</button>
                            </td>
                        </tr>`;
                  })
                  .join("")
            : "<tr><td colspan=\"6\" class=\"text-center text-muted\">Belum ada data pengupahan.</td></tr>";

        if (upahTable) {
            const upahBody = upahTable.querySelector("tbody");
            if (upahBody) {
                upahBody.innerHTML = dashboardRows;
            }
        }

        if (pengupahanSummaryBody) {
            pengupahanSummaryBody.innerHTML = pengupahanRows;
        }

        renderDashboardTotals(rows);
    }

    function renderDashboardTotals(rows) {
        const totalPaid = rows.reduce((sum, item) => sum + item.totalPaid, 0);
        const totalDue = rows.reduce((sum, item) => sum + item.totalDue, 0);
        const totalSalary = rows.reduce((sum, item) => sum + item.totalSalary, 0);
        const totalMaterial = materialRecords.reduce((sum, item) => sum + item.price, 0);
        const totalPengeluaran = totalSalary + totalMaterial;

        if (totalPaidOutput) {
            totalPaidOutput.textContent = `Rp${totalPaid.toLocaleString("id-ID")}`;
        }
        if (totalDueOutput) {
            totalDueOutput.textContent = `Rp${totalDue.toLocaleString("id-ID")}`;
        }
        if (totalPengeluaranOutput) {
            totalPengeluaranOutput.textContent = `Rp${totalPengeluaran.toLocaleString("id-ID")}`;
        }
        const upahValue = document.getElementById("upah");
        if (upahValue) {
            upahValue.textContent = `Rp${totalSalary.toLocaleString("id-ID")}`;
        }
        renderLaporanTable();
    }


    function setDefaultDate() {
        const today = new Date();
        const dateValue = today.toISOString().slice(0, 10);
        if (attendanceRecordDateInput) {
            attendanceRecordDateInput.value = dateValue;
        }
    }

    function resetAttendanceForm() {
        attendanceForm.reset();
        if (attendanceRecordDateInput) {
            attendanceRecordDateInput.value = new Date().toISOString().slice(0, 10);
        }
        if (attendanceSalaryInput) {
            attendanceSalaryInput.value = "";
        }
        attendanceStatusInput.value = "Hadir";
        attendanceSubmitButton.textContent = "Simpan";
        editCancelButton.classList.add("d-none");
        editingIndex = null;
    }

    if (attendanceForm) {
        attendanceForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = workerNameInput.value.trim();
            const status = attendanceStatusInput.value;
            const salary = attendanceSalaryInput ? Number(attendanceSalaryInput.value) : 0;
            const attendanceDateValue = attendanceRecordDateInput ? attendanceRecordDateInput.value : null;
            if (name === "" || !attendanceDateValue || !salary) {
                return;
            }

            const date = convertDateInputToLocale(attendanceDateValue);
            const paid = editingIndex !== null ? attendanceRecords[editingIndex]?.paid : false;
            const record = { name, status, salary, date, rawDate: attendanceDateValue, paid };
            if (editingIndex !== null) {
                attendanceRecords[editingIndex] = record;
            } else {
                attendanceRecords.unshift(record);
            }

            saveToStorage();  // 💾 Simpan ke storage
            renderAttendanceTable();
            renderKehadiranSection();
            renderPayrollSummary();

            resetAttendanceForm();
            workerNameInput.focus();
        });
    }

    if (materialForm) {
        materialForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = materialNameInput.value.trim();
            const description = materialDescriptionInput.value.trim();
            const price = materialPriceInput ? Number(materialPriceInput.value) : 0;
            if (name === "" || description === "" || price <= 0) {
                return;
            }

            materialRecords.unshift({ name, description, price });
            saveToStorage();  // 💾 Simpan ke storage
            renderMaterialTable();
            renderDashboardMaterialTable();
            updateMaterialTotals();
            renderLaporanTable();

            materialForm.reset();
            materialPriceInput.value = "";
            materialNameInput.focus();
        });
    }

    if (exportLaporanButton) {
        exportLaporanButton.addEventListener("click", function () {
            exportLaporanToExcel();
        });
    }

    if (progressForm) {
        progressForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = progressNameInput.value.trim();
            const description = progressDescriptionInput.value.trim();
            const percent = progressPercentInput ? Number(progressPercentInput.value) : 0;
            if (name === "" || description === "" || percent < 0 || percent > 100) {
                return;
            }

            const record = { name, description, percent };
            if (progressEditingIndex !== null) {
                progressRecords[progressEditingIndex] = record;
            } else {
                progressRecords.unshift(record);
            }

            saveToStorage();  // 💾 Simpan ke storage
            renderProgressTable();
            renderOverallProgress();
            resetProgressForm();
        });
    }

    if (progressCancelButton) {
        progressCancelButton.addEventListener("click", function () {
            resetProgressForm();
        });
    }

    if (editCancelButton) {
        editCancelButton.addEventListener("click", function () {
            resetAttendanceForm();
        });
    }

    if (attendanceTableBody) {
        attendanceTableBody.addEventListener("click", function (event) {
            const button = event.target.closest(".edit-attendance-btn");
            if (!button) {
                return;
            }
            const index = Number(button.dataset.index);
            const record = attendanceRecords[index];
            if (!record) {
                return;
            }

            editingIndex = index;
            if (attendanceRecordDateInput) {
                attendanceRecordDateInput.value = record.rawDate || "";
            }
            workerNameInput.value = record.name;
            attendanceStatusInput.value = record.status;
            if (attendanceSalaryInput) {
                attendanceSalaryInput.value = record.salary || 0;
            }
            attendanceSubmitButton.textContent = "Update";
            editCancelButton.classList.remove("d-none");
            showSection("absensi");
        });
    }

    if (pengupahanSummaryBody) {
        pengupahanSummaryBody.addEventListener("click", function (event) {
            const button = event.target.closest(".toggle-payment-btn");
            if (!button) {
                return;
            }
            const name = button.dataset.name;
            const payState = button.dataset.pay === "true";
            attendanceRecords.forEach((record) => {
                if (record.name.trim().toLowerCase() === name) {
                    record.paid = payState;
                }
            });
            saveToStorage();  // 💾 Simpan ke storage
            renderPayrollSummary();
        });
    }

    if (dashboardLink) {
        dashboardLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("dashboard");
        });
    }

    if (absensiLink) {
        absensiLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("absensi");
        });
    }

    if (kehadiranLink) {
        kehadiranLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("kehadiran");
        });
    }

    if (pengupahanLink) {
        pengupahanLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("pengupahan");
        });
    }

    if (materialLink) {
        materialLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("material");
        });
    }

    if (progressLink) {
        progressLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("progress");
        });
    }

    if (laporanLink) {
        laporanLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("laporan");
        });
    }

    if (progressTableBody) {
        progressTableBody.addEventListener("click", function (event) {
            const button = event.target.closest(".edit-progress-btn");
            if (!button) {
                return;
            }
            const index = Number(button.dataset.index);
            const record = progressRecords[index];
            if (!record) {
                return;
            }
            progressEditingIndex = index;
            progressNameInput.value = record.name;
            progressDescriptionInput.value = record.description;
            progressPercentInput.value = record.percent;
            if (progressSubmitButton) {
                progressSubmitButton.textContent = "Update";
            }
            if (progressCancelButton) {
                progressCancelButton.classList.remove("d-none");
            }
            showSection("progress");
        });
    }

    function renderMaterialTable() {
        if (!materialTableBody) {
            return;
        }
        if (materialRecords.length === 0) {
            materialTableBody.innerHTML = "<tr><td colspan=\"3\" class=\"text-center text-muted\">Belum ada material.</td></tr>";
            return;
        }

        materialTableBody.innerHTML = materialRecords
            .map((item) => {
                return `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.description}</td>
                        <td>Rp${item.price.toLocaleString("id-ID")}</td>
                    </tr>`;
            })
            .join("");
    }

    function updateMaterialTotals() {
        const totalMaterial = materialRecords.reduce((sum, item) => sum + item.price, 0);
        if (materialCardValue) {
            materialCardValue.textContent = `Rp${totalMaterial.toLocaleString("id-ID")}`;
        }
    }

    function renderProgressTable() {
        if (!progressTableBody) {
            return;
        }
        if (progressRecords.length === 0) {
            progressTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Belum ada progres pekerjaan.</td></tr>';
            renderActivityTable();
            return;
        }

        progressTableBody.innerHTML = progressRecords
            .map((item, index) => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>
                        <div class="progress" style="height:18px;">
                            <div class="progress-bar bg-info" role="progressbar" style="width: ${item.percent}%;" aria-valuenow="${item.percent}" aria-valuemin="0" aria-valuemax="100">
                                ${item.percent}%
                            </div>
                        </div>
                    </td>
                    <td>
                        <button type="button" class="btn btn-sm btn-outline-primary edit-progress-btn" data-index="${index}">Edit</button>
                    </td>
                </tr>`)
            .join("");

        renderActivityTable();
    }

    function renderActivityTable() {
        if (!activityTableBody) {
            return;
        }
        if (progressRecords.length === 0) {
            activityTableBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Belum ada aktivitas terbaru.</td></tr>';
            return;
        }

        const today = new Date();
        activityTableBody.innerHTML = progressRecords
            .slice(0, 5)
            .map((item) => {
                const status = item.percent >= 100 ? 'Selesai' : item.percent > 0 ? 'Sedang' : 'Belum';
                const badgeClass = item.percent >= 100 ? 'badge bg-success' : item.percent > 0 ? 'badge bg-warning text-dark' : 'badge bg-secondary';
                return `
                    <tr>
                        <td>${today.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                        <td>${item.name}</td>
                        <td><span class="${badgeClass}">${status}</span></td>
                    </tr>`;
            })
            .join("");
    }

    function renderOverallProgress() {
        const progressBar = document.getElementById("progressBar");
        if (!progressBar) {
            return;
        }
        const percent = progressRecords.length === 0
            ? 0
            : Math.round(progressRecords.reduce((sum, item) => sum + item.percent, 0) / progressRecords.length);
        progressBar.style.width = `${percent}%`;
        progressBar.textContent = `${percent}%`;
        progressBar.classList.toggle("bg-success", percent >= 80);
        progressBar.classList.toggle("bg-warning", percent >= 40 && percent < 80);
        progressBar.classList.toggle("bg-danger", percent < 40);
    }

    function resetProgressForm() {
        if (progressForm) {
            progressForm.reset();
        }
        if (progressPercentInput) {
            progressPercentInput.value = "";
        }
        progressEditingIndex = null;
        if (progressSubmitButton) {
            progressSubmitButton.textContent = "Tambah";
        }
        if (progressCancelButton) {
            progressCancelButton.classList.add("d-none");
        }
    }

    function renderDashboardMaterialTable() {
        if (!dashboardMaterialBody) {
            return;
        }
        if (materialRecords.length === 0) {
            dashboardMaterialBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Belum ada pengeluaran material.</td></tr>';
            return;
        }

        dashboardMaterialBody.innerHTML = materialRecords
            .slice(0, 5)
            .map((item) => `
                <tr>
                    <td>${item.name}</td>
                    <td>Rp${item.price.toLocaleString("id-ID")}</td>
                    <td><span class="badge bg-warning text-dark">Tercatat</span></td>
                </tr>`)
            .join("");
    }

    function renderLaporanTable() {
        if (!laporanTableBody) {
            return;
        }

        const laporanRows = [];

        attendanceRecords.forEach((record) => {
            laporanRows.push({
                date: record.date,
                category: "Upah",
                detail: `${record.name} (${record.status})`,
                amount: record.salary,
                status: record.paid ? "Lunas" : "Belum Bayar",
            });
        });

        materialRecords.forEach((item) => {
            laporanRows.push({
                date: "-",
                category: "Material",
                detail: `${item.name} - ${item.description}`,
                amount: item.price,
                status: "Tercatat",
            });
        });

        if (laporanRows.length === 0) {
            laporanTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Belum ada data laporan keuangan.</td></tr>';
            return;
        }

        laporanTableBody.innerHTML = laporanRows
            .map((row) => `
                <tr>
                    <td>${row.date}</td>
                    <td>${row.category}</td>
                    <td>${row.detail}</td>
                    <td>Rp${row.amount.toLocaleString("id-ID")}</td>
                    <td>${row.status}</td>
                </tr>`)
            .join("");
    }

    function downloadCsv(filename, csvContent) {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function exportLaporanToExcel() {
        const rows = [["Tanggal", "Kategori", "Nama / Detail", "Jumlah", "Status"]];

        attendanceRecords.forEach((record) => {
            rows.push([
                record.date,
                "Upah",
                `${record.name} (${record.status})`,
                `Rp${record.salary.toLocaleString("id-ID")}`,
                record.paid ? "Lunas" : "Belum Bayar",
            ]);
        });

        materialRecords.forEach((item) => {
            rows.push([
                "-",
                "Material",
                `${item.name} - ${item.description}`,
                `Rp${item.price.toLocaleString("id-ID")}`,
                "Tercatat",
            ]);
        });

        if (rows.length === 1) {
            alert("Tidak ada data laporan keuangan untuk diekspor.");
            return;
        }

        const csvContent = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\r\n");
        downloadCsv("laporan_keuangan.csv", csvContent);
    }

    function convertDateInputToLocale(value) {
        if (!value) {
            return "";
        }
        const [year, month, day] = value.split("-");
        const date = new Date(`${year}-${month}-${day}`);
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    setDefaultDate();
    renderAttendanceTable();
    renderKehadiranSection();
    renderPayrollSummary();
    renderMaterialTable();
    renderDashboardMaterialTable();
    renderProgressTable();
    renderOverallProgress();
    updateMaterialTotals();
    showSection("dashboard");
});
