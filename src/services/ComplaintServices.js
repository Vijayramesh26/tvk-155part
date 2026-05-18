const LOCAL_STORAGE_KEY = "tvk_155_complaints";

export const ComplaintServices = {
  // Helper to get local complaints
  getLocalComplaints() {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  },

  // Helper to save local complaints
  saveLocalComplaints(complaints) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(complaints));
  },

  async submitToGoogleForms(data) {
    const formUrl = import.meta.env.VITE_GOOGLE_FORM_URL || "https://docs.google.com/forms/d/e/1FAIpQLSfRjAtBBYa1FmLHOQcN8pSHpAmPVVNpLTDAeP6S7qG_6OIUbQ/formResponse";
    const entryName = import.meta.env.VITE_GF_ENTRY_NAME || "entry.1251728978";
    const entryPhone = import.meta.env.VITE_GF_ENTRY_PHONE || "entry.1499971927";
    const entryStreet = import.meta.env.VITE_GF_ENTRY_STREET || "entry.83265760";
    const entryCategory = import.meta.env.VITE_GF_ENTRY_CATEGORY || "entry.1629674272";
    const entryPriority = import.meta.env.VITE_GF_ENTRY_PRIORITY || "entry.1863000140";
    const entryDesc = import.meta.env.VITE_GF_ENTRY_DESC || "entry.348512600";

    const formData = new URLSearchParams();
    formData.append(entryName, data.citizenName || "");
    formData.append(entryPhone, data.phone || "");
    formData.append(entryStreet, data.street || "");
    formData.append(entryCategory, data.category || "");
    formData.append(entryPriority, data.priority || "MEDIUM");
    formData.append(entryDesc, data.description || "");

    try {
      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("Successfully forwarded data to Google Forms backend.");
    } catch (err) {
      console.error("Google Forms forwarding notice:", err);
    }
  },

  async submitComplaint(complaintData) {
    const newId = "TVK-155-" + Math.floor(1000 + Math.random() * 9000);
    const newRecord = {
      id: newId,
      complaintId: newId,
      ...complaintData,
      status: "PENDING",
      upvotes: 0,
      adminRemarks: "",
      createdAt: new Date().toISOString(),
    };

    // 1. Transparently forward data to Google Forms backend
    this.submitToGoogleForms(newRecord);

    // 2. Save directly to local storage
    const localList = this.getLocalComplaints();
    localList.unshift(newRecord);
    this.saveLocalComplaints(localList);

    return newId;
  },

  async getComplaints() {
    return this.getLocalComplaints();
  },

  async updateComplaintStatus(id, newStatus) {
    const localList = this.getLocalComplaints();
    const item = localList.find((c) => c.id === id || c.complaintId === id);
    if (item) {
      item.status = newStatus;
      item.updatedAt = new Date().toISOString();
      this.saveLocalComplaints(localList);
    }
  },

  async updateComplaintPriority(id, newPriority) {
    const localList = this.getLocalComplaints();
    const item = localList.find((c) => c.id === id || c.complaintId === id);
    if (item) {
      item.priority = newPriority;
      item.updatedAt = new Date().toISOString();
      this.saveLocalComplaints(localList);
    }
  },

  async updateComplaintRemarks(id, remarks) {
    const localList = this.getLocalComplaints();
    const item = localList.find((c) => c.id === id || c.complaintId === id);
    if (item) {
      item.adminRemarks = remarks;
      item.updatedAt = new Date().toISOString();
      this.saveLocalComplaints(localList);
    }
  },

  async upvoteComplaint(id) {
    const localList = this.getLocalComplaints();
    const item = localList.find((c) => c.id === id || c.complaintId === id);
    if (item) {
      item.upvotes = (item.upvotes || 0) + 1;
      this.saveLocalComplaints(localList);
    }
  },

  async seedInitialData() {
    // No mock seeding for production launch
    return;
  },

  getSampleComplaints() {
    return [];
  },
};
