import { defineStore } from "pinia";
import { ComplaintServices } from "../services/ComplaintServices";

export const useComplaintStore = defineStore("complaint", {
  state: () => ({
    complaints: [],
    isLoading: false,
    errorMessage: "",
    isAdminAuthenticated: false,
    language: localStorage.getItem('tvk_155_lang') || 'ta',
    selectedCategoryFilter: "All",
    selectedStatusFilter: "All",
    selectedStreetFilter: "All",
  }),

  getters: {
    filteredComplaints(state) {
      return state.complaints.filter((item) => {
        const matchCat =
          state.selectedCategoryFilter === "All" ||
          item.category === state.selectedCategoryFilter;
        const matchStat =
          state.selectedStatusFilter === "All" ||
          item.status === state.selectedStatusFilter;
        const matchStreet =
          state.selectedStreetFilter === "All" ||
          item.street === state.selectedStreetFilter;
        return matchCat && matchStat && matchStreet;
      });
    },
    totalComplaints(state) {
      return state.complaints.length;
    },
    resolvedCount(state) {
      return state.complaints.filter((c) => c.status === "RESOLVED").length;
    },
    inProgressCount(state) {
      return state.complaints.filter((c) => c.status === "IN PROGRESS").length;
    },
    pendingCount(state) {
      return state.complaints.filter((c) => c.status === "PENDING").length;
    },
  },

  actions: {
    async fetchComplaints() {
      this.isLoading = true;
      this.errorMessage = "";
      try {
        await ComplaintServices.seedInitialData();
        const data = await ComplaintServices.getComplaints();
        this.complaints = data;
      } catch (err) {
        this.errorMessage = "புகார்களைப் பெறுவதில் பிழை: " + err.message;
      } finally {
        this.isLoading = false;
      }
    },

    async addComplaint(complaintData) {
      this.isLoading = true;
      try {
        const id = "TVK-155-" + Math.floor(1000 + Math.random() * 9000);
        await ComplaintServices.submitComplaint({
          ...complaintData,
          complaintId: id,
        });
        await this.fetchComplaints();
        return id;
      } catch (err) {
        this.errorMessage = "புகார் பதிவு செய்ய முடியவில்லை: " + err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateStatus(id, newStatus) {
      try {
        await ComplaintServices.updateComplaintStatus(id, newStatus);
        await this.fetchComplaints();
      } catch (err) {
        this.errorMessage = "நிலையை மாற்ற முடியவில்லை: " + err.message;
      }
    },

    async updatePriority(id, newPriority) {
      try {
        await ComplaintServices.updateComplaintPriority(id, newPriority);
        await this.fetchComplaints();
      } catch (err) {
        this.errorMessage = "முன்னுரிமையை மாற்ற முடியவில்லை: " + err.message;
      }
    },

    async updateRemarks(id, remarks) {
      try {
        await ComplaintServices.updateComplaintRemarks(id, remarks);
        await this.fetchComplaints();
      } catch (err) {
        this.errorMessage = "குறிப்புகளைப் புதுப்பிக்க முடியவில்லை: " + err.message;
      }
    },

    async upvote(id) {
      const complaint = this.complaints.find((c) => c.id === id);
      if (complaint) {
        try {
          await ComplaintServices.upvoteComplaint(id, complaint.upvotes);
          complaint.upvotes += 1;
        } catch (err) {
          this.errorMessage = "ஆதரவு தெரிவிக்க முடியவில்லை: " + err.message;
        }
      }
    },

    authenticateAdmin(passcode) {
      const targetPass = import.meta.env.VITE_ADMIN_PASSCODE || "TVK155";
      if (passcode === targetPass) {
        this.isAdminAuthenticated = true;
        return true;
      }
      return false;
    },

    logoutAdmin() {
      this.isAdminAuthenticated = false;
    },
  },
});
