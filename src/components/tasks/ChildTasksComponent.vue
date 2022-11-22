<template>

  <li :style="{'margin-left': `${depth * 30}px`}" class="list-group-item list-group-item-dark">
    <div v-if="!show_edit && !show_add" class="row">
      
      <div @click="expanded = !expanded" class="col">
        <span v-if="hasChildren" class="type">[ {{expanded ? '&#45;' : '&#43;'}} ]</span>
        {{node.task}}

      </div>

      <div class="form-check form-switch col">
        <input v-if="!node.concluded" class="form-check-input" type="checkbox" role="switch" disabled>
        <input v-if="node.concluded" class="form-check-input" type="checkbox" checked disabled role="switch">
        <label class="form-check-label">Concluido</label>
      </div>

      <div class="col-sm-auto">
        
        <div class="btn-group" role="group">
          <button @click="show_add = !show_add" type="button" class="btn btn-primary">Add</button>
          <button @click="show_edit = !show_edit; show_task_edit(node.task)" type="button" class="btn btn-secondary">Editar</button>
          <button @click="show_modal = !show_modal" type="button" class="btn btn-danger">Delete</button>
        </div>
      
      </div>

    </div>

    <div v-if="show_add" class="row">
      <div class="col">
        <input class="form-control" type="text" v-model="new_task" required="required" placeholder="Digite a sua task aqui!">
      </div>
      <div class="col-sm-auto btn-group" role="group">
        <button @click="add_task(new_task, node.id)" type="button" class="btn btn-primary">Salvar</button>
        <button @click="show_add = !show_add" type="button" class="btn btn-danger">Cancelar</button>
      </div>
    </div>

    <div v-if="show_edit" class="row">
      <div class="col">
        <input class="form-control" type="text" v-model="task_edit" required="required">
      </div>
      <div class="form-check form-switch col-sm-auto">
        <input @click="task_ckecks()" v-model="task_ckeck" class="form-check-input" type="checkbox" role="switch">
        <label class="form-check-label">Concluido</label>
      </div>
      <div class="col-sm-auto btn-group" role="group">
        <button @click="edit_task(node.id, task_edit, task_ckeck)" type="button" class="btn btn-primary">Salvar</button>
        <button @click="show_edit = !show_edit" type="button" class="btn btn-danger">Cancelar</button>
      </div>
    </div>

   <Modal v-if="show_modal" @close="show_modal = false" :task="node"/>

  </li>
  <div v-if="expanded">
      
    <ChildTasksComponent
      v-for="child in node.children"
      :key="child.task"
      :node="child"
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
      node: Object,
      depth: {
        type:Number,
        default: 0,
      }
    },
    data(){
      return{
        token:"",
        tasks:"",
        new_task:"",
        task_edit:"",
        task_ckeck:"",
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

          this.tasks = this.node
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

      async add_task(new_task, id_parent){

        var response = await Axios.create_task(this.token, new_task, id_parent)
        
        if(response.success){
          this.notifications_child(response)
          this.show_add = !this.show_add
          this.reload_component()
        }else{
          this.notifications_child(response)
        }

      },

      async edit_task(id_task, edit_edited, concluded){

        if(concluded != 1){
          concluded = 0
        }

        var response = await Axios.edit_task(this.token, id_task, edit_edited, concluded)

        if(response.success){
          this.show_edit = !this.show_edit
          this.reload_component()
          this.notifications_child(response)
        }else{
          var notification = new Object()
          notification = "Erro ao alterar task"
          this.notifications_child(notification)
        }

      },

      show_task_edit(task){

        this.task_edit = task
      },

      task_ckecks(){
        this.task_ckeck = !this.task_ckeck
      }

    },
  } 

</script>

<style lang="scss" scoped>

</style>