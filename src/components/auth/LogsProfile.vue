<template>
    <v-card-item class="pb-0">
        <v-card-title>5 Aktivitas terakhir</v-card-title>
    </v-card-item>
    <v-card-text>
        <template v-if="(data.length > 1)">

            <v-timeline side="end" align="start" direction="horizontal" class="profilePage">
                <v-timeline-item v-for="(log, index) in data" v-bind:key="log.created_at" :dot-color="log.color" :id="index" icon="mdi-clock" size="small" class="mt-2 pa-0">
                    <div style="position: relative; top: -10px;">
                        <strong class="mr-4">{{ dateTimeOuput(log.created_at) }}</strong>
                        <br> {{ log.desc }}
                    </div>
                </v-timeline-item>
            </v-timeline>
        </template>
        <v-row v-else class="mt-6 mb-6">
            <v-col md="3">
                <content-loader>
                    <rect x="10" y="5" rx="10" ry="4" width="500" height="300" />
                </content-loader>
            </v-col>
            <v-col md="3">
                <content-loader>
                    <rect x="10" y="5" rx="4" ry="4" width="500" height="500" />
                </content-loader>
            </v-col>
            <v-col md="3">
                <content-loader>
                    <rect x="10" y="5" rx="4" ry="4" width="500" height="300" />
                </content-loader>
            </v-col>
            <v-col md="3">
                <content-loader>
                    <rect x="10" y="5" rx="4" ry="4" width="500" height="300" />
                </content-loader>
            </v-col>
        </v-row>
    </v-card-text>
</template>


<script>
    export default {
        // props : ['user'],
        data() {
            return {
                data : [],
                config : {
                    headers:{
                        Authorization: 'Bearer ' + this.$store.state.auth.user.accessToken,
                    }
                },
                
            }
        },
        mounted() {
            this.getLogs();
        },
        methods: {
            getLogs: function() {
                this.axios.get('jfpk/penilai-logs', this.config)
                .then((response) => {
                    this.data = response.data.data;
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