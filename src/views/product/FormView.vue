<template>
  <v-row class="mb-3">
    <v-col lg="6">
      <h2 class="mt-1 text-left">Tambah Produk</h2>
    </v-col>
    <!-- <v-col lg="6" class="text-right">
      <router-link to="/master/product">
        <v-btn flat variant="outlined" color="grey"> <v-icon>mdi-arrow-left</v-icon> Kembali </v-btn>
      </router-link>
    </v-col> -->
  </v-row>
  <v-card class="text-left">
    <v-card-item>
      <v-card-title>Informasi Produk</v-card-title>
      <!-- <v-card-subtitle>Pastikan produk tidak melanggar Hak Kekayaan Intelektual supaya produkmu tidak diturunkan</v-card-subtitle> -->
    </v-card-item>

    <v-card-text class="mt-2">
      <v-row>
        <v-col cols="4">
          <h4>Nama Produk <small class="text-red">*</small></h4>
          <small>Nama produk min. 40 karakter dengan memasukkan merek, jenis produk, warna, bahan, atau tipe.</small><br/>
          <small>Disarankan untuk tidak menggunakan huruf kapital berlebih, memasukkan lebih dari 1 merek, dan kata-kata promosi.</small>
        </v-col>
        <v-col cols="8">
          <v-text-field v-model="product.name" placeholder="Nama Produk" variant="outlined"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="4">
          <h4>Kategori <small class="text-red">*</small> </h4>
          <small>Pilih kategori yang sesuai agar mudah ditemukan oleh Pembeli</small>
        </v-col>
        <v-col cols="3">
          <v-select 
            v-model="product.category_id" 
            :items="categories" item-title="name" item-value="id" chips variant="outlined" aria-required="true"></v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="text-left mt-5">
    <v-card-item>
      <v-card-title>Detail Produk</v-card-title>
    </v-card-item>

    <v-card-text class="mt-2">
      <v-row>
        <v-col cols="4">
          <h4>Foto Produk <small class="text-red">*</small></h4>
          <small>Format gambar .jpg .jpeg .png dan ukuran minimum 300 x 300px (Untuk gambar optimal gunakan ukuran minimum 700 x 700 px).</small><br/>
          <small>Upload min. 3 foto yang menarik dan berbeda satu sama lain untuk menarik perhatian pembeli.</small>
        </v-col>
        <v-col cols="8" v-if="!loading">
          <table style="width: 100%;">
            <tr>
              <td>
                <v-file-input class="input-file-preview" @change="previewImg" id="img1" v-model="product.img1"></v-file-input>
                <v-img :src="preview.img1" :width="150" class="img-no-contain"></v-img>
              </td>
              <td>
                <v-file-input class="input-file-preview" @change="previewImg" id="img2" v-model="product.img2"></v-file-input>
                <v-img :src="preview.img2" :width="150" class="img-no-contain"></v-img>
              </td>
              <td>
                <v-file-input class="input-file-preview" @change="previewImg" id="img3" v-model="product.img3"></v-file-input>
                <v-img :src="preview.img3" :width="150" class="img-no-contain"></v-img>
              </td>
              <td>
                <v-file-input class="input-file-preview" @change="previewImg" id="img4" v-model="product.img4"></v-file-input>
                <v-img :src="preview.img4" :width="150" class="img-no-contain"></v-img>
              </td>
              <td>
                <v-file-input class="input-file-preview" @change="previewImg" id="img5" v-model="product.img5"></v-file-input>
                <v-img :src="preview.img5" :width="150" class="img-no-contain"></v-img>
              </td>
            </tr>
          </table>
        </v-col>
      </v-row>

      <v-row class="mb-10 pb-2">
        <v-col cols="4">
          <h4>Deskripsi Produk <small class="text-red">*</small> </h4>
          <small>Pastikan deskripsi produk memuat penjelasan detail terkait produk</small> <br/>
          <small>Disarankan untuk tidak memasukkan info nomor HP, e-mail, dsb. ke dalam deskripsi produk untuk melindungi data pribadimu.</small>
        </v-col>
        <v-col cols="8" style="height: 250px;">
          <QuillEditor theme="snow" toolbar="minimal" 
            v-model:content="product.desc" contentType="html"
            placeholder="Tulis deskripsi produkmu min. 260 karakter" />
          <!-- <v-textarea v-model="product.desc" placeholder="Tulis deskripsi produkmu min. 260 karakter" variant="outlined" ></v-textarea> -->
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="text-left mt-5">
    <v-card-item>
      <v-card-title>Harga</v-card-title>
    </v-card-item>

    <v-card-text class="mt-2">
      <v-row>
        <v-col cols="4">
          <h4>Harga Satuan <small class="text-red">*</small> </h4>
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="product.price" prefix="Rp. " @keyup="setRupiah" placeholder="Masukan Harga" variant="outlined">
            <!-- <template v-slot:prepend>Rp.</template> -->
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <h4>Minimum Pemesanan </h4>
          <small>Minimum yang harus dibeli untuk produk ini</small><br/>
        </v-col>
        <v-col cols="2">
          <v-text-field v-model="product.minorder" min="1" @keyup="formatNumber" placeholder="Minimal Pesan" variant="outlined"></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="text-left mt-5">
    <v-card-item>
      <v-card-title>Pengelolaan Produk</v-card-title>
    </v-card-item>

    <v-card-text class="mt-2">
      <v-row>
        <v-col cols="4">
          <h4>Status Produk </h4>
          <small>Produkmu dapat dicari oleh calon pembeli, jika status aktif</small><br/>
        </v-col>
        <v-col cols="2">
          <v-switch v-model="product.status" 
              color="info" :model-value="(product.status == 1 ) ? true : false"
              hide-details
          ></v-switch>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="4">
          <h4>Stok Produk<small class="text-red">*</small> </h4>
        </v-col>
        <v-col cols="2">
          <v-text-field v-model="product.stock" @keyup="formatNumber" placeholder="Masukan Jumlah Stok" variant="outlined"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <h4>Berat Produk</h4>
          <small>Diisi jika tersedia fisik</small><br/>
        </v-col>
        <v-col cols="2">
          <v-text-field v-model="product.weight" @keyup="formatNumber" suffix="gram" placeholder="Berat Produk" variant="outlined"></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-row justify="end">
    <v-col cols="2" end class="text-right mt-4">
      <router-link to="/master/product">
        <v-btn variant="outlined" block > 
            Batal
        </v-btn> 
      </router-link>
    </v-col>
    <v-col cols="2" end class="text-right mt-4" v-if="this.$route.name && this.$route.params.slug">
      <v-btn variant="flat" block color="blue-darken-4" @click="patchProduct" :loading="loading"> <v-icon>mdi-check</v-icon> Perbaharui</v-btn>
    </v-col>
    <v-col cols="2" end class="text-right mt-4" v-else>
      <v-btn variant="flat" block color="blue-darken-4" @click="postProduct" :loading="loading"> <v-icon>mdi-check</v-icon> Simpan</v-btn>
    </v-col>
  </v-row>
</template>
  
<script>
  
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
// import '@vueup/vue-quill/dist/vue-quill.bubble.css';
  // import VueDatePicker from '@vuepic/vue-datepicker';
  // import '@vuepic/vue-datepicker/dist/main.css'
    export default {
      components: { QuillEditor },
      data() {
        return {
          categories: [
            { name: 'Office', id: '1' },
            { name: 'Sistem Operasi', id: '2' },
          ],
          statuses: [
            {key: 0, val: 'Tidak Aktif'}, 
            {key: 1, val: 'Aktif'}, 
          ],
          product: {
            name: '',
            category_id: null,
            desc: '',
            img1: '',
            img2: '',
            img3: '',
            img4: '',
            img5: '',
            minorder: 1,
            price: 1,
            stock: 10,
            weight: 100,
            status: 1,
          },
          preview: {
            img1: '/img/previews.png',
            img2: '/img/previews.png',
            img3: '/img/previews.png',
            img4: '/img/previews.png',
            img5: '/img/previews.png',
          },
          loading: false,
          errored: false,
        }
      },
      computed: {
      },
      created() {
        this.getProduct();
      },
      mounted() {
        // this.getProduct();
      },
      methods: {
        getProduct: function(){
          if (this.$route.name && this.$route.params.slug) {
            this.loading = true
            this.axios.get('product/' + this.$route.params.slug, this.$store.state.config)
            .then((response) => {
              this.product = response.data.data;
              // this.product.price = formatRupiah(this.product.price)
              // console.log(this.product.price);
              let that = this
              this.product.files.map(function(value) {
                const imgs = ["img1", "img2", "img3", "img4", "img5"];
                imgs.forEach(function(item){
                  if (item == value.name) {
                    that.preview[item] = value.path;
                    // that.product[item] = value.path;
                  }
                })
              });
            })
            .catch(error => {
              this.loading = true
              this.errorNotif(error)
            })
            .finally(
              () => this.loading = false, 
            )
          }
        },
        postProduct: function() {
          this.loading = true
          let formData = new FormData();
          for ( var key in this.product) {
            if(this.product[key]) {
              let val = (typeof(this.product[key].value) !== 'undefined') ? this.product[key].value : this.product[key];
              formData.append(key, val);
            }
          }
          this.axios.post('product', formData, this.$store.state.config)
          .then((response) => {
            this.successNotif(response.data.message)
            // this.$router.push('/master/product');
            // this.products = response.data.data;
          })
          .catch(error => {
            this.loading = true
            this.errorNotif(error)
          })
          .finally(
            () => this.loading = false
          )
        },
        patchProduct: function() {
          // this.loading = true
          let formData = new FormData();
          for (var key in this.product) {
            if(this.product[key]) {
              let val = (typeof(this.product[key].value) !== 'undefined') ? this.product[key].value : this.product[key];
              // if (!key.includes('img')) 
              formData.append(key, val);
              formData.append('_method', 'patch');
            }
          }
          this.axios.post('product/' + this.$route.params.slug, formData, this.$store.state.config)
          .then((response) => {
            this.successNotif(response.data.message)
            this.$router.push('/master/product');
          })
          .catch(error => {
            this.loading = true
            this.errorNotif(error)
          })
          .finally(
            () => this.loading = false
          )
        },
        previewImg: function(e){
          const file = e.target.files[0], 
                idImg = e.target.id;
          
          // let that = this;
          // const imgs = ["img1", "img2", "img3", "img4", "img5"];
          // imgs.forEach(function(item){
          //   if (idImg === item) {
          //     eval(that.product.item = file);
          //     eval(that.preview.item = URL.createObjectURL(file));
          //   }
          // })

          if (idImg == 'img1') 
            this.preview.img1 = URL.createObjectURL(file), this.product.img1 = file;
          if (idImg == 'img2') 
            this.preview.img2 = URL.createObjectURL(file), this.product.img2 = file;
          if (idImg == 'img3') 
            this.preview.img3 = URL.createObjectURL(file), this.product.img3 = file;
          if (idImg == 'img4') 
            this.preview.img4 = URL.createObjectURL(file), this.product.img4 = file;
          if (idImg == 'img5') 
            this.preview.img5 = URL.createObjectURL(file), this.product.img5 = file;
        },
        setRupiah: function() {
          this.product.price = this.formatRupiah(this.product.price)
        },
        // setNumber: function(e){
        //   e.target.value = this.formatNumber(e.target.value);
        //   // return e.replace(/[^,\d]/g, '').toString()
        // }
      }
    }
  </script>
  
  <style>
    .v-list-item-title {
      font-size: 14px !important;
    }
  </style>
  