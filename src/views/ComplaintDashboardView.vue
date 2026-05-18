<template>
  <div class="dashboard-view animate-fade-in">
    <MainDashboard />
  </div>
</template>

<script>
import MainDashboard from "../components/ComplaintDashboard/Main.vue";

export default {
  name: "ComplaintDashboardView",
  components: {
    MainDashboard,
  },
};
</script>
