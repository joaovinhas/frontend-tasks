<template>

  <li  v-for="(task, index) in all_tasks.root_tasks" :key="index"  class="list-group-item list-group-item-dark">
    
    {{task.task}}

    {{task.timer}}

    {{task.concluded}}

  </li>
  <br/>
  <p>{{all_tasks}}</p>
  
</template>

<script>
  export default {
    name: 'ChildTasksComponent',
    props:{
      all_tasks: Object,
    },
    components: {
    
    },
  }  
</script>

<style lang="scss" scoped>

</style>