<template>
     <v-toolbar density="compact" color="transparent">
        <!-- <v-toolbar-title>Profile {{ this.userLogin().name ?? '' }}</v-toolbar-title> -->
        <v-toolbar-title>Profile 'xxxxx'</v-toolbar-title>
        <v-spacer></v-spacer>
        <router-link to="/" class="custom-link">
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
                <SidebarProfile v-bind:user="user" v-bind:penilaian="penilaian"></SidebarProfile> 
            </v-col>
            
            <v-col sm="12" md="8">
                <v-card>
                    <v-card-item>
                        <v-card-title>Edit Profile</v-card-title>
                    </v-card-item>
                    <v-card-text>
                        <v-text-field
                            v-model="user.name"
                            :rules="nameRules"
                            :counter="100"
                            label="Name"
                            variant="underlined"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="user.email"
                            :rules="emailRules"
                            label="E-mail"
                            variant="underlined"
                            readonly
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="user.password"
                            :rules="passwordRules"
                            label="Password"
                            variant="underlined"
                            type="password"
                            prepend-icon="mdi-lock"
                            required
                        ></v-text-field>

                        <v-text-field
                            v-model="user.comfirmPassword"
                            :rules="confirmPasswordRules"
                            label="Konformasi Password"
                            variant="underlined"
                            prepend-icon="mdi-lock"
                            type="password"
                            required
                        ></v-text-field>

                        <v-btn variant="flat" color="info" block prepend-icon="mdi-check-all" @click="updateData">
                            Simpan Perubahan
                        </v-btn>

                    </v-card-text>
                </v-card>

                <v-card class="mt-5">
                    <LogsProfile></LogsProfile> 
                </v-card>
            </v-col>
        </v-row>
    </section>
</template>

<script>
    import SidebarProfile from '/src/components/auth/SidebarProfile.vue'
    import LogsProfile from '/src/components/auth/LogsProfile.vue'

    export default {
        name: 'ProfilePage',
        components : {
            SidebarProfile,
            LogsProfile,
        }, 
        data() {
            return {
                config : {
                    headers:{
                        Authorization: 'Bearer ' + this.$store.state.auth.user.accessToken,
                    }
                },
                user: {
                    name: '',
                    email: '',
                    password: '',
                    comfirmPassword: ''
                },
                nameRules: [
                    v => !!v || 'Name is required',
                    v => (v && v.length >= 3) || 'Nama harus lebih dari 3 karakter',
                ],
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail harus valid',
                ],
                passwordRules: [
                    (value) => !!value || 'Password is required',
                    (value) => (value && value.length >= 6) || 'minimal 6 karakter',
                ],
                confirmPasswordRules: [
                    (value) => !!value || 'Confirm Password is required',
                    (value) =>
                    value === this.user.password || 'Konfirmasi Password harus sama dengan Password',
                ],
                penilaian: '',
            }
        },
        mounted() {
            // console.log(this.userLogin());
            this.getIndex()
            this.getPenilaian()
        },
        methods: {
            getIndex: function() {
                this.loading = true
                this.axios.get('jfpk/auth/user', this.config)
                .then((response) => {
                    this.user = response.data.data;
                })
                .catch(error => {
                    this.loading = true
                    console.log(error);
                })
                .finally(
                    () => this.loading = false
                )
            },
            getPenilaian: function() {
                this.loading = true
                this.axios.get('jfpk/penilai', this.config)
                .then((response) => {
                    this.penilaian = response.data.statistik
                })
                .catch(error => {
                    this.errorNotif(error)
                })
                .finally(
                    () => this.loading = false
                )
            },
            updateData: function() {
                this.axios.patch('jfpk/auth/user/' + this.user.id, this.user, this.config)
                .then((res) => {
                    this.successNotif(res.data.message)
                    // this.$store.dispatch('auth/logout');
                    // this.$router.push('/login');
                    // this.successNotif(res.data.message)
                })
                .catch((error) => {
                    this.errorNotif(error)
                }).finally(() => {
                    //Perform action in always
                });
            }
        }
    }
</script>

<style>

.left-page {
    background: url('https://admin.sli.do/static/settings-background.cbe10e77b055931b.png');
    height: 560px;
    background-repeat: no-repeat;
    background-size: 100%;
    flex-basis: 330px;
    background-position: 0 101%;
    background-color: #fafafa;
    text-align: center;
    /* padding: 10px 20px; */
}
.left-page .v-responsive  {
    height: 190px;
}
.left-page .v-responsive .v-img__img {
    width: 100%;
    filter: grayscale(50%);
}

.left-page .v-avatar-text {
    position: relative;
    top: -80px;
    width: 100px;
    height: 100px;
}
.profilePage .v-timeline-item__body {
    padding: 0px !important;
    padding-top: 20px !important;
    font-size: 13px;
}
</style>