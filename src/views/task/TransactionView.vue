<template>
  <v-row>
      <v-col :cols="isMobile() ? '12' : '6'">
        <h2 class="mt-1 text-left">Daftar Pesanan</h2>
      </v-col>
      <v-col :cols="isMobile() ? '12' : '3'">
        <VueDatePicker v-model="filters.dates" range format="dd/MM/y" :enableTimePicker="false"/>
      </v-col>
      <v-col :cols="isMobile() ? '12' : '3'" class="text-min">
        <v-text-field v-model="filters.q" label="Kata Kunci..." @keyup="getIndex" prepend-inner-icon="mdi-magnify" variant="outlined" class=""></v-text-field>
      </v-col>
  </v-row>

  <section v-if="errored">
      <v-alert type="error">We're sorry, we're not able to retrieve this information at the moment, please try back later</v-alert>
  </section>
  <section v-else>
    <v-item-group multiple selected-class="bg-red" class="text-left mt-1 mb-3"
      v-model="filters.status" @click="getIndex">
      <v-item v-for="(val, key) in statuses" :key="key" v-slot="{ selectedClass, toggle }">
        <v-chip filter :class="selectedClass" class="mr-1" @click="toggle" >
          {{ val }} 
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
              <th>Total Harga</th>
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
                    :subtitle="detail.price_discount_rp + ' x ' + detail.qty"
                    class="px-0 py-0"
                    style="min-height: unset;"
                    >
                  </v-list-item>
                  <p style="color: grey;font-style: italic;">{{ detail.notes }}</p>
                </template>
              </td>
              <td>
                {{ transaction.total_rp }} 
              </td>
              <td class="text-center">
                <v-chip class="ma-1" :color="transaction.status.color" size="small">
                  <small>{{ transaction.status.name }}</small>
                </v-chip>
              </td>
              <td>
                {{ dateTimeOuput(transaction.updated_at) }}
              </td>
              <td>
                <v-btn size="small" flat v-if="transaction.status.id == 1" color="red" @click="updateStatus(transaction, 2)">
                  <v-icon>mdi-check-all</v-icon> Validasi
                </v-btn>
                <v-btn size="small" flat v-else-if="transaction.status.id == 2" color="info" @click="updateStatus(transaction, 3)">
                  <v-icon>mdi-check-all</v-icon> Kirim
                </v-btn>
                <v-btn size="small" flat v-else-if="transaction.status.id == 3" color="success" @click="updateStatus(transaction, 4)">
                  <v-icon>mdi-check-all</v-icon> Selesaikan
                </v-btn>
                <v-btn size="small" flat v-else-if="transaction.status.id == 9" color="success" @click="updateStatus(transaction, 10)">
                  <v-icon>mdi-cash-multiple</v-icon> Refund
                </v-btn>
                <template v-else>
                  <v-icon>mdi-check-all</v-icon> ok
                </template>
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
          statuses: [],
          transactions: [],
          loading: true,
          errored: false,
          filters:{
            q: '',
            dates: [this.dateNow('first'), this.dateNow('last')],
            status: [1, 2, 4],
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
          this.loading = true
          this.axios.post('transaction', this.filters, this.$store.state.config)
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
        updateStatus: function(transaction, status) {
          let attr;
          if (status == 2) {
              attr = {
                  'textHtml' : 'Sudah pastikan pembayaran <b>' + transaction.invoice + '</b> ?',
                  'textButton' : 'Ya, sudah',
              }
          }
          if (status == 3) {
              attr = {
                  'textHtml' : 'Sudah kirim Lisensi <b>' + transaction.invoice + '</b> ?',
                  'textButton' : 'Ya, sudah',
              }
          }

          if (status == 4) {
              attr = {
                  'textHtml' : 'Selesaikan transaksi <b>' + transaction.invoice + '</b> ? <p style="font-size: 14px;color: #8d8d8d;" class="mt-2">Pastikan pesanan pembeli sudah dikirim dan tidak ada masalah</p>',
                  'textButton' : 'Ya, selesaikan',
              }
          }
          this.$swal({
              title: "Konfirmasi !",
              html: attr.textHtml,
              showCancelButton: true,
              confirmButtonText: attr.textButton,
              cancelButtonText: 'Kembali',
              }).then((result) => {
              if (result.isConfirmed) {
                  this.axios.patch('transaction/' + transaction.id, {
                      status : status,
                  }, this.$store.state.config)
                  .then((response) => {
                      this.successNotif(response.data.message)
                      this.getIndex();
                  })
                  .catch(error => {
                      this.errorNotif(error)
                  })
              }
          })
        },
        getStatus: function() {
          this.axios.get('status', this.$store.state.config)
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
  