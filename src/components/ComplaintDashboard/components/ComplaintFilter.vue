<template>
  <v-card class="premium-card pa-4 mb-8">
    <div class="d-flex flex-column flex-md-row align-items-center justify-space-between gap-4">
      <div class="d-flex align-items-center text-maroon font-weight-bold">
        <v-icon left color="primary" class="mr-2">mdi-filter-variant</v-icon>
        <span class="text-subtitle-1">{{ t.dashboard.filter.allCategories }}</span>
      </div>

      <v-row class="w-100 m-0">
        <!-- Category Filter -->
        <v-col cols="12" md="4" class="py-1 py-md-0">
          <v-select
            v-model="store.selectedCategoryFilter"
            :items="categoryItems"
            :label="t.dashboard.filter.allCategories"
            variant="outlined"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-tag"
            color="primary"
          ></v-select>
        </v-col>

        <!-- Status Filter -->
        <v-col cols="12" md="4" class="py-1 py-md-0">
          <v-select
            v-model="store.selectedStatusFilter"
            :items="statusItems"
            item-title="label"
            item-value="value"
            :label="t.dashboard.filter.allStatuses"
            variant="outlined"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-list-status"
            color="primary"
          ></v-select>
        </v-col>

        <!-- Street Filter -->
        <v-col cols="12" md="4" class="py-1 py-md-0">
          <v-select
            v-model="store.selectedStreetFilter"
            :items="streetItems"
            :label="t.dashboard.filter.allStreets"
            variant="outlined"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-home-search"
            color="primary"
          ></v-select>
        </v-col>
      </v-row>

      <!-- Reset Filter Button -->
      <v-btn
        variant="tonal"
        color="primary"
        class="font-weight-bold rounded-lg px-4"
        @click="resetFilters"
      >
        <v-icon left class="mr-1">mdi-refresh</v-icon>
        Reset
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import { useComplaintStore } from "../../../store/complaintStore";
import { translations } from "../../../translations";

export default {
  name: "ComplaintFilter",
  data() {
    return {
      categoryItems: [
        "All",
        "சாலைகள் / பள்ளங்கள் (Roads/Potholes)",
        "தெருவிளக்குகள் (Streetlights)",
        "குடிநீர் (Drinking Water)",
        "கழிவுநீர் / சாக்கடை (Drainage/Sewage)",
        "சுகாதாரம் / குப்பை (Sanitation/Garbage)",
        "ரேஷன் கடை / பொது விநியோகம் (Ration Shop/PDS)",
        "மின்சாரம் (Electricity)",
        "காவல்துறை / பாதுகாப்பு (Police/Safety)",
        "பிற பிரச்சினைகள் (Others)",
      ],
      streetItems: [
        "All",
        "ரொயாலா நகர் (Royala Nagar)",
        "செந்தமிழ் நகர் (Senthamizh Nagar)",
        "எம்.ஜி.ஆர் நகர் (MGR Nagar)",
        "வள்ளுவர் நகர் (Valluvar Nagar)",
        "பாரதி சாலை (Bharathi Salai)",
        "அம்பாள் நகர் (Ambal Nagar)",
        "புவனேஸ்வரி நகர் (Bhuvaneshwari Nagar)",
        "ஸ்ரீ ராம் நகர் (Sri Ram Nagar)",
        "காமராஜ் நகர் (Kamaraj Nagar)",
        "அண்ணா நகர் (Anna Nagar)",
        "பிற பகுதி (Other Area in Part 155)",
      ],
    };
  },
  computed: {
    store() {
      return useComplaintStore();
    },
    lang() {
      return this.store.language;
    },
    t() {
      return translations[this.lang] || translations.ta;
    },
    statusItems() {
      return [
        { label: "All", value: "All" },
        { label: this.t.common.status.PENDING, value: "PENDING" },
        { label: this.t.common.status["IN PROGRESS"], value: "IN PROGRESS" },
        { label: this.t.common.status.RESOLVED, value: "RESOLVED" },
      ];
    },
  },
  methods: {
    resetFilters() {
      this.store.selectedCategoryFilter = "All";
      this.store.selectedStatusFilter = "All";
      this.store.selectedStreetFilter = "All";
    },
  },
};
</script>

<style scoped>
.text-maroon {
  color: var(--tvk-maroon) !important;
}
</style>
