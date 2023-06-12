<template>
  <v-row>
      <v-col lg="5">
        <h2 class="mt-1 text-left">Daftar User</h2>
      </v-col>
      <v-col lg="4" class="text-right">
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

    <v-card
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
              <th class="text-center">Is Admin</th>
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
                <v-list-item :prepend-avatar="user.avatar"
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
                <v-chip class="ma-1" :color="(user.admin) ? 'success' : 'info'" size="small">
                  <small> {{ (user.admin) ? 'Admin' : 'Biasa' }}</small>
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
            {key: 1, val: 'Hanya Admin'}, 
            {key: 2, val: 'Selain Admin'}, 
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
  