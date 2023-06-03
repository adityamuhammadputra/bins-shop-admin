<template>
    <div class="left-page">
        <v-card>
            <v-img
            src="@/assets/img/bg1.png"
            cover
            class="text-white"
            ></v-img>
        </v-card>
        <v-avatar color="white" size="x-large" class="v-avatar-text ">
            <span class="text-h5">{{ user.name.charAt(0).toUpperCase() }}</span>
        </v-avatar>
        <v-card style="background: transparent;box-shadow: none;position: relative;top: -35px;">
            <template v-if="user.email">
                <div class="text-h4 mb-0 px-2">
                    {{ user.name }}
                </div>
                <div class="text-h6 font-weight-regular text-grey mb-3">
                    {{ user.email }}
                </div>

                <v-divider class="mx-4"></v-divider>

                <v-card-text class="d-flex justify-space-between">
                    <v-chip prepend-icon="mdi-check-all" class="f-12">{{ (penilaian.sudahNilai) ? penilaian.sudahNilai : 0 }} dari {{ (penilaian.total) ? penilaian.total : 0 }} Penilaian</v-chip>
                    <v-chip prepend-icon="mdi-clock" class="f-12">Bergabung {{ dateTimeOuput(user.created_at) }}</v-chip>
                </v-card-text>
            </template>
            <template v-else>
                <content-loader>
                    <rect x="25" y="5" rx="4" ry="4" width="350" height="20" />
                    <rect x="25" y="30" rx="4" ry="4" width="350" height="20" />
                    <rect x="0" y="100" rx="4" ry="4" width="400" height="20" />
                </content-loader>
            </template>
        </v-card>
    </div>
</template>

<script>
    export default {
        // name: 'ProfilePage',
        props : ['user', 'penilaian'],
        data() {
            return {
                config : {
                    headers:{
                        Authorization: 'Bearer ' + this.$store.state.auth.user.accessToken,
                    }
                },
            }
        },
        // mounted() {
        //     console.log(this.penilaian);
        // },
    }
</script>