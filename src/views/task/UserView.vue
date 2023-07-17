<template>
  <v-row>
      <v-col :cols="isMobile() ? '12' : '5'">
        <h2 class="mt-1 text-left">Daftar User</h2>
      </v-col>
      <v-col :cols="isMobile() ? '12' : '4'" class="text-right">
        <v-item-group selected-class="bg-red" class="text-left mt-1 mb-3"
          v-model="filters.admin" @click="getIndex">
          <v-item v-for="(val, key) in admins" :key="val.key" v-slot="{ selectedClass, toggle }">
            <v-chip filter :class="selectedClass" class="mr-1" @click="toggle" :id="key">
              {{ val.val }} 
            </v-chip>
          </v-item>
        </v-item-group>
      </v-col>
      <v-col lg="3" class="text-min">
        <v-text-field v-model="filters.q" label="Kata Kunci..." @keyup="getIndex" prepend-inner-icon="mdi-magnify" variant="outlined" class=""></v-text-field>
      </v-col>
  </v-row>

  <section v-if="errored">
      <v-alert type="error">We're sorry, we're not able to retrieve this information at the moment, please try back later</v-alert>
  </section>
  <section v-else>

    <template v-if="isMobile()" >
      <v-card v-if="loading">Loading...</v-card>
      <v-card class="text-left mt-2" 
        v-else  v-for="(user, index) in users" v-bind:key="user.id">
        <v-list>
          <v-list-item
            :title="user.name"
            :subtitle="user.email"
            class="px-0 py-0"
            style="min-height: unset;"
            >
            <template v-slot:prepend>
              <b class="mt-3 ml-4" style="width: 22px;">{{ index+1 }}</b>
              <img :src="user.avatar" referrerpolicy="no-referrer" class="img-user-avatar mr-2 mt-2"
                style="border-radius: 100%;" v-if="user">
            </template>
            <template v-slot:append>
              <v-chip class="ma-1" color="info" size="small" v-if="!user.admin">
                  <v-icon>mdi-{{ user.provider }}</v-icon> 
                </v-chip>
                <v-chip class="ma-1" color="red" size="small" v-else>
                  <small> Admin</small>
                </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </template>
    
    <v-card v-else
    :loading="loading"
    >
      <v-card-item>
        <v-row>
          <v-col lg="9" class="pb-0">
          </v-col>
          <v-col lg="3" class="pb-0">
          </v-col>
        </v-row>

        
        <!-- <v-divider></v-divider> -->
        <v-table class="mt-3 table-left">
          <thead>
            <tr>
              <th>No</th> 
              <th>User</th> 
              <th>No Hp</th> 
              <th>Transaksi</th> 
              <th class="text-center">Login Use</th>
              <th class="text-center"> Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td class="text-center" colspan="8">Loading...</td>
            </tr>
            <tr v-else-if="users.length == 0">
              <td class="text-center" colspan="8">Data tidak tersedia</td>
            </tr>
            <tr v-else
                v-for="(user, index) in users" v-bind:key="user.id">
              <td class="text-center">{{ index+1 }}</td>
              <td>
                <img :src="user.avatar" referrerpolicy="no-referrer" class="img-user-avatar mr-2 mt-0"
                  style="border-radius: 100%;" v-if="user">
                <v-list-item
                  :title="user.name"
                  :subtitle="user.email"
                  class="px-0 py-0"
                  style="min-height: unset;"
                  >
                </v-list-item>
              </td>
              <td>
                {{ user.phone }} 
              </td>
              <td>
                {{ user.transaction_success_total }} | {{ user.transaction_success_total_price }}
              </td>
              <td class="text-center">
                <v-chip class="ma-1" color="info" size="small" v-if="!user.admin">
                  <v-icon>mdi-{{ user.provider }}</v-icon> {{ user.provider }}
                </v-chip>
                <v-chip class="ma-1" color="red" size="small" v-else>
                  <small> Admin</small>
                </v-chip>
              </td>
              <td  class="text-center">
                {{ dateTimeOuput(user.created_at) }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-item>
    </v-card>
  </section>

</template>
  
<script>
  
  // import VueDatePicker from '@vuepic/vue-datepicker';
  // import '@vuepic/vue-datepicker/dist/main.css'
    export default {
      // components: { VueDatePicker },
      data() {
        return {
          admins: [ 
            {key: 0, val: 'Tampilkan Semua'}, 
            {key: 1, val: 'Admin'}, 
            {key: 2, val: 'User'}, 
            {key: 3, val: 'Fake'}, 
          ],
          users: [],
          loading: true,
          errored: false,
          filters:{
            q: '',
            admin: 2,
          },
        }
      },
      computed: {
      },
      mounted() {
        this.getIndex();
      },
      methods: {
        getIndex: function() {
          this.loading = true
          this.axios.post('user-data', this.filters, this.$store.state.config)
          .then((response) => {
            this.users = response.data.data;
          })
          .catch(error => {
            this.loading = true
            this.errorNotif(error)
          })
          .finally(
            () => this.loading = false
          )
        },
      }
    }
  </script>
  
  <style>
    .v-list-item-title {
      font-size: 14px !important;
    }
  </style>
  