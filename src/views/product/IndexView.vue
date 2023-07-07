<template>
  <v-row>
    <v-col lg="5">
      <h2 class="mt-1 text-left">Daftar Produk</h2>
    </v-col>
    <v-col lg="2">
      <v-item-group multiple selected-class="bg-red" class="text-right mt-1 mb-3"
        v-model="filters.status" @click="getProduct(false)" >
        <v-item v-for="(val, key) in statuses" :key="key" v-slot="{ selectedClass, toggle }">
          <v-chip filter :class="selectedClass" class="mr-1" @click="toggle" >
            {{ val.val }} 
          </v-chip>
        </v-item>
      </v-item-group>
    </v-col>
    <v-col lg="3" class="text-min">
      <v-text-field v-model="filters.q" label="Kata Kunci..." @keyup="getProduct(false)" prepend-inner-icon="mdi-magnify" variant="outlined" class=""></v-text-field>
    </v-col>
    <v-col lg="2">
      <router-link to="/master/product/create">
        <v-btn flat color="success">
            <v-icon>mdi-plus</v-icon> Tambah Product
        </v-btn>
    </router-link> 
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
              <th class="text-center" style="width: 10px;">No</th> 
              <th>Produk</th> 
              <th class="text-center">Terjual</th> 
              <th class="text-center" style="width: 120px;">Diskon %</th> 
              <th class="text-center" style="width: 120px;">Stok</th> 
              <th class="text-center" style="width: 10px;"> Aktif</th>
              <th class="text-center"> Updated At</th>
              <th style="width: 155px;"> </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td class="text-center" colspan="8">Loading...</td>
            </tr>
            <tr v-else-if="products.length == 0">
              <td class="text-center" colspan="8">Data tidak tersedia</td>
            </tr>
            <tr v-else
                v-for="(product, index) in products" v-bind:key="product.id">
              <td class="text-center">{{ index+1 }}</td>
              <td>
                  <v-list-item :prepend-avatar="product.file"
                    :title="product.name"
                    class="px-0 py-0 pb-1"
                    style="min-height: unset;"
                    >
                    <div class="v-list-item-subtitle" v-if="product.discount">
                      <del style="color: #f55a4e;">{{ product.price_rp }}</del> 
                      {{ formatRupiah(product.price.replace(".", "") - (product.price.replace(".", "") * product.discount.replace("%", "") / 100), 'Rp ') }}
                    </div>
                    <div class="v-list-item-subtitle" v-else>{{ product.price_rp }}</div>
                  </v-list-item>
              </td>
              <td class="text-center">
                <v-chip class="ma-1" color="success" size="small">
                  <small>{{ product.sold }}</small>
                </v-chip>
              </td>
              <td class="text-min">
                <v-text-field v-model="products[index].discount"
                  class="text-center" variant="outlined" label="Diskon" hide-details
                  @blur="updateRow(product)"
                ></v-text-field>
              </td>
              <td class="text-min">
                <v-text-field v-model="products[index].stock"
                  class="text-center" variant="outlined" label="Ubah Stok" hide-details
                  @blur="updateRow(product)"
                ></v-text-field>
              </td>
              
              <td class="text-center">
                <v-switch v-model="products[index].status" 
                  @change="updateRow(product)"
                  color="info" :model-value="(products[index].status == 1) ? true : false"
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
                <router-link :to="'/master/product/' + product.slug + '/edit'">
                  <v-btn size="small" flat color="info">
                    <v-icon>mdi-pencil</v-icon> Edit
                  </v-btn>
                </router-link>
                <v-btn size="small" flat color="red" class="ml-1" @click="deleteProduct(product)">
                  <v-icon>mdi-delete</v-icon>
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
            sort: 2,
          },
          
        }
      },
      computed: {
      },
      mounted() {
        this.getProduct();
      },
      methods: {
        getProduct: function(loadingStatus = true) {
          this.loading = loadingStatus
          this.axios.post('product-data', this.filters, this.$store.state.config)
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
        updateRow: function(product) {
          this.axios.patch('product-row/' + product.id, product, this.$store.state.config)
          .then((response) => {
              this.successNotif(response.data.message)
              this.getProduct(false);
          })
          .catch(error => {
              this.errorNotif(error)
          })
        },
        deleteProduct: function(product) {
          this.$swal({
              title: "Konfirmasi !",
              html: "Hapus product <b>" + product.name + "</b> ?",
              showCancelButton: true,
              confirmButtonText: 'Ya, Hapus',
              cancelButtonText: 'Kembali',
              }).then((result) => {
              if (result.isConfirmed) {
                  this.axios.delete('product/' + product.id, this.$store.state.config)
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
  