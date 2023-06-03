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
// axios.defaults.baseURL = 'https://belajar-sisdm.bpk.go.id/api/'
axios.defaults.baseURL = 'http://bins.local/api/v1/admin/'


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
        dateTimeOuput: function(date) {
            return moment(date).format('DD/MM/YYYY HH:mm');
        },
        findString: function(str) {
            console.log(str);
        },
        successNotif: function(msg) {
            toast(msg);
        },
        errorNotif: function(error) {
            toast.error(error.response.data.error);
            setTimeout(function() {
                if(error.response.status == 401) {
                    // logOut();
                }
           }, 4000);
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
        }
    },
})

vueApp.mount('#app')
