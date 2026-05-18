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
    try {
      const existing = await this.getComplaints();
      if (existing.length > 0) return;

      const mockComplaints = this.getSampleComplaints();
      for (const item of mockComplaints) {
        await addDoc(collection(db, COLLECTION_NAME), item);
      }
    } catch (err) {
      console.warn("Firestore seed permission error. Seeding localStorage:", err.message);
      const localList = this.getLocalComplaints();
      if (localList.length === 0) {
        const sample = this.getSampleComplaints();
        const seeded = sample.map((s, idx) => ({ id: "TVK-155-00" + (idx + 1), ...s }));
        this.saveLocalComplaints(seeded);
      }
    }
  },

  getSampleComplaints() {
    return [
      {
        complaintId: "TVK-155-001",
        citizenName: "ரமேஷ் குமார்",
        phone: "9840123456",
        street: "ரொயாலா நகர் (Royala Nagar)",
        category: "சாலைகள் / பள்ளங்கள் (Roads/Potholes)",
        priority: "HIGH",
        description: "ரொயாலா நகர் முக்கிய சாலையில் பெரிய பள்ளம் ஏற்பட்டுள்ளது. மழைக்காலத்தில் தண்ணீர் தேங்கி விபத்து அபாயம் உள்ளது.",
        photoUrl: "https://images.unsplash.com/photo-151516230528a-0293e67f0851?auto=format&fit=crop&w=600&q=80",
        status: "IN PROGRESS",
        upvotes: 24,
        adminRemarks: "த.வெ.க இளைஞரணி மூலம் தற்காலிக சீரமைப்பு பணிகள் நடைபெற்று வருகிறது.",
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        complaintId: "TVK-155-002",
        citizenName: "பிரியா சுந்தரம்",
        phone: "9840987654",
        street: "செந்தமிழ் நகர் (Senthamizh Nagar)",
        category: "தெருவிளக்குகள் (Streetlights)",
        priority: "MEDIUM",
        description: "செந்தமிழ் நகர் 2-வது தெருவில் கடந்த ஒரு வாரமாக 3 தெருவிளக்குகள் எரியவில்லை.",
        photoUrl: "",
        status: "PENDING",
        upvotes: 15,
        adminRemarks: "",
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        complaintId: "TVK-155-003",
        citizenName: "கார்த்திக் ராஜன்",
        phone: "9840555666",
        street: "வள்ளுவர் நகர் (Valluvar Nagar)",
        category: "குடிநீர் (Drinking Water)",
        priority: "HIGH",
        description: "வள்ளுவர் நகர் பகுதியில் குடிநீர் விநியோகம் சீராக இல்லை.",
        photoUrl: "https://images.unsplash.com/photo-1542000551557-855da7b4c355?auto=format&fit=crop&w=600&q=80",
        status: "RESOLVED",
        upvotes: 38,
        adminRemarks: "த.வெ.க வட்டச் செயலாளர் அவர்களின் நேரடி தலையீட்டால் குடிநீர் லாரி மூலம் தண்ணீர் வழங்கப்பட்டு குழாய் சீரமைக்கப்பட்டது.",
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        complaintId: "TVK-155-004",
        citizenName: "லட்சுமி நாராயணன்",
        phone: "9840777888",
        street: "எம்.ஜி.ஆர் நகர் (MGR Nagar)",
        category: "சுகாதாரம் / குப்பை (Sanitation/Garbage)",
        priority: "HIGH",
        description: "எம்.ஜி.ஆர் நகர் பூங்கா அருகில் குப்பைகள் தேங்கியுள்ளன.",
        photoUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
        status: "IN PROGRESS",
        upvotes: 19,
        adminRemarks: "மாநகராட்சி அதிகாரிகளிடம் புகார் தெரிவிக்கப்பட்டுள்ளது.",
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ];
  },
};
