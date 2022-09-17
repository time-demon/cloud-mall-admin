<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    // const ignore = ['src\\components', 'src\\views']
    // for (const str on ignore) {
    //   console.log(str);
    // }
  },
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
}

a {
  text-decoration: none;
  color: inherit;
}

li {
  list-style: none;
}

#app {
  font-family: 14px Helvetica Neue, Helvetica, PingFang SC, Tahoma, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  width: 100%;
  height: 100%;
  min-height: 100% !important;
}

.my-dialog {
  margin: 0 !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
</style>
