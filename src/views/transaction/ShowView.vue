<template>
    <v-toolbar density="compact" color="transparent">
        <v-toolbar-title>Jfpk <a v-if="index.periode">{{ index.periode.nama }}</a></v-toolbar-title>
        <v-spacer></v-spacer>
        <router-link to="/data" class="custom-link">
            <v-btn text small color="info">
                <v-icon left>
                    mdi-chevron-left
                </v-icon>
                Kembali
            </v-btn>
        </router-link>
    </v-toolbar>
    
    <section>
        <v-row class="mb-4" >
            <v-col sm="12" md="4">
                <v-card>
                    <v-card-text v-if="index.pegawai">
                        <v-list-item :prepend-avatar="'https://sisdm.bpk.go.id/photo/' + index.nip + '.jpg'"
                            :title="index.pegawai.nama"
                            :subtitle="index.nip +' / '+ index.pegawai.nip_baru"
                            class="px-0"
                            style="min-height: unset;"
                            >
                        </v-list-item>
                        <!-- <v-card-subtitle class="pl-0">{{ index.pegawai.jabatan }}</v-card-subtitle> -->
                        <v-card-subtitle class="pl-0">{{ index.pegawai.unit_org }}</v-card-subtitle>
                        {{ index.pegawai.unit_org_induk }}
                    </v-card-text>
                    <v-card-text style="padding: 5px 23px;" v-else>
                        <content-loader>
                            <rect x="0" y="0" rx="100" ry="100" width="70" height="70" />
                            <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
                            <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
                            <rect x="10" y="80" rx="3" ry="3" width="350" height="30" />
                        </content-loader>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col sm="12" md="8">
                <v-card>
                    <v-timeline side="end" align="start" direction="horizontal"  v-if="index.atasan">
                        <v-timeline-item dot-color="purple-lighten-2" icon="mdi-check" size="small" class="mt-2">
                            <div style="position: relative; top: -10px;">
                                <strong class="mr-4">Persetujuan Atasan Langsung</strong>
                                <br> {{ index.atasan.nip }} - {{ index.atasan.nama }}
                            </div>
                        </v-timeline-item>

                        <v-timeline-item 
                            :dot-color="(index.tgl_penilai1) ? 'green-lighten-1' : 'grey'" 
                            :icon="(index.tgl_penilai1) ? 'mdi-check-all' : 'mdi-clock'" 
                            size="small" class="mt-2">
                            <div style="position: relative; top: -10px;">
                                <strong class="mr-4">{{ (index.tgl_penilai1) ? '' : 'Menunggu ' }} Penilaian 1</strong>
                                <br> {{ index.penilai1.nip }} - {{ index.penilai1.nama }}
                            </div>
                        </v-timeline-item>
                        
                        <v-timeline-item 
                            :dot-color="(index.tgl_penilai2) ? 'info' : 'grey'" 
                            :icon="(index.tgl_penilai2) ? 'mdi-check-all' : 'mdi-clock'" 
                            size="small" class="mt-2">
                            <div style="position: relative; top: -10px;">
                                <strong class="mr-4">{{ (index.tgl_penilai2) ? '' : 'Menunggu ' }} Penilaian 2</strong>
                                <br>{{ this.userLogin().name }}
                            </div>
                        </v-timeline-item>
                    </v-timeline>
                    <v-row v-else class="ma-2">
                        <v-col md="4">
                            <content-loader>
                                <rect x="10" y="5" rx="4" ry="4" width="400" height="120" />
                            </content-loader>
                        </v-col>
                        <v-col md="4">
                            <content-loader>
                                <rect x="10" y="5" rx="4" ry="4" width="400" height="120" />
                            </content-loader>
                        </v-col>
                        <v-col md="4">
                            <content-loader>
                                <rect x="10" y="5" rx="4" ry="4" width="400" height="120" />
                            </content-loader>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

      <v-card :loading="loading">
        <v-card-item v-if="!isMobile()">
            
            <v-chip-group mandatory>
                <v-chip :class="(!detail) ? 'text-info' : ''" @click="detail = false" style="border-radius: 5px;">
                    Summary
                </v-chip>
                <v-chip :class="(detail) ? 'text-info' : ''" @click="detail = true" style="border-radius: 5px;">
                    Detail 
                </v-chip>
                <v-badge color="info" inline style=" position: absolute; right: 15px; margin-top: 10px;"
                    v-if="index.atasan" :content="'AK Usulan ('+substringLimit(index.angka_kredit_usulan)+')'">
                </v-badge>
            </v-chip-group>
            <template v-if="!detail">
                <v-table class="mt-3">
                    <thead>
                        <tr>
                            <th class="text-left pr-0" style="width: 5px;"> No</th>
                            <th class="text-left" style="width: 400px;"> Uraian Kegiatan</th>
                            <th class="text-center"> Kd Butir</th>
                            <th class="text-center"> AK</th>
                            <th class="text-center"> Volume</th>
                            <th class="text-center"> Koefisien</th>
                            <th class="text-center"> AK usulan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loadingTable">
                            <td class="text-center" colspan="7">Loading...</td>
                        </tr>
                        <tr v-else-if="errored">
                            <td class="text-center" colspan="7">Terjadi kesalahan, silahkan reload halaman</td>
                        </tr>
                        <tr v-for="(aktivitas, indexAktivitas) in data" v-bind:key="aktivitas.id">
                            <template v-if="aktivitas.level == 1">
                                <td :id="indexAktivitas"  colspan="7" style="font-weight: bold;"> {{ aktivitas.uraian }} </td>
                            </template>
                            <template v-else-if="aktivitas.level == 2">
                                <td class="pr-0"> {{ aktivitas.no }} </td>
                                <td> {{ aktivitas.uraian }} </td>
                                <td class="text-center"> {{ aktivitas.kd_butir }} </td>
                                <td class="text-center"> {{ aktivitas.angka_kredit }} </td>
                                <td class="text-center"> {{ aktivitas.volume_lama }} </td>
                                <td class="text-center"> {{ aktivitas.koefisien }} </td>
                                <td class="text-center"> {{ aktivitas.jum_angka_kredit_lama }} </td>
                            </template>
                        </tr>
                    </tbody>
                </v-table>
            </template>  
            <template v-else>
                <v-table class="mt-3">
                    <thead>
                        <tr>
                            <th class="text-left pr-0"> No</th>
                            <th class="text-left" style="min-width: 290px;"> Uraian Kegiatan</th>
                            <th class="text-left px-0"> File</th>
                            <th class="text-center"> Tanggal</th>
                            <th class="text-center px-0"> Kd Butir</th>
                            <th class="text-center"> AK</th>
                            <th class="text-center px-0"> Koefisien</th>
                            <th class="text-center"> Volume (lama)</th>
                            <th class="text-center px-0"> Jml Angka Kredit(lama)</th>
                            <th class="text-center"> Volume Update</th>
                            <th class="text-center px-0" style="width: 50px;"> Perhitungan </th>
                            <th class="text-left" style="width: 200px;"> Catatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loadingTable">
                            <td class="text-center" colspan="12">Loading...</td>
                        </tr>
                        <tr v-else-if="errored">
                            <td class="text-center" colspan="12">Terjadi kesalahan, silahkan reload halaman</td>
                        </tr>
                        <tr v-for="(aktivitas, indexAktivitas) in data" v-bind:key="aktivitas.id"
                            :class="(data[indexAktivitas].koefisien == 0.8) ? 'bg-danger' : ''">
                            <template v-if="aktivitas.level == 1">
                                <td colspan="12" style="font-weight: bold;"> {{ aktivitas.uraian }} </td>
                            </template>
                            <template v-else-if="aktivitas.level == 3">
                                <td class="pr-0" style="vertical-align: top;"> {{ aktivitas.no }} </td>
                                <td> {{ aktivitas.uraian }} </td>
                                <td> {{ aktivitas.file }} </td>
                                <td> {{ aktivitas.tanggal }} </td>
                                <td class="px-0">
                                    <input type="hidden" 
                                        :id="aktivitas.jfpk_id"
                                        v-model="data[indexAktivitas].jfpk_id"
                                        readonly
                                    >
                                    <input type="text" 
                                        :id="indexAktivitas"
                                        class="text-center"
                                        style="width: 70px;" 
                                        v-model="data[indexAktivitas].kd_butir"
                                        readonly
                                    > 
                                    <ModalKegiatan 
                                        v-bind:nip="index.nip"
                                        v-bind:keyData="indexAktivitas" 
                                        v-bind:filterJabatan="filterJabatan"
                                        @modal-pick="modalPick">
                                    </ModalKegiatan>
                                </td>
                                <td class="text-center">
                                    <input type="text" :id="indexAktivitas" class="text-center"
                                        style="width: 70px;" 
                                        v-model="data[indexAktivitas].angka_kredit"
                                        readonly> 
                                </td>
                                <td class="text-center px-0">{{ data[indexAktivitas].koefisien }}</td>
                                <td class="text-center"> {{ aktivitas.volume_lama }} </td>
                                <td class="text-center">
                                    {{ aktivitas.jum_angka_kredit_lama }}
                                </td>
                                <td>
                                    <input class="text-center text-input-table" type="text" 
                                        v-model="data[indexAktivitas].volume_update" 
                                        @keyup="setNilaiUpdate(indexAktivitas)"
                                    >
                                </td>
                                <td class="text-center px-0" style="width: 50px;">{{ data[indexAktivitas].perhitungan }}</td>
                                <td class="text-center">
                                    <textarea class="textarea-input-table" v-model="data[indexAktivitas].catatan" >
                                    </textarea>
                                </td>
                            </template>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr v-if="!loadingTable">
                            <td colspan="8"></td>
                            <td colspan="2" style="font-weight: bold; text-align: right;" class="text-info"> AK Penilai : </td>
                            <td style="font-weight: bold; text-align: center;" class="text-info">
                                {{ sumPerhitungan }}
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </v-table>

                <template v-if="!index.tgl_penilai2">
                    <v-divider></v-divider>

                    <v-row class="pt-5 px-5">
                        <v-col md="12">
                            <div class="float-right">
                                <v-btn color="info" :loading="loadingButton" class="mr-2" size="small" prepend-icon="mdi-check" 
                                    @click="submitChange"> Simpan Perubahan </v-btn>
                                <v-btn color="info" :loading="loadingButton" size="small" prepend-icon="mdi-check-all" 
                                    @click="submitNext"> Ajukan Proses Rekonsiliasi </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </template>
            </template>
        </v-card-item>
        <v-card-item v-else>
            <v-list lines="three" v-for="jfpk in dataJfpk" :key="jfpk.id">
                <v-list-item>
                    Masih belum sampe sini
                </v-list-item>
                <v-divider></v-divider>
            </v-list>
        </v-card-item>
      </v-card>
    </section>
</template>
  
<script>

import ModalKegiatan from '/src/components/dialog/AktivitasJfpk.vue'

export default {
    // props: ['test'],
    name: 'App',
    components : {
        ModalKegiatan,
    }, 
    data() {
        return {
            loading: true,
            loadingTable: true,
            loadingButton: true,
            errored: false,
            id: this.$route.params.id,
            index: [],
            data: [],
            detail: true,
            filterJabatan: [],
            // sumPerhitungan: 0,
            config : {
                headers:{
                    // Authorization: 'Bearer 240003723',
                    Authorization: 'Bearer ' + this.$store.state.auth.user.accessToken,
                }
            },
        }
    },
    mounted() {
        this.getIndex();
    },
    computed: {
        sumPerhitungan() {
            let sumPerhitunganRows = 0;
            this.data.reduce((sum, aktivitas) => {
                if (aktivitas.perhitungan) {
                    sumPerhitunganRows = sumPerhitunganRows + parseFloat(aktivitas.perhitungan);
                    // return sum += aktivitas.perhitungan;
                }
            }, '-');

            if(sumPerhitunganRows.toString().length > 4)
                sumPerhitunganRows = sumPerhitunganRows.toString().substring(0, 5); //nilaiUpdate = nilaiUpdate.toFixed(4);

            return sumPerhitunganRows;
        },
    },
    methods: {  
        getIndex() {
            this.loading = true
            this.axios.get('jfpk/penilai/' + this.id, this.config)
            .then((response) => {
                this.index = response.data.data;
                this.getList()
                this.getJabatanUpDown()
                console.log('mounted');
            })
            .catch(error => {
                this.loading = true
                console.log(error)
            })
            .finally(
                () => this.loading = false
            )
        },
        getList() {
            this.loadingTable = true
            this.axios.get('jfpk/penilai-aktivitas?nip=' + this.index.nip + '&periode=' + this.index.periode.id + '&penilai=2', this.config)
            .then((response) => {
                this.data = response.data;
                this.loadingButton = false
            })
            .catch(error => {
                this.loading = true
                this.errorNotif(error)
            })
            .finally(
                () => this.loadingTable = false
            )
        },
        getJabatanUpDown() {
            this.axios.get('jfpk/penilai-jabatan?nip=' + this.index.nip, this.config)
            .then((response) => {
                this.filterJabatan = response.data;
            })
            .catch(error => {
                this.loading = true
                this.errorNotif(error)
            })
        },
        modalPick(resultModal) {
            this.data[resultModal.target].jfpk_id = resultModal.value.id
            this.data[resultModal.target].kd_butir = resultModal.value.kd_kegiatan
            this.data[resultModal.target].angka_kredit = resultModal.value.angka_kredit
            this.data[resultModal.target].koefisien = 1;
            if(this.index.pegawai.kd_jabatan > resultModal.value.kd_jabatan)
                this.data[resultModal.target].koefisien = 0.8;

            this.setNilaiUpdate(resultModal.target)
        },
        setNilaiUpdate(index) {
            console.log(this.data);
            let angkreUpdate = this.data[index].angka_kredit,
                volumeUpdate = this.data[index].volume_update,
                koefisienUpdate = this.data[index].koefisien;
            let nilaiUpdate = angkreUpdate * volumeUpdate * koefisienUpdate;

            if(nilaiUpdate.toString().length > 4)
                nilaiUpdate = nilaiUpdate.toString().substring(0, 5); //nilaiUpdate = nilaiUpdate.toFixed(4);
            this.data[index].perhitungan = nilaiUpdate
        },
        submitChange() {
            this.loadingButton = true
            this.$swal({
                icon: 'warning',
                title: 'Konfirmasi',
                text: "akan Simpan Perubahan, sebelum ajukan Rekonsiliasi?",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                denyButtonColor: '#59bbd4',
                confirmButtonText: 'Ya, submit',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.loadingButton = true
                    this.axios.post('jfpk/penilai', this.data, this.config)
                    .then((res) => {
                        this.getList()
                        this.successNotif(res.data.message)
                    })
                    .catch((error) => {
                        console.log(error)
                        this.errorNotif(error)
                    }).finally(() => {
                        //Perform action in always
                    });
                } else {
                    this.loadingButton = false
                }
            })
        },  
        submitNext() {
            this.loadingButton = true
            console.log(this.data);
            let hasNilaiUpdate = this.data[1].nilai_update
            if (hasNilaiUpdate) {
                this.$swal({
                    icon: 'warning',
                    title: 'Konfirmasi',
                    text: "akan Mengajukan Proses Rekonsiliasi?",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    denyButtonColor: '#59bbd4',
                    confirmButtonText: 'Ya, submit',
                    cancelButtonText: 'Batal',
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.loadingButton = true
                        const dataPatch = {
                            'id': this.index.id,
                            'status': 3,
                            'akPenilai2': this.sumPerhitungan,
                        }
                        this.axios.patch('jfpk/penilai/' + this.index.id, dataPatch, this.config)
                        .then((res) => {
                            this.successNotif(res.data.message)
                            this.getIndex()
                        })
                        .catch((error) => {
                            this.errorNotif(error)
                        }).finally(() => {
                            //Perform action in always
                    });
                    } else {
                        this.loadingButton = false
                    }
                })
            } else {
                this.errorNotif('Opps.. belum melalukan perubahan atau belum klik tombol "Simpan Perbuhan"')
                this.loadingButton = false
            }
        },
        isMobile() {
          if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true
          } else {
            return false
          }
        }
      }
    }
  </script>
  