<template>
  <div class="admin-portal-view animate-fade-in">
    <MainAdmin />
  </div>
</template>

<script>
import MainAdmin from "../components/AdminPortal/Main.vue";

export default {
  name: "AdminPortalView",
  components: {
    MainAdmin,
  },
};
</script>
