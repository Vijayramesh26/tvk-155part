const LOCAL_STORAGE_KEY = "tvk_155_complaints";

export const ComplaintServices = {
  // Enforce ZERO data persistence in localStorage for maximum privacy
  getLocalComplaints() {
    if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    return [];
  },

  saveLocalComplaints() {
    if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
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

    // 2. Enforce zero local storage trace (clean removal)
    this.saveLocalComplaints();

    return newId;
  },

  async getComplaints() {
    return this.getLocalComplaints();
  },

  async updateComplaintStatus() {},
  async updateComplaintPriority() {},
  async updateComplaintRemarks() {},
  async upvoteComplaint() {},

  async seedInitialData() {
    return;
  },

  getSampleComplaints() {
    return [];
  },
};
