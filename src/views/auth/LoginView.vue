<template  class="login-page">
    <section class="login-page">
        <v-row style="height: 100%;">
            <v-col sm="12" md="12" style="background: url(https://admin.sli.do/static/settings-background.cbe10e77b055931b.png); background-repeat: no-repeat;
                    background-position: 10% 150%;
                    background-size: 100%;">
                <v-container>
                    <v-card>
                        <v-card-item>
                                
                            <v-card-title class="text-left title-login mb-5 pb-5">
                                <v-img src="http://binsshop.tech/assets/images/logo/logo.png" class="text-white img-right-login"></v-img>  
                                <b style="position: relative;top: 10px;">Silakan login <br> menggunakan akun anda</b>
                            </v-card-title>

                            <p class="text-red mb-2">{{ message }}</p>
                            <v-text-field v-model="form.email" label="Email" required :rules="emailRules" variant="underlined">
                            </v-text-field>
                            <v-text-field type="password" v-model="form.password" label="Password" required min="8"  :rules="passwordRules" variant="underlined">
                            </v-text-field>
                            <v-btn block @click="handleLogin" color="red" class="mb-4" :loading="loading">
                                Login
                            </v-btn>

                            <v-divider class="mt-5 mb-4"></v-divider>
                            <p class="text-right">Klik <a href="#" class="text-info">Lupa password ?</a> </p>
                        </v-card-item>
                    </v-card>
                </v-container>
            </v-col>
        </v-row>
    </section>
</template>
  
<script>
    export default {
        name: 'App',
        data() {

            return {
                passwordRules: [
                    (v) => !!v || 'Password is required',
                ],
                emailRules: [
                    (v) => !!v || 'E-mail is required',
                    // (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
                ],
                form: {
                    email: '',
                    password: '',
                },
                loading: false,
                message: "",
                // schema,
            }
        },
        computed: {
            loggedIn() {
                return this.$store.state.auth.status.loggedIn;
            },
        },
        created() {
            if (this.loggedIn) {
                this.$router.push("/");
            }
        },
        mounted() {
        },
        methods: {
            handleLogin() {
                this.loading = true;
                this.$store.dispatch("auth/login", this.form).then(
                    () => {
                        window.location.href = '/'
                        // this.$router.push("/");
                        this.loading = false;
                    },
                    (error) => {
                        console.log(error);
                        this.message = 'Email atau password salah'
                        this.loading = false;
                    }
                );
            },

            isMobile: function() {
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    return true
                } else {
                    return false
                }
            }
        }
    }
  </script>
  
<style>
    .login-page{
       background-color: white;
       height: 101%;
    }

    .login-page .img-right-login {
        width: 100px;
        object-fit: unset;
        height: auto;
        float: left;
    }

    .login-page .v-card {
        max-width: 400px;
        margin: auto;
        box-shadow: none;
    }

    .login-page .chip-login {
        border-radius: 10px !important;
        padding-top: 2px !important;
        padding-bottom: 2px !important ;
        height: fit-content !important;
        left: -10px;
    }
    .login-page .card-login {
        background-color: #2a56a7 !important; 
        box-shadow: none !important; 
        color: white !important; 
        text-align:justify !important;
        margin-right: 20px !important;
    }

    .login-page .img-left-login {
        height: auto;
        width: 250px;
        background: transparent;
        margin-left: 0px;
    }
  
    .login-page .title-login {
        margin-top: 200px;
    }
  </style>
  