<template>
  <v-row>
      <v-col lg="6">
        <h2 class="mt-1 text-left">Daftar Pesanan</h2>
      </v-col>
      <v-col lg="3">
        <VueDatePicker v-model="dates" range format="d/MM/y" :enableTimePicker="false"/>
      </v-col>
      <v-col lg="3">
        <v-text-field label="Kata Kunci..." prepend-inner-icon="mdi-magnify" variant="outlined" class=""></v-text-field>
      </v-col>
  </v-row>

  <section v-if="errored">
      <v-alert type="error">We're sorry, we're not able to retrieve this information at the moment, please try back later</v-alert>
  </section>
  <section v-else>
    <v-item-group multiple selected-class="bg-info" class="text-left mt-1 mb-3">
      <v-item v-for="status in statuses" :key="status.id" v-slot="{ selectedClass, toggle }" >
        <v-chip
          :class="selectedClass"
          class="mr-1"
          @click="toggle"
        >
          {{ status.name }}
        </v-chip>
      </v-item>
    </v-item-group>

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
              <th>Invoice</th> 
              <th>User</th> 
              <th>Produk</th>
              <th>Harga</th>
              <th class="text-center"> Status</th>
              <th class="text-center"> CreatedAt</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td class="text-center" colspan="8">Loading...</td>
            </tr>
            <tr v-else-if="transactions.length == 0">
              <td class="text-center" colspan="8">Data tidak tersedia</td>
            </tr>
            <tr v-else
                v-for="(transaction, index) in transactions" v-bind:key="transaction.id">
              <td class="text-center">{{ index+1 }}</td>
              <td class="text-center">{{ transaction.invoice }}</td>
              <td>
                <v-list-item :prepend-avatar="transaction.user.avatar"
                  :title="transaction.user.name"
                  :subtitle="transaction.user.phone"
                  class="px-0 py-0"
                  style="min-height: unset;"
                  >
                </v-list-item>
              </td>
              <td>
                <template v-for="detail in transaction.transaction_details" :key="detail.id">
                  <v-list-item :prepend-avatar="detail.product.file"
                    :title="detail.name"
                    :subtitle="detail.price_rp + ' x ' + detail.qty"
                    class="px-0 py-0"
                    style="min-height: unset;"
                    >
                  </v-list-item>
                </template>
              </td>
              <td>
                {{ transaction.total_rp }}  <!-- <v-badge color="info" :content="jfpk.jfpk_total" inline></v-badge> -->
              </td>
              <td class="text-center">
                <v-chip class="ma-1" :color="transaction.status.color" size="small">
                  <small>{{ transaction.status.name }}</small>
                </v-chip>
              </td>
              <td>
                {{ dateTimeOuput(transaction.created_at) }}
              </td>
              <td>
                <v-btn size="small" flat>
                  Proses
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-item>
    </v-card>
  </section>

</template>
  
<script>
  
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'
    export default {
      components: { VueDatePicker },
      data() {
        return {
          dates: ['2018-09-15', '2018-09-20'],
          statuses: [],
          transactions: [],
          loading: true,
          errored: false,
          filters:{
            onlyProgress : true,
          },
          config : {
            headers:{
              Authorization: 'Bearer ' + this.$store.state.auth.user.accessToken,
            }
          },
        }
      },
      computed: {
      },
      mounted() {
        this.getStatus();
      },
      methods: {
        getIndex: function() {
          var formData = new FormData();
          Object.entries(this.filters).forEach(([key, value]) => {
              formData.append(key, value);
          });

          this.loading = true
          this.axios.get('transaction', {formData}, this.config)
          .then((response) => {
            this.transactions = response.data.data;
          })
          .catch(error => {
            this.loading = true
            this.errorNotif(error)
          })
          .finally(
            () => this.loading = false
          )
        },
        getStatus: function() {
          this.axios.get('status', this.config)
          .then((response) => {
            this.statuses = response.data;
            this.getIndex();
          })
        },

      }
    }
  </script>
  
  <style>
    .v-list-item-title {
      font-size: 14px !important;
    }
  </style>
  