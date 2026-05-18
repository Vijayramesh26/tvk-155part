import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy
} from "firebase/firestore";

const COLLECTION_NAME = "complaints_155";
const LOCAL_STORAGE_KEY = "tvk_155_complaints";

export const ComplaintServices = {
  // Helper to get local complaints if Firestore fails
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
    const formUrl = import.meta.env.VITE_GOOGLE_FORM_URL || "https://docs.google.com/forms/d/e/1FAIpQLSfhsample_test_id/formResponse";
    const entryName = import.meta.env.VITE_GF_ENTRY_NAME || "entry.1000001";
    const entryPhone = import.meta.env.VITE_GF_ENTRY_PHONE || "entry.1000002";
    const entryStreet = import.meta.env.VITE_GF_ENTRY_STREET || "entry.1000003";
    const entryCategory = import.meta.env.VITE_GF_ENTRY_CATEGORY || "entry.1000004";
    const entryPriority = import.meta.env.VITE_GF_ENTRY_PRIORITY || "entry.1000005";
    const entryDesc = import.meta.env.VITE_GF_ENTRY_DESC || "entry.1000006";

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
    // 1. Transparently forward data to Google Forms backend
    this.submitToGoogleForms(complaintData);

    const newRecord = {
      ...complaintData,
      status: "PENDING",
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };

    // 2. Try saving to Firestore
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), newRecord);
      return docRef.id;
    } catch (err) {
      console.warn("Firestore write permission error. Using localStorage fallback:", err.message);
      // Fallback to local storage
      const localList = this.getLocalComplaints();
      const localId = "TVK-155-L" + Math.floor(1000 + Math.random() * 9000);
      localList.unshift({ id: localId, ...newRecord, complaintId: localId });
      this.saveLocalComplaints(localList);
      return localId;
    }
  },

  async getComplaints() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const complaints = [];
      snapshot.forEach((docSnap) => {
        complaints.push({ id: docSnap.id, ...docSnap.data() });
      });
      return complaints;
    } catch (err) {
      console.warn("Firestore read permission error. Using localStorage fallback:", err.message);
      return this.getLocalComplaints();
    }
  },

  async updateComplaintStatus(id, newStatus) {
    try {
      const ref = doc(db, COLLECTION_NAME, id);
      await updateDoc(ref, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Firestore update status permission error. Updating localStorage:", err.message);
      const localList = this.getLocalComplaints();
      const item = localList.find((c) => c.id === id || c.complaintId === id);
      if (item) {
        item.status = newStatus;
        item.updatedAt = new Date().toISOString();
        this.saveLocalComplaints(localList);
      }
    }
  },

  async updateComplaintPriority(id, newPriority) {
    try {
      const ref = doc(db, COLLECTION_NAME, id);
      await updateDoc(ref, {
        priority: newPriority,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Firestore update priority permission error. Updating localStorage:", err.message);
      const localList = this.getLocalComplaints();
      const item = localList.find((c) => c.id === id || c.complaintId === id);
      if (item) {
        item.priority = newPriority;
        item.updatedAt = new Date().toISOString();
        this.saveLocalComplaints(localList);
      }
    }
  },

  async updateComplaintRemarks(id, remarks) {
    try {
      const ref = doc(db, COLLECTION_NAME, id);
      await updateDoc(ref, {
        adminRemarks: remarks,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Firestore update remarks permission error. Updating localStorage:", err.message);
      const localList = this.getLocalComplaints();
      const item = localList.find((c) => c.id === id || c.complaintId === id);
      if (item) {
        item.adminRemarks = remarks;
        item.updatedAt = new Date().toISOString();
        this.saveLocalComplaints(localList);
      }
    }
  },

  async upvoteComplaint(id, currentUpvotes) {
    try {
      const ref = doc(db, COLLECTION_NAME, id);
      await updateDoc(ref, {
        upvotes: currentUpvotes + 1,
      });
    } catch (err) {
      console.warn("Firestore upvote permission error. Updating localStorage:", err.message);
      const localList = this.getLocalComplaints();
      const item = localList.find((c) => c.id === id || c.complaintId === id);
      if (item) {
        item.upvotes = (item.upvotes || 0) + 1;
        this.saveLocalComplaints(localList);
      }
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
