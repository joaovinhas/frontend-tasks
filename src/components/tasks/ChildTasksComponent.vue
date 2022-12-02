<template>

  <li :style="{'margin-left': `${depth * 30}px`}" class="list-group-item list-group-item-dark">
    <div v-if="!show_edit && !show_add" class="row">
      
      <div @click="expanded = !expanded" class="col">
        <span v-if="hasChildren" class="type">[ {{expanded ? '&#45;' : '&#43;'}} ]</span>
        {{node.task}}

      </div>

      <div class="form-check form-switch col">
        <input v-model="node.concluded" class="form-check-input" type="checkbox" :checked="node.concluded" role="switch">
        <label class="form-check-label">Concluido</label>
      </div>

      <div class="col-sm-auto">
        
        <div class="btn-group" role="group">
          <button @click="show_add = !show_add" type="button" class="btn btn-primary">Add</button>
          <button @click="show_edit = !show_edit; show_task_edit(node.task)" type="button" class="btn btn-secondary">Editar</button>
          <button @click="del_task(node.task)" type="button" class="btn btn-danger">Delete</button>
    <!--      <button @click="show_modal = !show_modal" type="button" class="btn btn-danger">Delete</button> -->
        </div>
      
      </div>

    </div>

    <div v-if="show_add" class="row">
      <div class="col">
        <input class="form-control" type="text" v-model="new_task" required="required" placeholder="Digite a sua task aqui!">
      </div>
      <div class="col-sm-auto btn-group" role="group">
        <button @click="add_task(new_task, node.task);show_add = !show_add" type="button" class="btn btn-primary">Adicionar</button>
        <button @click="show_add = !show_add" type="button" class="btn btn-danger">Cancelar</button>
      </div>
    </div>

    <div v-if="show_edit" class="row">
      <div class="col">
        <input class="form-control" type="text" v-model="task_edit" required="required">
      </div>
      <div class="col-sm-auto btn-group" role="group">
        <button @click="edit_task(node.task, task_edit);show_edit = !show_edit" type="button" class="btn btn-primary">Salvar</button>
        <button @click="show_edit = !show_edit" type="button" class="btn btn-danger">Cancelar</button>
      </div>
    </div>

   <Modal v-if="show_modal" @close="show_modal = false" :task="node"/>

  </li>
  <div v-if="expanded">
      
    <ChildTasksComponent
      v-for="child in node.children"
      :key="child.task"
      :tasks="child"
      :depth="depth + 1"
    />

  </div>

</template>

<script>
  
  import Axios from '@/api/api.js';
  import Modal from '@/components/ModalComponent.vue'

  export default {
    name: 'ChildTasksComponent',
    props:{
      tasks: Object,
      depth: {
        type:Number,
        default: 0,
      }
    },
    data(){
      return{
        token:"",
        node:"",
        new_task:"",
        task_edit:"",
        expanded: false,
        show_add: false,
        show_edit: false,
        show_modal: false,
      }
    },
    async created(){

      if(localStorage.token || sessionStorage.token){

        if(localStorage.token){
          
          this.token = localStorage.token
          this.username = localStorage.username

        }else if(sessionStorage.token){
          
          this.token = sessionStorage.token
          this.username = sessionStorage.username

        }

        var check = await Axios.check_user(this.token)

        if(check.user.status == "block"){

          this.$router.push('/login')

        }else{
          this.load_tree_tasks()
        }
        
      }else{
        this.$router.push('/login')
      }

    },
    components: {
      Modal,
    },
    computed: {
      hasChildren(){
        return this.node.children
      }
    },
    methods:{

      load_tree_tasks(){
        this.node = this.tasks
      },

      notifications_child(notification){

        if(this.depth == 0){
          this.$parent.notifications(notification)
        }else{
          this.$parent.notifications_child(notification)
        }

      },

      reload_component(){

        if(this.depth == 0){
          this.$parent.load_tasks()
        }else{
          this.$parent.reload_component()
        }
      },

      add_task(new_task, task_parent){

        if(this.depth == 0){
          this.$parent.new_child_task(new_task, task_parent)
        }else{
          this.$parent.add_task(new_task, task_parent)
        }

      },

      edit_task(task, task_edited){

        if(this.depth == 0){
          this.$parent.edit_child_task(task, task_edited)
        }else{
          this.$parent.edit_task(task, task_edited)
        }

      },

      del_task(task){

        if(this.depth == 0){
          this.$parent.del_child_task(task)
        }else{
          this.$parent.del_task(task)
        }

      },

      show_task_edit(task){

        this.task_edit = task
      },

    },

    watch:{
      tasks(){
        this.load_tree_tasks()
      }
    },
  } 

</script>

<style lang="scss" scoped>

</style>