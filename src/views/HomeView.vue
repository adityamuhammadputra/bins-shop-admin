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
    <v-row >
      <v-col cols="3"  v-for="(row1, index) in dashboards.row1" v-bind:key="index">
        <v-card :color="row1.color">
          <v-card-text class="text-left icon-large">
            <router-link :to="row1.url" style="color: unset;text-decoration: none;">
              <v-list-item :prepend-icon="row1.icon" class="px-0 py-0" style="min-height: unset;">
                <div class="v-list-item__content mb-1" style="font-size: 20px;font-weight: bold;">
                  {{ row1.total }}
                </div>
                <div class="v-list-item-subtitle">
                  {{ row1.label }} <br/>
                  <small class="text-success" v-if="row1.price">Potensi {{ row1.price }}</small>
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
      <v-col lg="9">
        <h2 class="mt-1 text-left">Aktivitias User Hari ini</h2>
      </v-col>
      <v-col lg="3">
        <VueDatePicker v-model="filters.dates" range format="dd/MM/y" :enableTimePicker="false"/>
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
                    return val + " (mins)"
                  }
                }
              },
              {
                title: {
                  formatter: function (val) {
                    return val + " per session"
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
          console.log(response.data);
          this.dashboards = response.data;
          this.chartOptions.colors = response.data.row3.colors
          this.chartOptions.xaxis.categories = response.data.row3.categories
          this.series = response.data.row3.series
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
  