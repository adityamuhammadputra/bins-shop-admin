<template>
  <div class="header-top">
    <v-container class="py-0 px-0">
      <v-toolbar color="white">
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
        <v-btn icon>
          <v-icon>mdi-fullscreen</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon :icon="'mdi-weather-' + switchLabel" class="mr-4" @click="toggleDarkMode"></v-icon>
        </v-btn>


        <v-spacer></v-spacer>
        <v-toolbar-title>
          <router-link to="/">
              <img src="/img/logo.png" alt="Site Logo" style="width: 55px; float: left;"/>
              <h4 class="float-left pt-3">Admin Panel</h4>
          </router-link> 
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-menu transition="scale-transition" >
          <template v-slot:activator="{ props }">
            <v-list v-bind="props">
              <v-list-item
                prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
                title="adityamuhammadputra"
                subtitle="admin"
              >
              </v-list-item>
            </v-list>
            <v-icon end class="ml-0"> mdi-menu-down </v-icon>

          </template>
          <v-card>
            <v-card-text class="pa-2">
              <v-list :lines="false" density="compact" nav>
                <router-link to="/profile" class="decoration-none">
                  <v-list-item active-color="primary" class="v-list-item-hover">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-account"></v-icon>
                    </template>
                    <v-list-item-title v-text="'Profile'"></v-list-item-title>
                  </v-list-item>
                </router-link>
                <v-list-item active-color="primary" class="cursor-pointer v-list-item-hover" @click.prevent="logOut">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-lock"></v-icon>
                  </template>
                  <v-list-item-title v-text="'Logout'"></v-list-item-title>
                </v-list-item>
              </v-list>

            </v-card-text>
          </v-card>
        </v-menu>

      </v-toolbar>
      
    </v-container>
  </div>

  <div class="header-bottom" id="myHeader">
    <v-container class="py-0 header-sticky">
      <v-toolbar color="white" >
        <template v-slot:extension>
          <v-tabs
            v-model="currentItem"
            fixed-tabs
          >
            <v-tab 
              v-for="item in items"
              :key="item.text"
              :value="'tab-' + item.text"
            >
            <router-link :to="item.url">
              <v-icon>mdi-{{ item.icon }}</v-icon> {{ item.text }}
            </router-link>    
            </v-tab>

            <v-menu
              v-if="more.length" 
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  variant="plain"
                  rounded="0"
                  class="align-self-center me-4"
                  :class="($route.path.includes('master')) ? 'active' : ''"
                  height="100%"
                  v-bind="props"
                >
                <v-icon>mdi-database-plus</v-icon> Master
                  <v-icon end>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>

              <v-list class="bg-grey-lighten-3">
                <v-list-item v-for="item in more" :key="item.name">
                  <router-link :to="item.url">
                    {{ item.name }}
                  </router-link>    
                </v-list-item>
              </v-list>
            </v-menu>
          </v-tabs>
        </template>
      </v-toolbar>
    </v-container>
  </div>
</template>


<script>

export default {
  data() {
    return {
      user: null,
      darkMode: false,
      currentItem: 'Dashboard',
      items: [
        {icon: 'home-analytics', text: 'Dashboard', url: '/'}, 
        {icon: 'playlist-edit', text: 'Transaksi', url: '/transaction'}, 
        {icon: 'forum-outline', text: 'Dikusi', url: '/discuss'},
        {icon: 'account-check', text: 'User', url: '/users'}
      ],
      more: [
        {name: 'Produk', url: '/master/product'},
        {name: 'Categori', url: '/master/category'},
        {name: 'Tutorial', url: '/master/tutorial'},
      ],
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    }
    },
    methods: {
      toggleDarkMode (e) {
        console.log(e);
      },
      stickyScroll: function() {
        window.onscroll = function() {
            var header = document.getElementById("myHeader");
            if (header) {
                var sticky = header.offsetTop;
                if (window.pageYOffset > sticky) {
                    header.classList.add("sticky");
                } else {
                    header.classList.remove("sticky");
                }
            }

        }
      },
    },
    mounted() {
      this.stickyScroll();
      if (this.$store.state.auth.user) 
        this.user = this.$store.state.auth.user.user;
    },
    computed: {
      switchLabel: function () {
        return this.darkMode ? 'sunny' : 'night';
      }
      // currentUser() {
      //   return this.$store.state.auth.user;
      // }
  }
    
}
</script>
