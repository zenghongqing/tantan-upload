<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
body {
  color: #000;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 14px;
  /*overflow-x: hidden;*/
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  position: absolute;
  white-space: nowrap;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
}
a {
  text-decoration: none;
}
li {
  list-style: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
