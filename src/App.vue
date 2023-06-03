<template>
  <v-app :theme="theme">
    <template v-if="$route.fullPath === '/login'">
      <v-main>
          <router-view/>
      </v-main>
    </template>
    <template v-else>
      <HeaderTemp></HeaderTemp>
      <v-main style="--v-layout-top: 120px;">
        <v-container>
          <router-view/>
        </v-container>
      </v-main>
      <FooterTemp></FooterTemp>
    </template>
  </v-app>  
</template>


<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>

<script>


import HeaderTemp from './components/TempHeader.vue'
import FooterTemp from './components/TempFooter.vue'
import { ref } from 'vue'

export default {
    components : {
      FooterTemp,
      HeaderTemp,
    }, 
    data() {
        return {
          theme: ref('light'),
        }
    },
    methods: {
      onClick() {
        this.theme.value = this.theme.value === 'light' ? 'dark' : 'light'
        console.log(this.theme.value);
      },
    }
}


</script>