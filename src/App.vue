<template>
  <router-view/>
  <Footer/>
</template>

<script>

import Footer from '@/components/FooterComponent.vue'

export default {
  name: 'AppView',
  components: {
    Footer,
  },
  created() {

    //var response = Axios.register()
    
    //console.log(response)
  }

}

</script>

<style lang="scss">
  
  @import '@/assets/scss/_main.scss';

</style>
