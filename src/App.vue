<template>
  <div id="app">111</div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";

// import { createPromiseDialog } from "@/utils/createPromiseDialog";

// const dialog = createPromiseDialog(HelloWorld);

import dialog from "./components/HelloWorld.dialog";

export default {
  name: "App",
  mounted() {
    dialog();
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
