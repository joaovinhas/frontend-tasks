<template>
  <div v-if="message.type = 'success'" class="alert alert-success" role="alert">
    message.notification
  </div>
  <div v-if="message.type = 'error'" class="alert alert-darger" role="alert">
    {{message.notification}}
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
