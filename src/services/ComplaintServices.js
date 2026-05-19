const LOCAL_STORAGE_KEY = "tvk_155_complaints";
const SHEET_CACHE_KEY = "tvk_155_sheet_cache";
const CACHE_DURATION_MS = 2 * 60 * 1000; // 2-minute cache to avoid hammering

// Published CSV URL (works with "Publish to web" — no need to share the sheet publicly)
const PUBLISHED_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTClWvFVbnpO_AxgJgKSYT091RdbPmNKa2U5_b4iaLgI2H_sy1F49aIYw8Wn0pwCehn88RCVVKCTn9/pub?gid=301647063&single=true&output=csv";

/**
 * Minimal RFC-4180 CSV parser.
 * Handles quoted fields with embedded commas, newlines, and escaped quotes.
 */
function parseCSV(text) {
  const rows = [];
  let i = 0;
  const len = text.length;

  while (i < len) {
    const row = [];
    while (i < len) {
      let value = "";

      // Skip leading whitespace (but not newlines)
      while (i < len && text[i] === " ") i++;

      if (i < len && text[i] === '"') {
        // Quoted field
        i++; // skip opening quote
        while (i < len) {
          if (text[i] === '"') {
            if (i + 1 < len && text[i + 1] === '"') {
              value += '"';
              i += 2;
            } else {
              i++; // skip closing quote
              break;
            }
          } else {
            value += text[i];
            i++;
          }
        }
      } else {
        // Unquoted field
        while (i < len && text[i] !== "," && text[i] !== "\r" && text[i] !== "\n") {
          value += text[i];
          i++;
        }
      }

      row.push(value.trim());

      if (i < len && text[i] === ",") {
        i++; // skip comma, continue to next field
      } else {
        break; // end of row
      }
    }

    // Skip row-ending \r\n or \n
    if (i < len && text[i] === "\r") i++;
    if (i < len && text[i] === "\n") i++;

    // Only push non-empty rows
    if (row.length > 0 && row.some((v) => v !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

export const ComplaintServices = {
  // ─── Local Storage (immediate feedback buffer) ───────────────────────
  getLocalComplaints() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveLocalComplaints(complaints) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(complaints));
    } catch (e) {
      console.error("localStorage save failed:", e);
    }
  },

  // ─── Google Sheets Read-back (via published CSV) ─────────────────────
  async fetchFromGoogleSheet() {
    // Return cached data if still fresh
    try {
      const cached = sessionStorage.getItem(SHEET_CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_DURATION_MS) return data;
      }
    } catch {
      /* ignore corrupt cache */
    }

    try {
      const res = await fetch(PUBLISHED_CSV_URL);
      if (!res.ok) {
        console.error("Google Sheets CSV fetch failed:", res.status);
        return [];
      }

      const text = await res.text();
      const rows = parseCSV(text);

      if (rows.length < 2) return []; // Only header row or empty

      // First row is the header:
      //  0: Timestamp
      //  1: Name
      //  2: Mobile No.
      //  3: Street Name
      //  4: Problems / Issue (description)
      //  5: Category
      //  6: Priority
      const dataRows = rows.slice(1); // skip header

      const complaints = dataRows.map((cols, index) => {
        const val = (idx) => (cols[idx] || "").trim();
        const name = val(1);
        if (!name) return null; // skip empty rows

        return {
          id: `GS-${index + 1}`,
          complaintId: `TVK-155-${String(index + 1).padStart(4, "0")}`,
          citizenName: name,
          phone: val(2),
          street: val(3),
          description: val(4),
          category: val(5) || "General",
          priority: val(6) || "MEDIUM",
          // These fields aren't in the form — default values
          status: "PENDING",
          upvotes: 0,
          adminRemarks: "",
          createdAt: val(0) || new Date().toISOString(),
        };
      }).filter(Boolean);

      // Cache the result
      try {
        sessionStorage.setItem(
          SHEET_CACHE_KEY,
          JSON.stringify({ data: complaints, ts: Date.now() })
        );
      } catch {
        /* quota exceeded – non-critical */
      }

      return complaints;
    } catch (err) {
      console.error("Google Sheets CSV fetch error:", err);
      return [];
    }
  },

  // ─── Google Forms Submission (write path) ────────────────────────────
  async submitToGoogleForms(data) {
    const formUrl =
      import.meta.env.VITE_GOOGLE_FORM_URL ||
      "https://docs.google.com/forms/d/e/1FAIpQLSfRjAtBBYa1FmLHOQcN8pSHpAmPVVNpLTDAeP6S7qG_6OIUbQ/formResponse";
    const entryName = import.meta.env.VITE_GF_ENTRY_NAME || "entry.1251728978";
    const entryPhone = import.meta.env.VITE_GF_ENTRY_PHONE || "entry.1499971927";
    const entryStreet = import.meta.env.VITE_GF_ENTRY_STREET || "entry.83265760";
    const entryCategory =
      import.meta.env.VITE_GF_ENTRY_CATEGORY || "entry.1629674272";
    const entryPriority =
      import.meta.env.VITE_GF_ENTRY_PRIORITY || "entry.1863000140";
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
      console.log("✅ Complaint forwarded to Google Forms.");
    } catch (err) {
      console.error("Google Forms submission notice:", err);
    }
  },

  // ─── Submit Complaint ────────────────────────────────────────────────
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

    // 1. Send to Google Forms (source of truth)
    this.submitToGoogleForms(newRecord);

    // 2. Save locally for immediate dashboard feedback
    const local = this.getLocalComplaints();
    local.push(newRecord);
    this.saveLocalComplaints(local);

    // 3. Invalidate the sheet cache so next fetch is fresh
    try {
      sessionStorage.removeItem(SHEET_CACHE_KEY);
    } catch {
      /* non-critical */
    }

    return newId;
  },

  // ─── Get All Complaints (merged: Sheet + local buffer) ───────────────
  async getComplaints() {
    // 1. Fetch from Google Sheets (the canonical data)
    const sheetComplaints = await this.fetchFromGoogleSheet();

    // 2. Get locally buffered complaints (submitted but not yet in Sheet)
    const localComplaints = this.getLocalComplaints();

    if (sheetComplaints.length === 0 && localComplaints.length === 0) {
      return [];
    }

    // 3. De-duplicate: remove local entries already present in the sheet
    //    Match by citizenName + phone (case-insensitive)
    const sheetKeys = new Set(
      sheetComplaints.map(
        (c) =>
          `${(c.citizenName || "").toLowerCase()}|${(c.phone || "").toLowerCase()}`
      )
    );

    const uniqueLocal = localComplaints.filter(
      (c) =>
        !sheetKeys.has(
          `${(c.citizenName || "").toLowerCase()}|${(c.phone || "").toLowerCase()}`
        )
    );

    // 4. Clean up localStorage if entries have synced to the sheet
    if (uniqueLocal.length < localComplaints.length) {
      this.saveLocalComplaints(uniqueLocal);
    }

    // Sheet data first (canonical), then any still-pending local entries
    return [...sheetComplaints, ...uniqueLocal];
  },

  // ─── Stubs for admin operations ──────────────────────────────────────
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
