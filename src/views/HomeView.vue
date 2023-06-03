<template >
  <v-row class="margin-left">
    <v-col cols="12" class="text-left">
      <h3>Aktivitas Hari ini </h3>
    </v-col>
    <v-col lg="2" sm="3">
      <v-card>
        <a class="v-list-item v-list-item--link v-theme--light v-list-item--border v-list-item--density-default v-list-item--two-line v-list-item--rounded v-list-item--variant-text" 
          href="/" tabindex="0">
          <div class="v-list-item__prepend">
            <div class="v-avatar v-theme--light v-avatar--density-default v-avatar--size-default v-avatar--variant-flat">
              <v-icon start size="large" color="blue-darken-2">mdi-magnify</v-icon>
            </div>
          </div>
          <div class="v-list-item__content" data-no-activator="">
            <div class="v-list-item-title">10</div>
            <div class="v-list-item-subtitle">Pesanan Baru</div><!---->
          </div><!---->
        </a>
      </v-card>
    </v-col>
    <v-col lg="2" sm="3">
      <v-card>
        test2
      </v-card>
    </v-col>
    <v-col lg="2" sm="3">
      <v-card>
        test3
      </v-card>
    </v-col>
    <v-col lg="2" sm="3">
      <v-card>
        test
      </v-card>
    </v-col>
    <v-col lg="2" sm="3">
      <v-card>
        test2
      </v-card>
    </v-col>
    <v-col lg="2" sm="3">
      <v-card>
        test1
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  data() {
    return {
      user: null,
    }
  },
  mounted() {
    // this.user = this.userLogin();
    // this.getIndex();
  },
}
</script>
<style>


    
</style>
