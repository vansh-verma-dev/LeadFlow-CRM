// Initial sample leads dataset if localStorage is empty
const defaultLeads = [
    {
        id: 'lead-1',
        name: 'Alex Rivera',
        email: 'alex.rivera@fintechpulse.io',
        phone: '+1 (555) 382-9102',
        company: 'FinTech Pulse',
        interest: 'Enterprise Solution',
        message: 'Looking for a robust CRM to handle inbound client inquiries for our upcoming product launch.',
        status: 'Qualified',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        notes: [
            { id: 'n1', text: 'Initial call completed. Very interested in API integrations.', timestamp: new Date(Date.now() - 86400000).toISOString() }
        ]
    },
    {
        id: 'lead-2',
        name: 'Samantha Vance',
        email: 'samantha@designcraft.studio',
        phone: '+1 (555) 492-1092',
        company: 'DesignCraft Studio',
        interest: 'Standard SaaS Subscription',
        message: 'Do you offer team discounts for 15+ seats?',
        status: 'Contacted',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        notes: [
            { id: 'n2', text: 'Sent pricing tier PDF via email.', timestamp: new Date(Date.now() - 86400000 * 4).toISOString() }
        ]
    },
    {
        id: 'lead-3',
        name: 'Marcus Brody',
        email: 'mbrody@apexlogistics.com',
        phone: '+1 (555) 910-2384',
        company: 'Apex Logistics',
        interest: 'Custom Software Development',
        message: 'We need a tailored dashboard connected to our warehouse database.',
        status: 'Proposal Sent',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        notes: [
            { id: 'n3', text: 'Proposal submitted for $14,500 project scope.', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() }
        ]
    },
    {
        id: 'lead-4',
        name: 'Elena Rostova',
        email: 'elena@biogenics.org',
        phone: '+1 (555) 293-8401',
        company: 'BioGenics Lab',
        interest: 'Consulting & Audit',
        message: 'Need security compliance audit for client management software.',
        status: 'New',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        notes: []
    }
];

// App state
let leads = JSON.parse(localStorage.getItem('leadflow_leads')) || defaultLeads;
let viewMode = 'table'; // 'table' or 'card'
let currentLeadId = null;

// Status badge styling helper
function getStatusBadge(status) {
    const styles = {
        'New': 'bg-blue-50 text-blue-700 border-blue-200',
        'Contacted': 'bg-amber-50 text-amber-700 border-amber-200',
        'Qualified': 'bg-purple-50 text-purple-700 border-purple-200',
        'Proposal Sent': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'Won': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Lost': 'bg-slate-100 text-slate-600 border-slate-200'
    };
    const icons = {
        'New': 'sparkles',
        'Contacted': 'phone-call',
        'Qualified': 'award',
        'Proposal Sent': 'file-text',
        'Won': 'check-circle',
        'Lost': 'x-circle'
    };
    const cssClass = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
    const iconName = icons[status] || 'circle';

    return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cssClass}">
        <i data-lucide="${iconName}" class="w-3 h-3 mr-1.5"></i> ${status}
    </span>`;
}

// Initialize Lucide icons on load
window.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    updateDashboardStats();
    renderLeads();
});

// Save state to localStorage
function saveLeads() {
    localStorage.setItem('leadflow_leads', JSON.stringify(leads));
    updateDashboardStats();
}

// Tab switching
function switchTab(tab) {
    const dashboardView = document.getElementById('view-dashboard');
    const formView = document.getElementById('view-form');
    const navDashboard = document.getElementById('nav-dashboard');
    const navForm = document.getElementById('nav-form');

    if (tab === 'dashboard') {
        dashboardView.classList.remove('hidden');
        formView.classList.add('hidden');
        navDashboard.className = "px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 bg-indigo-50 text-indigo-700";
        navForm.className = "px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900";
        renderLeads();
    } else {
        dashboardView.classList.add('hidden');
        formView.classList.remove('hidden');
        navForm.className = "px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 bg-indigo-50 text-indigo-700";
        navDashboard.className = "px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900";
    }
}

// View Mode switcher
function setViewMode(mode) {
    viewMode = mode;
    const btnTable = document.getElementById('btn-view-table');
    const btnCard = document.getElementById('btn-view-card');

    if (mode === 'table') {
        btnTable.className = "p-1.5 rounded-lg text-slate-600 bg-white shadow-xs transition-all";
        btnCard.className = "p-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition-all";
    } else {
        btnCard.className = "p-1.5 rounded-lg text-slate-600 bg-white shadow-xs transition-all";
        btnTable.className = "p-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition-all";
    }
    renderLeads();
}

// Update statistics summary cards
function updateDashboardStats() {
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const qualifiedLeads = leads.filter(l => l.status === 'Qualified').length;
    const wonLeads = leads.filter(l => l.status === 'Won').length;
    const conversionRate = total > 0 ? ((wonLeads / total) * 100).toFixed(1) : 0;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-new').textContent = newLeads;
    document.getElementById('stat-qualified').textContent = qualifiedLeads;
    document.getElementById('stat-conversion').textContent = conversionRate + '%';
}

// Filter and sort leads
function getFilteredLeads() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;

    let result = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchQuery) ||
                              lead.email.toLowerCase().includes(searchQuery) ||
                              (lead.company && lead.company.toLowerCase().includes(searchQuery));
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
        if (sortFilter === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortFilter === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortFilter === 'name') return a.name.localeCompare(b.name);
        return 0;
    });

    return result;
}

// Render leads in Table or Card view
function renderLeads() {
    const container = document.getElementById('leads-container');
    const filtered = getFilteredLeads();

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="p-12 text-center space-y-3">
                <div class="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <i data-lucide="search-x" class="w-6 h-6"></i>
                </div>
                <h4 class="text-base font-bold text-slate-700">No leads found</h4>
                <p class="text-sm text-slate-400 max-w-sm mx-auto">Try adjusting your search query or status filter, or submit a test lead from the mock website form.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    if (viewMode === 'table') {
        let html = `
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <th class="py-3.5 px-6">Client / Contact</th>
                            <th class="py-3.5 px-6">Company</th>
                            <th class="py-3.5 px-6">Interest</th>
                            <th class="py-3.5 px-6">Status</th>
                            <th class="py-3.5 px-6">Submitted</th>
                            <th class="py-3.5 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm">
        `;

        filtered.forEach(lead => {
            const dateStr = new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            const initials = lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            html += `
                <tr class="hover:bg-slate-50/80 transition-all cursor-pointer" onclick="openLeadModal('${lead.id}')">
                    <td class="py-4 px-6">
                        <div class="flex items-center space-x-3">
                            <div class="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">${initials}</div>
                            <div>
                                <div class="font-semibold text-slate-800">${escapeHtml(lead.name)}</div>
                                <div class="text-xs text-slate-400">${escapeHtml(lead.email)}</div>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 px-6 text-slate-600 font-medium">${escapeHtml(lead.company || '—')}</td>
                    <td class="py-4 px-6">
                        <span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">${escapeHtml(lead.interest)}</span>
                    </td>
                    <td class="py-4 px-6">${getStatusBadge(lead.status)}</td>
                    <td class="py-4 px-6 text-xs text-slate-500">${dateStr}</td>
                    <td class="py-4 px-6 text-right" onclick="event.stopPropagation()">
                        <div class="flex items-center justify-end space-x-2">
                            <button onclick="openLeadModal('${lead.id}')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View details">
                                <i data-lucide="eye" class="w-4 h-4"></i>
                            </button>
                            <button onclick="deleteLead('${lead.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete lead">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        container.innerHTML = html;
    } else {
        // Card Grid View
        let html = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-50/50">`;

        filtered.forEach(lead => {
            const dateStr = new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            const initials = lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            html += `
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer" onclick="openLeadModal('${lead.id}')">
                    <div class="space-y-3">
                        <div class="flex items-start justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs">${initials}</div>
                                <div>
                                    <h4 class="font-semibold text-slate-800">${escapeHtml(lead.name)}</h4>
                                    <p class="text-xs text-slate-400">${escapeHtml(lead.company || 'Independent')}</p>
                                </div>
                            </div>
                            ${getStatusBadge(lead.status)}
                        </div>

                        <div class="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                            <div class="flex items-center space-x-2">
                                <i data-lucide="mail" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
                                <span class="truncate">${escapeHtml(lead.email)}</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <i data-lucide="phone" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
                                <span>${escapeHtml(lead.phone || 'No phone')}</span>
                            </div>
                        </div>

                        <div class="text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded-lg">
                            Interest: <span class="text-indigo-600">${escapeHtml(lead.interest)}</span>
                        </div>
                    </div>

                    <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                        <span>Submitted ${dateStr}</span>
                        <div class="flex items-center space-x-1" onclick="event.stopPropagation()">
                            <button onclick="openLeadModal('${lead.id}')" class="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-all">Details</button>
                            <button onclick="deleteLead('${lead.id}')" class="p-1 text-slate-400 hover:text-rose-600 rounded-lg"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    lucide.createIcons();
}

function filterLeads() {
    renderLeads();
}

// Mock Website Form Submission
function handleWebsiteFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const company = document.getElementById('form-company').value.trim();
    const interest = document.getElementById('form-interest').value;
    const message = document.getElementById('form-message').value.trim();

    const newLead = {
        id: 'lead-' + Date.now(),
        name,
        email,
        phone,
        company,
        interest,
        message,
        status: 'New',
        createdAt: new Date().toISOString(),
        notes: []
    };

    leads.unshift(newLead);
    saveLeads();

    // Reset form
    document.getElementById('website-contact-form').reset();

    // Show success toast and switch to dashboard
    showToast('New lead submitted successfully!');
    switchTab('dashboard');
}

// Quick sample data filler for testing
function loadSampleLeadData() {
    const samples = [
        { name: 'Dr. Harrison Wells', email: 'wells@starlabs.net', phone: '+1 (555) 892-0192', company: 'STAR Labs', interest: 'Enterprise Solution', message: 'Looking for a secure system to log research inquiries and grant applicants.' },
        { name: 'Chloe Decker', email: 'cdecker@lapd.gov', phone: '+1 (555) 781-9923', company: 'LAPD Precinct', interest: 'Custom Software Development', message: 'Need an automated dispatch tracking tool.' },
        { name: 'Arthur Pendelton', email: 'arthur@sterlingcapital.com', phone: '+1 (555) 321-4455', company: 'Sterling Capital', interest: 'Consulting & Audit', message: 'Evaluating CRM vendors for Q3 portfolio expansion.' }
    ];
    const sample = samples[Math.floor(Math.random() * samples.length)];

    document.getElementById('form-name').value = sample.name;
    document.getElementById('form-email').value = sample.email;
    document.getElementById('form-phone').value = sample.phone;
    document.getElementById('form-company').value = sample.company;
    document.getElementById('form-interest').value = sample.interest;
    document.getElementById('form-message').value = sample.message;
}

// Open Lead Modal for viewing/editing
function openLeadModal(leadId) {
    if (!leadId) {
        // If creating a brand new lead from dashboard button
        leadId = 'lead-' + Date.now();
        const newLead = {
            id: leadId,
            name: 'New Client Lead',
            email: 'client@example.com',
            phone: '',
            company: '',
            interest: 'Standard SaaS Subscription',
            message: 'Added manually from CRM dashboard.',
            status: 'New',
            createdAt: new Date().toISOString(),
            notes: []
        };
        leads.unshift(newLead);
        saveLeads();
    }

    currentLeadId = leadId;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    document.getElementById('modal-lead-id').value = lead.id;
    document.getElementById('modal-name').value = lead.name;
    document.getElementById('modal-email').value = lead.email;
    document.getElementById('modal-phone').value = lead.phone || '';
    document.getElementById('modal-company').value = lead.company || '';
    document.getElementById('modal-interest').value = lead.interest;
    document.getElementById('modal-status').value = lead.status;
    document.getElementById('modal-message').textContent = lead.message || 'No message provided.';
    document.getElementById('modal-title').textContent = lead.name;
    document.getElementById('modal-subtitle').textContent = lead.company ? `${lead.company} • Submitted via Web Form` : 'Submitted via Web Form';
    document.getElementById('modal-avatar').textContent = lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    renderNotesList(lead.notes || []);

    document.getElementById('lead-modal').classList.remove('hidden');
    lucide.createIcons();
}

function closeLeadModal() {
    document.getElementById('lead-modal').classList.add('hidden');
    currentLeadId = null;
    renderLeads();
}

// Quick update status from modal dropdown
function quickUpdateStatus() {
    if (!currentLeadId) return;
    const lead = leads.find(l => l.id === currentLeadId);
    if (lead) {
        lead.status = document.getElementById('modal-status').value;
        saveLeads();
    }
}

// Save lead edits from modal
function saveLeadChanges() {
    if (!currentLeadId) return;
    const lead = leads.find(l => l.id === currentLeadId);
    if (!lead) return;

    lead.name = document.getElementById('modal-name').value.trim();
    lead.email = document.getElementById('modal-email').value.trim();
    lead.phone = document.getElementById('modal-phone').value.trim();
    lead.company = document.getElementById('modal-company').value.trim();
    lead.status = document.getElementById('modal-status').value;

    saveLeads();
    closeLeadModal();
    showToast('Lead details updated successfully!');
}

// Notes management inside modal
function renderNotesList(notes) {
    const list = document.getElementById('notes-list');
    document.getElementById('notes-count').textContent = `${notes.length} note${notes.length === 1 ? '' : 's'}`;

    if (notes.length === 0) {
        list.innerHTML = `<p class="text-xs text-slate-400 italic py-2">No internal notes yet. Add one above.</p>`;
        return;
    }

    let html = '';
    notes.forEach(note => {
        const dateStr = new Date(note.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        html += `
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p class="text-xs text-slate-800 font-medium">${escapeHtml(note.text)}</p>
                <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                    <span>Internal Note</span>
                    <span>${dateStr}</span>
                </div>
            </div>
        `;
    });
    list.innerHTML = html;
}

function addNote() {
    const input = document.getElementById('new-note-input');
    const text = input.value.trim();
    if (!text || !currentLeadId) return;

    const lead = leads.find(l => l.id === currentLeadId);
    if (lead) {
        if (!lead.notes) lead.notes = [];
        lead.notes.unshift({
            id: 'note-' + Date.now(),
            text,
            timestamp: new Date().toISOString()
        });
        saveLeads();
        input.value = '';
        renderNotesList(lead.notes);
        showToast('Note added successfully.');
    }
}

// Delete lead
function deleteLead(leadId) {
    if (confirm('Are you sure you want to delete this lead?')) {
        leads = leads.filter(l => l.id !== leadId);
        saveLeads();
        if (currentLeadId === leadId) {
            closeLeadModal();
        } else {
            renderLeads();
        }
        showToast('Lead deleted.');
    }
}

function confirmDeleteCurrentLead() {
    if (currentLeadId) {
        deleteLead(currentLeadId);
    }
}

// Export Modal
function openExportModal() {
    document.getElementById('export-modal').classList.remove('hidden');
}

function closeExportModal() {
    document.getElementById('export-modal').classList.add('hidden');
}

function exportCSV() {
    if (leads.length === 0) {
        showToast('No leads to export.');
        return;
    }
    let csv = 'ID,Name,Email,Phone,Company,Interest,Status,Submitted At\n';
    leads.forEach(l => {
        csv += `"${l.id}","${l.name}","${l.email}","${l.phone || ''}","${l.company || ''}","${l.interest}","${l.status}","${l.createdAt}"\n`;
    });
    downloadFile(csv, 'leadflow_export.csv', 'text/csv');
    closeExportModal();
    showToast('CSV downloaded successfully!');
}

function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leads, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "leadflow_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    closeExportModal();
    showToast('JSON backup downloaded!');
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Toast notification helper
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    }, 3000);
}

// HTML Escape helper to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace('&', '&amp;')
              .replace('<', '&lt;')
              .replace('>', '&gt;')
              .replace('"', '&quot;')
              .replace("'", '&#039;');
}