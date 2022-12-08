<template>
  <div>
    <Navbar/>
    <main class="container">
      
      <Modal v-if="show_modal" @close="show_modal = false"/>
      <Notification v-if="notification" :message="notification"/>

      <h1>Suas Tasks Aqui! <button @click="show_modal = !show_modal" type="button" class="btn btn-primary">Salvar Alterações</button></h1><br/>

      <!--Busca usuarios-->

      <div v-if="show_search" class="input-group mb-3">
        <input v-if="type =='task'" v-model="search" type="text" class="form-control" placeholder="Digite algo na busca aqui!">

        <select v-if="type == 'concluded'" v-model="search" class="form-control">
          <option selected value="concluded">Concluido</option>
          <option value="not_concluded">Não concluido</option>
        </select>

        <select v-model="type" class="custom-select">
          <option selected value="task">Task</option>
          <option value="concluded">Concluido</option>
        </select>     
        <div class="input-group-append">
          <button @click="search_task()" class="btn btn-outline-primary" type="button">Buscar</button>
          <button @click="show_search = !show_search; load_tasks()" class="btn btn-outline-danger" type="button">Voltar</button>
        </div>
      </div>

      <div v-if="!show_search" class="input-group mb-3">
        <input v-model="new_task" type="text" class="form-control" placeholder="Digite uma task aqui!" required="required">
        <div class="input-group-append">
          <button @click="new_task_add()" class="btn btn-outline-primary" type="button">Cadastrar task</button>
          <button @click="show_search = !show_search" class="btn btn-outline-primary" type="button">Busca</button>
        </div>
      </div>

      <div v-if="c_tasks">
        <ChildTasks
          v-for="(child, index) in c_tasks" :key="index"
          :tasks="child"
        />
      </div>
      <div v-else>
        <p>Nenhuma task encontrada!</p>
      </div>
      <br/>
    </main>
  </div>
</template>

<script>
  import Axios from '@/api/api.js';
  import Navbar from '@/components/NavbarComponent.vue'
  import Notification from '@/components/NotificationComponent.vue'
  import ChildTasks from '@/components/tasks/ChildTasksComponent.vue'
  import Modal from '@/components/ModalComponent.vue'

  export default {
    name: 'TasksView',
    components: {
      Navbar,
      ChildTasks,
      Notification,
      Modal,
    },
    data(){
      return{
        token: "",
        tasks:"",
        c_tasks:"",
        new_task: "",
        new_tasks:"",
        edited_tasks:"",
        del_tasks:"",
        old_tasks:"",
        show_search:"",
        type:"task",
        search:"",
        notification:'',
        show_modal:false,
      }
    },
    async created(){

      if(localStorage.token || sessionStorage.token){

        if(localStorage.token){
          
          this.token = localStorage.token

        }else{
          
          this.token = sessionStorage.token

        }

        var check = await Axios.check_user(this.token)

        if(check.user.status != "block"){

          this.load_tasks()

        }else{
          this.$router.push('/login')
        }
        
      }else{
        this.$router.push('/login')
      }

    },
    methods:{

      notifications(notification){

        this.notification = notification

      },

      close_notification(){
        this.notification = ""
      },

      async load_tasks(){
        
        var response = await Axios.all_tasks(this.token)

          if(response.root_tasks.length != 0){
            
            this.tasks = response

            if(response.child_tasks.length != 0){
              this.tasks = this.childtasks(this.tasks.root_tasks, this.tasks.child_tasks)
              this.c_tasks = this.tasks
            }else{
              this.c_tasks = this.tasks.root_tasks
            }

          }

      },

      new_task_add(){

        if(this.new_task != ""){

          var check_task = this.search_exist_tasks(this.c_tasks, this.new_task)

          if(check_task){
            this.notification = new Object()
            this.notification.error = "Task já existe!"
          }else{
            this.c_tasks.push({'task': this.new_task, 'concluded': false, 'task_parent': 'null' })
            this.new_task = ""
          }

        }else{
          console.log("Valor nulo")
        }
      },

//Adiciona uma task nova como parent de outra task

      new_child_task(new_task, task_parent){

        var check_task = this.search_exist_tasks(this.c_tasks, new_task)

        if(check_task){
          this.notification = new Object()
          this.notification.error = "Task já existe!"
        }else{

          for(let i = 0; i < this.c_tasks.length; i++){

            if(this.c_tasks[i].task == task_parent){

              if(this.c_tasks[i].children){
                this.c_tasks[i].children.push({'task': new_task, 'concluded': false, 'task_parent': task_parent })
              }else{
                this.c_tasks[i].children = Object.assign([{'task': new_task, 'concluded': false, 'task_parent': task_parent }])
              }
            }

            if(this.c_tasks[i].children){
              this.search_tree_add(new_task, task_parent, this.c_tasks[i].children)
            }
          }

        }
      },

      search_tree_add(new_task, task_parent, children){

        for(let i = 0; i < children.length; i++){
          if(children[i].task == task_parent){

            if(children[i].children){
              children[i].children.push({'task': new_task, 'concluded': false, 'task_parent': task_parent })
            }else{
              children[i].children = Object.assign([{'task': new_task, 'concluded': false, 'task_parent': task_parent }])
            }
          }

          if(children[i].children){
            this.search_tree_add(new_task, task_parent, children[i].children)
          }
        }

      },

      search_exist_tasks(all_tasks, search_task){

        var task = false
        for(let i = 0; i < all_tasks.length; i++){

          if(all_tasks[i].task == search_task){
            task = true
          }

          if(task != true){
            if(all_tasks[i].children){
              task = this.search_exist_tasks(all_tasks[i].children, search_task)
            }
          }

        }

        return task

      },

//Edita a task solicitada

      edit_child_task(task, task_edited){
        
        for(let i = 0; i < this.c_tasks.length; i++){
          if(this.c_tasks[i].task == task){
            this.c_tasks[i].task = task_edited
          }

          if(this.c_tasks[i].children){
            this.search_tree_edit(task, task_edited, this.c_tasks[i].children)
          }
        }

      },

      search_tree_edit(task, task_edited, children){
        for(let i = 0; i < children.length; i++){
          if(children[i].task == task){
            children[i].task = task_edited
          }
          if(children[i].children){
            this.search_tree_edit(task, task_edited, children[i].children)
          }
        }
      },

//Deletar task

      del_child_task(task){

        for(let i = 0; i < this.c_tasks.length; i++){
          if(this.c_tasks[i].children){
            this.search_tree_del(task, this.c_tasks[i].children)
            if(this.c_tasks[i].children.length == 0){
              delete this.c_tasks[i].children
            }
            
          }
          if(this.c_tasks[i].task == task){
            this.c_tasks.splice(i, 1)
          }
        }

      },

      search_tree_del(task, children){
        for(let i = 0; i < children.length; i++){
          if(children[i].children){
            this.search_tree_del(task, children[i].children)
            if(children[i].children.length == 0){
              delete children[i].children
            }
          }
          if(children[i].task == task){
            children.splice(i, 1)
          }
        }
      },

//Salvar Tasks

      async salvar_tasks(){

        this.old_tasks = await Axios.all_tasks(this.token)

        if(this.old_tasks.root_tasks.length){

          if(this.old_tasks.child_tasks.length){
            
            this.old_tasks = this.childtasks(this.old_tasks.root_tasks, this.old_tasks.child_tasks) 
          }else{
            this.old_tasks = this.old_tasks.root_tasks
          }

          this.comparation_tree_tasks()

          this.show_modal = !this.show_modal
        }

      },

      comparation_tree_tasks(){

        for(let x = 0; x < this.old_tasks.length; x++){

          var check_task = false
          
          for(let i = 0; i < this.c_tasks.length; i++){

            if(this.c_tasks[i].id == this.old_tasks[x].id ){

//////////////Edited tasks////////////////////////////////////

              if(this.c_tasks[i].task != this.old_tasks[x].task){

                if(this.edited_tasks == ""){
                  this.edited_tasks = [this.c_tasks[i]]
                }else{
                  this.edited_tasks.push(this.c_tasks[i])
                }

              }

              if(this.c_tasks[i].concluded != this.old_tasks[x].concluded){

                if(this.edited_tasks == ""){
                  this.edited_tasks = [this.c_tasks[i]]
                }else{
                  this.edited_tasks.push(this.c_tasks[i])
                }

              }

/////////////Deletar children tasks////////////////////////////////
              if(this.old_tasks[x].children){

                if(this.c_tasks[i].children){
////////////Children tasks/////////////////////////////////////////
                  this.comparation_tree_children(this.c_tasks[i].children, this.old_tasks[x].children)

                }else{
                  var children_tasks = this.old_tasks[x].children
                  for(let z = 0; z < children_tasks.length; z++){

                    if(this.del_tasks == ""){
                      this.del_tasks = [children_tasks[z]]
                    }else{
                      this.del_tasks.push(children_tasks[z])
                    }

                  }
                }

              }else{
                if(this.c_tasks[i].children){
////////////Children tasks/////////////////////////////////////////
                  this.comparation_tree_children(this.c_tasks[i].children, this.old_tasks[x].children)

                }
              }

              check_task = true

            }

////////////Tasks root novas //////////////////////////////////////

            if(!this.c_tasks[i].id){
              if(this.new_tasks == ""){
                this.new_tasks = [this.c_tasks[i]]
              }else{
                var check_task2 = false
                for(let y = 0; y < this.new_tasks.length; y++){
                  if(this.c_tasks[i].task == this.new_tasks[y].task){
                    check_task2 = true
                  }
                }
                if(!check_task2){
                  this.new_tasks.push(this.c_tasks[i])
                }
              }

            }

          }
////////////Deletar tasks //////////////////////////////////////////

            if(check_task == false){

              if(this.del_tasks == ""){
                this.del_tasks = [this.old_tasks[x]]
              }else{
                this.del_tasks.push(this.old_tasks[x])
              }

            }

        }

        this.save_tasks_api()

        this.new_tasks = ""
        this.edited_tasks = ""
        this.del_tasks = ""

      },

      comparation_tree_children(c_children, old_children){

        if(old_children){

          for(let x = 0; x < old_children.length; x++){

            var check_task = false
            
            for(let i = 0; i < c_children.length; i++){

              if(c_children[i].id == old_children[x].id ){

  //////////////Edited tasks////////////////////////////////////

                if(c_children[i].task != old_children[x].task){

                  if(this.edited_tasks == ""){
                    this.edited_tasks = [c_children[i]]
                  }else{
                    this.edited_tasks.push(c_children[i])
                  }

                }

                if(c_children[i].concluded != old_children[x].concluded){

                  if(this.edited_tasks == ""){
                    this.edited_tasks = [c_children[i]]
                  }else{
                    this.edited_tasks.push(c_children[i])
                  }

                }

  /////////////Deletar children tasks////////////////////////////////
                if(old_children[x].children){

                  if(c_children[i].children){
  ////////////Children tasks/////////////////////////////////////////
                    this.comparation_tree_children(c_children[i].children, old_children[x].children)

                  }else{
                    var children_tasks = old_children[x].children
                    for(let z = 0; z < children_tasks.length; z++){

                      if(this.del_tasks == ""){
                        this.del_tasks = [children_tasks[z]]
                      }else{
                        this.del_tasks.push(children_tasks[z])
                      }

                    }
                  }

                }else{
                   if(c_children[i].children){
  ////////////Children tasks/////////////////////////////////////////
                    this.comparation_tree_children(c_children[i].children, old_children[x].children)

                  }
                }

                check_task = true
              }

/////////////Tasks root novas //////////////////////////////////////

              if(!c_children[i].id){
                if(this.new_tasks == ""){
                  this.new_tasks = [c_children[i]]
                }else{
                  var check_task2 = false
                  for(let y = 0; y < this.new_tasks.length; y++){
                    if(c_children[i].task == this.new_tasks[y].task){
                      check_task2 = true
                    }
                  }
                  if(!check_task2){
                    this.new_tasks.push(c_children[i])
                  }
                }

              }

            }
/////////////Deletar tasks //////////////////////////////////////////

              if(check_task == false){

                if(this.del_tasks == ""){
                  this.del_tasks = [old_children[x]]
                }else{
                  this.del_tasks.push(old_children[x])
                }

              }

          }

        }else{

//////Tasks children novas //////////////////////////////////////
          
          for(let i = 0; i < c_children.length; i++){

            if(this.new_tasks == ""){
              this.new_tasks = [c_children[i]]
            }else{
              this.new_tasks.push(c_children[i])
            }

            if(c_children[i].children){
              this.comparation_tree_children(c_children[i].children, null)
            }
          }

        }

      },


//Mandar tasks para banco de dados

      async save_tasks_api(){

        var response = ""

        if(this.new_tasks.length){

          for(let i = 0; i < this.new_tasks.length; i ++){

            response = Axios.create_task(this.token, this.new_tasks[i].task, this.new_tasks[i].task_parent)

          }

        }

        if(this.edited_tasks.length){

          for(let i = 0; i < this.edited_tasks.length; i ++){

            response = Axios.edit_task(this.token, this.edited_tasks[i].id, this.edited_tasks[i].task, this.edited_tasks[i].concluded)

          }

        }

        if(this.del_tasks.length){

          for(let i = 0; i < this.del_tasks.length; i ++){
            response = Axios.del_task(this.token, this.del_tasks[i].id)
          }

        }

        if(response != ""){
          this.notification = new Object()
          this.notification.success = "Alterações salvas com sucesso!"
        }

      },

//Cria a tree de tasks

      childtasks(root_tasks, child_tasks){

        for(let i = 0; i < root_tasks.length; i++){

          for(let x = 0; x < child_tasks.length; x++){

            if(root_tasks[i].id == child_tasks[x].id_parent){

              this.show_child_tasks(child_tasks[x], child_tasks)

              if(root_tasks[i].children){

                root_tasks[i].children.push(child_tasks[x])

              }else{

                root_tasks[i].children = Object.assign([child_tasks[x]])
              
              }

            }

          }

        }

        return root_tasks

      },

      show_child_tasks(root_tasks, child_tasks){

        for(let i = 0; i < child_tasks.length; i++){

          if(root_tasks.id == child_tasks[i].id_parent){

            this.show_child_tasks(child_tasks[i], child_tasks)

            if(root_tasks.children){
              root_tasks.children.push(child_tasks[i])
            }else{
              root_tasks.children = Object.assign([child_tasks[i]])
            }

          }

        }
      },

      async search_task(){

        if(this.type == 'task' || this.type == 'concluded'){
          
          var response = await Axios.search_task(this.token, this.type, this.search)


          if(response.root_tasks.length != 0){
            
            this.tasks = response

            if(response.child_tasks.length != 0){
              this.tasks = this.childtasks(this.tasks.root_tasks, this.tasks.child_tasks)
              this.c_tasks = this.tasks
            }else{
              this.c_tasks = this.tasks.root_tasks
            }

          }

        }else{
          this.notification = new Object()
          this.notification.error = "Valor Inválido!"
        }
      },

    },

    watch:{
      type(){
        if(this.type == 'concluded'){
          this.search = 'concluded'
        }

        if(this.type == 'task'){
          this.search = ''
        }
      }
    },
  
  }

</script>

<style lang="scss" scoped>

</style>