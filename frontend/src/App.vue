<template>
  <v-app style="background-color: black">

        <router-view v-on:error="login" style="z-index: 0"/>


  </v-app>
</template>

<script>


export default {
  name: "App",
  methods: {
    login: function () {
      window.location.href = '/';
    }
  }
}
</script>

<style scoped>
</style>