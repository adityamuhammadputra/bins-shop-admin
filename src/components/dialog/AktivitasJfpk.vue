<template>
  <v-dialog v-model="dialog">
  <template v-slot:activator="{ props }">
      <v-btn variant="text" size="small"
        icon="mdi-pencil-circle"
        color="blue-lighten-2"
        v-bind="props"
        style="width: 0px;"
        @click="showModal"
      >
      </v-btn>
      <v-tooltip activator="parent" location="top">Edit</v-tooltip>
  </template>
    <v-card>
      <v-card-item>
        <v-card-title>
          Daftar Kegiatan untuk Aktivitas
          <a class="float-right text-info" @click="dialog = false" style="cursor: pointer;">x</a>
        </v-card-title>
        <v-row style="background: #f9f9f9; padding: 10px; margin: 5px; border-radius: 5px;" class="mt-5">
          <v-col md="12" class="pa-0">
            <v-card-subtitle><b>Filter : </b></v-card-subtitle>
          </v-col>

          <v-col md="2" class="pa-0">
            <v-checkbox dense label="Tugas Limpa" v-model="filters.tugasLimpa" @change="tugasLimpa"></v-checkbox>
          </v-col>
          <v-col md="6" class="pa-0" v-show="filters.tugasLimpa"
            >
            <v-select label="." 
              variant="underlined" 
              @update:modelValue="onChangeSelect"
              :items="filterJabatan" item-title="NmJabatan" item-value="KdJabatan"
              v-model="filters.kdJabatan"
            ></v-select>
          </v-col>
          <!-- <v-col md="6" class="pa-0" v-else>
          </v-col> -->
          
        </v-row>
           
        <v-row class="mt-2">
          <v-col md="3" offset="9">
            <v-text-field dense label="Cari" variant="underlined" append-icon="mdi-magnify"
              v-model="meta.q" @keyup="getListModal(); loadingDialog = false;">
            </v-text-field>
          </v-col>
        </v-row>

        <v-table>
          <thead>
              <tr>
                  <th class="text-left"> Kd Kegiatan</th>
                  <th class="text-left" style="width: 230px;"> Nama Kegiatan</th>
                  <th class="text-left" style="width: 230px;"> Satuan Hasil</th>
                  <th class="text-left"> Angka Kredit</th>
                  <th class="text-center"> Nama Jabatan</th>
                  <th class="text-center"> </th>
              </tr>
          </thead>
          <tbody>
              <tr v-if="loadingDialog">
                <td class="text-center" colspan="6">Loading...</td>
              </tr>
              <tr v-else 
                v-for="(kegiatan, indexkegiatan) in data" v-bind:key="kegiatan.id">
                <td>{{ kegiatan.kd_kegiatan }}</td>
                <td>{{ kegiatan.nm_kegiatan }}</td>
                <td>{{ kegiatan.satuan_hasil }}</td>
                <td>{{ kegiatan.angka_kredit }}</td>
                <td>{{ kegiatan.nm_jabatan }}</td>
                <td>
                  <v-btn variant="outlined" icon color="info" size="x-small" 
                      :row="indexkegiatan" @click="modalPick(kegiatan); dialog = false">
                    <v-icon>mdi-check-all</v-icon>
                    <v-tooltip activator="parent" location="top">Pilih</v-tooltip>
                  </v-btn>
                </td>
              </tr>
          </tbody>
        </v-table>
        <template v-if="loadingDialog">
          <v-row>
            <v-col cols="4">
              <content-loader>
                <rect x="10" y="20" rx="3" ry="3" width="370" height="30" />
              </content-loader>
            </v-col>
            <v-col cols="4" offset="4">
              <content-loader>
                <rect x="10" y="20" rx="3" ry="3" width="370" height="40" />
              </content-loader>
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <v-row>
            <v-col cols="4">
              <p class="mt-5 pt-5 ml-4 text-grey">Menampilkan {{ meta.from }} - {{ meta.to }} dari {{ meta.total }} data</p>
            </v-col>
            <v-col cols="4" offset="4">
              <v-container class="max-width">
                <v-pagination
                  v-model="meta.page" class="my-4" :length="meta.length" @click="getListModal"
                ></v-pagination>
              </v-container>
            </v-col>
          </v-row>
        </template>

      </v-card-item>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props : ['keyData', 'filterJabatan', 'nip'],
  data () {
    return {
      dialog: false,
      loadingDialog: true,
      data: [],
      resultModal: null,
      filters: {
        nip: this.nip,
        kdJabatan: '',
        tugasLimpa: '',
      },
      meta: {
        page: 1,
        q:'',
        length: null,
        from:'',
        to:'',
        total: null,
      },
      config: {
        headers:{
          Authorization: 'Bearer ' + this.$store.state.auth.user.accessToken,
        }
      },
    }
  },
  mounted() {
    this.filters.kdJabatan = this.filterJabatan[0].KdJabatan;
    // this.getListModal();
  },
  methods: {
    tugasLimpa: function() {
      if(!this.filters.tugasLimpa)
        this.filters.tugasLimpa = ''
      this.getListModal()
    },
    onChangeSelect: function(value) {
      this.filters.kdJabatan = value;
      this.getListModal();
    },
    modalPick: function(value, label = null) {
      this.resultModal = {
        target: this.keyData,
        value: value,
        label: label,
      }
      this.$emit('modal-pick', this.resultModal)
    }, 
    showModal() {
      this.loadingDialog = true
      this.getListModal();
    },
    getListModal: function() {
        this.axios.get('jfpk/penilai-kegiatan?page=' + this.meta.page + '&q=' + this.meta.q + '&nip=' + this.filters.nip + '&KdJabatan=' + this.filters.kdJabatan + '&tugas_limpa=' + this.filters.tugasLimpa, this.config)
        .then((response) => {
            this.data = response.data.data;
            this.meta.length = response.data.meta.last_page
            this.meta.page = response.data.meta.current_page
            this.meta.total = response.data.meta.total
            this.meta.from = response.data.meta.from
            this.meta.to = response.data.meta.to
            // this.kdKegiatanInput[resultModal.target] = 'x';
        })
        .catch(error => {
            this.loading = true
            console.log(error)
        })
        .finally(
            () => this.loadingDialog = false
        )
    },
  }
}
</script>

<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform .2s ease-in-out;
}
</style>>