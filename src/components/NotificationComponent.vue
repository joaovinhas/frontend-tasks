<template>

  <div v-if="message.success" class="alert alert-success alert-dismissible" role="alert">   
    <div>{{message.success}}</div>   
    <button @click="close()" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>

  <div v-if="message.error" class="alert alert-danger alert-dismissible" role="alert">   
    <div>{{message.error}}</div>   
    <button @click="close()" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
</template>

<script>
export default {
  name: 'NotificationComponent',
  props:{
    message:Object,
  },
  methods:{
    close(){
      this.$parent.close_notification()
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
