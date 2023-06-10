<template>
  <v-row :loading="loading">
    <v-col lg="5">
      <h2 class="mt-1 text-left">Daftar Diskusi </h2>
    </v-col>
    <v-col lg="4">
      <v-item-group selected-class="bg-red" class="text-right mt-1 mb-3"
        v-model="filters.replay" @click="getDiscuss(false)" >
        <v-item v-for="(val, key) in replayArr" :key="key" v-slot="{ selectedClass, toggle }">
          <v-chip filter :class="selectedClass" class="mr-1" @click="toggle" >
            {{ val.val }} 
          </v-chip>
        </v-item>
      </v-item-group>
    </v-col>
    <v-col lg="3" class="text-min">
      <v-text-field v-model="filters.q" label="Kata Kunci..." @keyup="getDiscuss(false)" prepend-inner-icon="mdi-magnify" variant="outlined" class=""></v-text-field>
    </v-col>
  </v-row>

  <section v-if="errored">
      <v-alert type="error">We're sorry, we're not able to retrieve this information at the moment, please try back later</v-alert>
  </section>
  <section v-if="discusses.length > 0">
    <v-card class="text-left mb-4" v-for="(discuss, index) in discusses" v-bind:key="index">
      <v-card-item class="border-bottom">
        <v-card-title>
          <v-list-item :prepend-avatar="discuss.product.file" :title="discuss.product.name"
            class="px-0 py-0 pb-1 avatar-flat" style="min-height: unset;"
            >
            <div class="v-list-item-subtitle" v-if="discuss.product.discount">
              <del style="color: #f55a4e;">{{ discuss.product.price_rp }}</del> {{ discuss.product.price_final_rp }}
            </div>
            <div class="v-list-item-subtitle" v-else>{{ discuss.product.price_rp }}</div>
          </v-list-item>
        </v-card-title>
      </v-card-item>
      <v-card-text class="mt-3">
        <v-list-item :prepend-avatar="discuss.user.avatar" :title="discuss.user.name + ' - ' + dateTimeOuput2(discuss.created_at)"
          class="px-0 py-0 pb-1" style="min-height: unset;">
          <div class="v-list-item-subtitle">
            {{ discuss.desc }}
          </div>
        </v-list-item>

        <div class="replay">
            <template v-if="discuss.replay.length > 0" >
              <v-list-item
                v-for="replay in discuss.replay" v-bind:key="replay.id"
                :prepend-avatar="replay.user.avatar" :title="replay.user.name + ' - ' + dateTimeOuput2(replay.created_at)"
                class="px-0 py-0 pb-2" style="min-height: unset;">
                <div class="v-list-item-subtitle">
                  {{ replay.desc }}
                </div>
              </v-list-item>
            </template>

            <v-list-item
              :prepend-avatar="user.avatar" :title="this.user.name"
              class="px-0 py-0 pb-3 mt-2" style="min-height: unset;">
              <div class="v-list-item-subtitle">
                <v-text-field clearable label="Balas" :hide-details="true"  variant="underlined" 
                  v-model="replayInput[index]" v-on:keyup.enter="postDiscuss(discuss, index, discuss.id)"></v-text-field>
              </div>
            </v-list-item>
        </div>
        
      </v-card-text>
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
          replayArr: [
            {key: 0, val: 'Tampilkan Semua'}, 
            {key: 1, val: 'Sudah Respon'}, 
            {key: 2, val: 'Belum Respon'}, 
          ],
          discusses: [],
          loading: true,
          errored: false,
          user: false,
          replayInput: [],
          filters:{
            q: '',
            replay: 2,
            sort: 2,
          },
          
        }
      },
      computed: {
      },
      mounted() {
        if (this.$store.state.auth.user) 
            this.user = this.$store.state.auth.user.user;
        this.getDiscuss();
      },
      methods: {
        getDiscuss: function(loadingStatus = true) {
          this.loading = loadingStatus
          this.axios.post('discuss-data', this.filters, this.$store.state.config)
          .then((response) => {
            this.discusses = response.data.data;
          })
          .catch(error => {
            this.loading = true
            this.errorNotif(error)
          })
          .finally(
            () => this.loading = false
          )
        },
        postDiscuss: function(discus, key, parent = null) {
            let dataDiscus = {
              desc: this.replayInput[key],
              product_id: discus.product.id,
              parent: parent,
            }
            this.axios.post('discuss', dataDiscus, this.$store.state.config)
            .then((response) => {
                this.successNotif(response.data.message)
                this.replayInput = [];
              this.getDiscuss();

            })
            .catch(error => {
                this.errorNotif(error)
            })
            .finally(
                () => this.loadingButton = false
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
  