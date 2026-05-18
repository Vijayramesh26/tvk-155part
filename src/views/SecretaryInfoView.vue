<template>
  <div class="secretary-info-view animate-fade-in">
    <MainSecretary />
  </div>
</template>

<script>
import MainSecretary from "../components/SecretaryInfo/Main.vue";

export default {
  name: "SecretaryInfoView",
  components: {
    MainSecretary,
  },
};
</script>
