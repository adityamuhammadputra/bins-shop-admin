import { createApp } from 'vue'
import { createVuetify } from 'vuetify'

export default createVuetify({
    theme: {
        themes: {
          light: {
            primary: '#E53935',
            secondary: '#FFCDD2',
            accent: '#3F51B5'
          },
        },
      },
//   theme: {
//     defaultTheme: 'light'
//   }
})