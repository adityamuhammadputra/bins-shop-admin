import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'


//style
import  './assets/css/style.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Axios
import axios from 'axios'

axios.defaults.baseURL = 'http://bins.local/api/v1/admin/'
// axios.defaults.baseURL = 'http://be.binsshop.tech/api/v1/admin/'


// http://localhost:8080/


import VueAxios from 'vue-axios'

//icon
import '@mdi/font/css/materialdesignicons.css'

// others
import moment from 'moment';
import { ContentLoader } from 'vue-content-loader'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { useToast } from "vue-toastification";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
// addIcons(FaFlag, RiZhihuFill);
// import VueApexCharts from 'vue-apexcharts'

const vuetify = createVuetify({
  components,
  directives,
})

const optionToast = {
    timeout: 5500
};
const toast = useToast();

const vueApp = createApp(App)
            .use(store)
            .use(router)
            .use(vuetify)
            .use(VueSweetalert2)
            .use(VueDatePicker)
            .use(Toast, optionToast)
            .use(VueAxios, axios)

vueApp.component("content-loader", ContentLoader)

// vueApp.component("v-icon", OhVueIcon);
vueApp.mixin({
    methods: {
        globalAlert: function (message) {
            this.$swal(message);
        },
        toItemTitle: function (arr) {
            const result = [];
            Object.keys(arr).forEach(function(key) {
                let valuePush = {
                    value: arr[key].Tahun,
                    title: arr[key].Nama,
                }
                result.push(valuePush);
            });
            return result;
        },
        strippedContent: function(string) {
            return string.replace(/<\/?[^>]+>/ig, " "); 
        },
        substringLimit: function(string) {
            if(string.length > 4)
                return string.substring(0, 4)
            return string
        },
        dateNow: function(firstOrLast = null) {
            if (firstOrLast) {
                if (firstOrLast == 'first') 
                    return moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD');
                return moment(new Date()).add(7, 'days').format('YYYY-MM-DD');
            }
            return moment(new Date()).format('YYYY-MM-DD');
        },
        dateOuput: function(date) {
            return moment(date).format('DD/MM/YYYY');
        },
        dateOuput2: function(date) {
            return moment(date).format('DD MMMM YYYY');
        },
        dateTimeOuput: function(date) {
            if (date)
                return moment(date).format('DD/MM/YYYY HH:mm');
            return '-';
        },
        dateTimeOuput2: function(date) {
            if (date)
                return moment(date).format('DD MMMM YYYY HH:mm');
            return '-';
        },
        dateTimeOuput3: function(date) {
            if (date)
                return moment(date).format('DD/MM/YY HH:mm');
            return '-';
        },
        findString: function(str) {
            console.log(str);
        },
        successNotif: function(msg) {
            toast(msg);
        },
        errorNotif: function(error) {
            toast.error(error.response.data.error);
            // let that = this;
            setTimeout(function() {
                if(error.response.status == 401) {
                    // that.logOut();
                }
           }, 2000);
        },
        userLogin: function(){
            return (this.$store.state.auth) ? this.$store.state.auth.user.user : null;
        },
        logOut: function(){
            this.$store.dispatch('auth/logout');
            this.$router.push('/login');
        },
        isMobile() {
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
              return true
            } else {
              return false
            }
        },
        formatRupiah: function(angka, prefix){
            var number_string = angka.toString().replace(/[^,\d]/g, ''),
            split   		= number_string.split(','),
            sisa     		= split[0].length % 3,
            rupiah     		= split[0].substr(0, sisa),
            separator       = sisa ? '.' : '',
            ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);
        
            if(ribuan){
                rupiah += separator + ribuan.join('.');
            }
        
            rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
            return prefix == undefined ? 'Rp.' + rupiah : (rupiah ? prefix + rupiah : '');
        },
        formatNumber: function(e){
            let angka = e.target.value.replace(/[^,\d]/g, '').toString();
            e.target.value = angka
        }
    },
})

vueApp.mount('#app')
