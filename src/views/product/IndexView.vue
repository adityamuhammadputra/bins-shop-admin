<template>
  <v-row>
      <v-col lg="6">
        <h2 class="mt-1 text-left">Daftar Product</h2>
      </v-col>
      <v-col lg="2">
        <v-item-group multiple selected-class="bg-red" class="text-right mt-1 mb-3"
          v-model="filters.status" @click="getIndex" >
          <v-item v-for="(val, key) in statuses" :key="key" v-slot="{ selectedClass, toggle }">
            <v-chip filter :class="selectedClass" class="mr-1" @click="toggle" >
              {{ val.val }} 
            </v-chip>
          </v-item>
        </v-item-group>
      </v-col>
      <v-col lg="3">
        <v-text-field v-model="filters.q" label="Kata Kunci..." @keyup="getIndex" prepend-inner-icon="mdi-magnify" variant="outlined" class=""></v-text-field>
      </v-col>
      <v-col lg="1">
        <v-btn flat color="success">
          <v-icon>mdi-plus</v-icon> Tambah
        </v-btn>
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
              <th class="text-center">No</th> 
              <th>Produk</th> 
              <th class="text-center">Stok</th> 
              <th class="text-center">Terjual</th> 
              <th class="text-center" style="width: 10px;"> Aktif</th>
              <th class="text-center"> CreatedAt</th>
              <th style="width: 10px;"> </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td class="text-center" colspan="6">Loading...</td>
            </tr>
            <tr v-else-if="products.length == 0">
              <td class="text-center" colspan="6">Data tidak tersedia</td>
            </tr>
            <tr v-else
                v-for="(product, index) in products" v-bind:key="product.id">
              <td class="text-center">{{ index+1 }}</td>
              <td>
                  <v-list-item :prepend-avatar="product.file"
                    :title="product.name"
                    :subtitle="product.price_rp"
                    class="px-0 py-0"
                    style="min-height: unset;"
                    >
                  </v-list-item>
              </td>
              <td class="text-center">
                <v-chip class="ma-1" :color="(product.stock < 10) ? 'warning' : 'info'" size="small">
                  <small>{{ product.stock }}</small>
                </v-chip>
              </td>
              <td class="text-center">
                <v-chip class="ma-1" color="success" size="small">
                  <small>{{ product.sold }}</small>
                </v-chip>
              </td>
              <td class="text-center">
                <v-switch
                  v-model="products[index].status" color="info"
                  :model-value="(products[index].status == 1) ? true : false"
                  hide-details
                ></v-switch>
                <!-- <template v-if="product.status == 1">
                  <v-icon>mdi-check-all</v-icon> Aktif
                </template>
                <template v-else>
                  <v-icon>mdi-cancel</v-icon> Tidak
                </template> -->
              </td>
              <td class="text-center">
                {{ dateTimeOuput(product.updated_at) }}
              </td>
              <td>
                <v-btn size="small" flat color="info">
                  <v-icon>mdi-pencil</v-icon> Edit
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
  
  // import VueDatePicker from '@vuepic/vue-datepicker';
  // import '@vuepic/vue-datepicker/dist/main.css'
    export default {
      // components: { VueDatePicker },
      data() {
        return {
          statuses: [
            {key: 0, val: 'Tidak Aktif'}, 
            {key: 1, val: 'Aktif'}, 
          ],
          products: [],
          loading: true,
          errored: false,
          filters:{
            q: '',
            status: [1],
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
        this.getIndex();
      },
      methods: {
        getIndex: function() {
          this.loading = true
          this.axios.post('product', this.filters, this.config)
          .then((response) => {
            this.products = response.data.data;
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
                  }, this.config)
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
      }
    }
  </script>
  
  <style>
    .v-list-item-title {
      font-size: 14px !important;
    }
  </style>
  