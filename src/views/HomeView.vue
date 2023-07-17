<template>
  <v-row>
      <v-col lg="9">
        <h2 class="mt-1 text-left">Aktivitias Hari ini</h2>
      </v-col>
      <v-col lg="3">
        <VueDatePicker v-model="filters.dates" range format="dd/MM/y" :enableTimePicker="false"/>
      </v-col>
  </v-row>

  <section v-if="errored">
      <v-alert type="error">We're sorry, we're not able to retrieve this information at the moment, please try back later</v-alert>
  </section>
  <section v-else>
    <v-row>
      <v-col lg="3" xs="12"  v-for="(row1, index) in dashboards.row1" v-bind:key="index">
        <v-card :color="row1.color">
          <v-card-text class="text-left icon-large">
            <router-link :to="row1.url" style="color: unset;text-decoration: none;">
              <v-list-item :prepend-icon="row1.icon" class="px-0 py-0" style="min-height: unset;">
                <div class="v-list-item__content mb-1" style="font-size: 20px;font-weight: bold;">
                  {{ row1.total }}
                </div>
                <div class="v-list-item-subtitle">
                  {{ row1.label }} <br/>
                  <small class="text-success" v-if="row1.price">Potensi{{ row1.price }}</small>
                  <small v-else>.</small>
                </div>
              </v-list-item>
            </router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-3 text-left">
      <v-col cols="12"> 
        <v-card :loading="loading">
          <v-row class="mt-1">
            <v-col cols="auto" v-for="(row2, index) in dashboards.row2" v-bind:key="index">
              <v-list-item style="min-height: unset;">
                <div class="v-list-item-subtitle">
                  {{ row2.label }}
                </div>
                <div class="v-list-item__content my-1" style="font-size: 20px;font-weight: bold;">
                  {{ row2.total }}
                </div>
                <small :style="'color:' + row2.stat_color"> {{ row2.stat }}</small>
              </v-list-item>
            </v-col>
          </v-row>

          <v-card-text class="" v-if="!loading">
            <div id="chart">
              <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
            </div>
          </v-card-text>
          
        </v-card>
      </v-col>
    </v-row>
  </section>

  <v-row class="mt-5" v-if="!loading">
    <!-- <v-col lg="12">
      <h2 class="mt-1 text-left">User Hari ini</h2>
    </v-col> -->

    <v-col lg="5">
      <v-card>
        <v-card-text class="text-left scroll-custom" style="max-height: 500px;overflow-y: auto;">
          <v-card-title class="text-left" style="font-size: 18px;">Last 50 Aktivitas</v-card-title>
          <v-timeline>
            <v-timeline-item size="large" v-for="(log, index) in userLogs" v-bind:key="index">
              <template v-slot:icon v-if="log.user">
                <v-avatar :image="log.user.avatar" referrerpolicy="no-referrer"></v-avatar>
              </template>
              <template v-slot:icon v-else>
                <v-icon>close</v-icon>
              </template>

              <template v-slot:opposite>
                <span>{{ dateTimeOuput3(log.created_at) }}</span>
              </template>
              <v-card class="elevation-2">
                <v-card-text class="pt-2 pb-2">
                  <h5 v-if="log.user">{{ log.user.name }}</h5>
                  {{ log.desc }} <br/>
                  <small style="color: #a1a1a1;">IP: {{ log.ip_address }}</small>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col lg="7">
      <v-card>
        <v-card-text class="text-left scroll-custom" style="max-height: 500px;overflow-y: auto;">
          <v-card-title class="text-left" style="font-size: 18px;">User Online</v-card-title>
          <v-table class="mt-3 table-left">
          <thead>
            <tr>
              <th>No</th> 
              <th>User</th> 
              <th>No Hp</th> 
              <th class="text-center"> Online Terakhir</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td class="text-center" colspan="8">Loading...</td>
            </tr>
            <tr v-else-if="userOnline.length == 0">
              <td class="text-center" colspan="8">Tidak ada user yg online</td>
            </tr>
            <tr v-else
                v-for="(user, index) in userOnline" v-bind:key="user.id">
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
              <td  class="text-center">
                {{ dateTimeOuput(user.last_seen) }}
              </td>
            </tr>
          </tbody>
        </v-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

</template>
  
<script>
  
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'

  import VueApexCharts from "vue3-apexcharts";
  // import { Bar } from 'vue-chartjs'
  // import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

  export default {
    components: { VueDatePicker, apexchart: VueApexCharts},
    data() {
      return {
        statuses: [],
        dashboards: [],
        loading: true,
        errored: false,
        filters:{
          dates: [this.dateNow('first'), this.dateNow('last')],
          replay: 2,
        },
        series: [],
        chartOptions: {
          chart: {
            height: 350,
            type: 'line',
            zoom: {
              enabled: false
            },
          },
          dataLabels: {
            enabled: false
          },
          // , '#E91E63', '#FF9800'
          colors: [],
          stroke: {
            width: [3, 3, 2, 2],
            curve: 'straight',
            dashArray: [5, 5, 0, 0]
          },
          title: {
            text: 'Statistik Pengunjung',
            align: 'left'
          },
          legend: {
            tooltipHoverFormatter: function(val, opts) {
              return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
            }
          },
         
          markers: {
            size: 0,
            hover: {
              sizeOffset: 6
            }
          },
          xaxis: {
            categories: [],
          },
          tooltip: {
            y: [
              {
                title: {
                  formatter: function (val) {
                    return val;
                  }
                }
              },
              {
                title: {
                  formatter: function (val) {
                    return val;
                  }
                }
              },
              {
                title: {
                  formatter: function (val) {
                    return val;
                  }
                }
              }
            ]
          },
          grid: {
            borderColor: '#f1f1f1',
          }
        },
        userLogs: [],
        userOnline: [],
      }
    },
    computed: {
    },
    mounted() {
      this.getDashboard();
    },
    methods: {
      getDashboard: function() {
        this.loading = true
        this.axios.post('dashboard', this.filters, this.$store.state.config)
        .then((response) => {
          this.dashboards = response.data;
          this.chartOptions.colors = response.data.row3.colors
          this.chartOptions.xaxis.categories = response.data.row3.categories
          this.series = response.data.row3.series
          this.userLogs = response.data.row4.logs
          this.userOnline = response.data.row4.user_online
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
  