<template>

  <div v-if="message.success" class="alert alert-success alert-dismissible" role="alert">   
    <div>{{message.success}}</div>   
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>

  <div v-if="message.error" class="alert alert-danger alert-dismissible" role="alert">   
    <div>{{message.error}}</div>   
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
</template>

<script>
export default {
  name: 'NotificationComponent',
  props:{
    message:Object,
  }
}
</script>

<style lang="scss" scoped>

</style>
