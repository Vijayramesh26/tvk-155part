<template>
  <div class="secretary-info-main">
    <v-row class="justify-center mb-8">
      <v-col cols="12" class="text-center">
        <v-chip color="amber" variant="elevated" class="text-maroon font-weight-bold mb-3 px-4 py-2 uppercase">
          <v-icon left size="18" class="mr-1">mdi-star-circle</v-icon>
          {{ t.secretary.tag }}
        </v-chip>
        <h1 class="tamil-title text-h4 font-weight-black text-white mb-2 shadow-text">
          {{ t.secretary.title }}
        </h1>
        <p class="text-body-1 text-grey-lighten-1 mb-0 max-w-2xl mx-auto font-weight-medium">
          {{ t.secretary.subtitle }}
        </p>
      </v-col>
    </v-row>

    <!-- Leader Card: Part 155 Secretary -->
    <LeaderCard />

    <!-- Team Coordinators Grid (Commented out per user request) -->
    <!-- <TeamGrid /> -->
  </div>
</template>

<script>
import LeaderCard from "./components/LeaderCard.vue";
import TeamGrid from "./components/TeamGrid.vue";
import { useComplaintStore } from "../../store/complaintStore";
import { translations } from "../../translations";

export default {
  name: "SecretaryInfoMain",
  components: {
    LeaderCard,
    TeamGrid,
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
  },
};
</script>

<style scoped>
.text-maroon {
  color: var(--tvk-maroon) !important;
}
.max-w-2xl {
  max-width: 768px;
}
.shadow-text {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}
</style>
