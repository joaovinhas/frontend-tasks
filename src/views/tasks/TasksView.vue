<template>
  <div>
    <Navbar/>
    <main class="container">
      <Notification v-if="notification" :message="notification"/>
      <h1>Suas Tasks Aqui! <button @click="salvar_tasks()" type="button" class="btn btn-primary">Salvar Alterações</button></h1><br/>

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

      <div v-if="tasks.root_tasks">
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

  export default {
    name: 'TasksView',
    components: {
      Navbar,
      ChildTasks,
      Notification,
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

            this.childtasks()

            this.c_tasks = this.tasks.root_tasks
          }

      },

      new_task_add(){

        if(this.new_task != ""){
          this.c_tasks.push({'task': this.new_task, 'concluded': false, 'task_parent': 'null' })
          this.new_task = ""
        }else{
          console.log("Valor nulo")
        }
      },

//Adiciona uma task nova como parent de outra task

      new_child_task(new_task, task_parent){

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

        if(this.c_tasks.length){

          for(let i = 0; i < this.c_tasks.length; i++){

            if(this.c_tasks[i].id){

            //Tasks editadas

              for(let x = 0; x < this.old_tasks.root_tasks.length; x++){

                if(this.c_tasks[i].id == this.old_tasks.root_tasks[x].id){

                  if(this.c_tasks[i].task != this.old_tasks.root_tasks[x].task){
                    if(this.edited_tasks == ""){
                      this.edited_tasks = [this.c_tasks[i]]
                    }else{
                      this.edited_tasks.push(this.c_tasks[i])
                    }
                  }

                  if(this.c_tasks[i].concluded != this.old_tasks.root_tasks[x].concluded){
                    if(this.edited_tasks == ""){
                      this.edited_tasks = [this.c_tasks[i]]
                    }else{
                      this.edited_tasks.push(this.c_tasks[i])
                    }
                  }

                }

              }

            }else{
              if(this.new_tasks == ""){
                this.new_tasks = [this.c_tasks[i]]
              }else{
                this.new_tasks.push(this.c_tasks[i])
              }
            }

            if(this.c_tasks[i].children){
              this.search_tree_save_add(this.c_tasks[i].children)
            }

          }

        }

    //Select tasks para deletar

        for(let i = 0; i < this.old_tasks.root_tasks.length; i++){

          var check_task = false

          for(let x = 0; x < this.c_tasks.length; x++){

            if(this.old_tasks.root_tasks[i].id == this.c_tasks[x].id){
              check_task = true

              if(this.c_tasks[x].children){

                this.search_tree_save_del(this.c_tasks[x].children)

              }else{
                for(let y = 0; y < this.old_tasks.child_tasks.length; y++){
                  if(this.old_tasks.child_tasks[y].id_parent == this.old_tasks.root_tasks[i].id){
                    if(this.del_tasks == ""){
                      this.del_tasks = [this.old_tasks.child_tasks[y]]
                    }else{
                      this.del_tasks.push(this.old_tasks.child_tasks[y])
                    }
                  }
                }
              }

            }

          }

          if(check_task == false){
            if(this.del_tasks == ""){
              this.del_tasks = [this.old_tasks.root_tasks[i]]
            }else{
              this.del_tasks.push(this.old_tasks.root_tasks[i])
            }
          }

        }

        console.log(this.new_tasks)
        console.log(this.edited_tasks)
        console.log(this.del_tasks)
        this.del_tasks = ""
        this.edited_tasks = ""
        this.new_tasks = ""

      },

      search_tree_save_add(children){

        for(let i = 0; i < children.length; i++){
          if(children[i].id){
            
            //Tasks editadas

              for(let x = 0; x < this.old_tasks.child_tasks.length; x++){

                if(children[i].id == this.old_tasks.child_tasks[x].id){

                  if(children[i].task != this.old_tasks.child_tasks[x].task){
                    if(this.edited_tasks == ""){
                      this.edited_tasks = [children[i]]
                    }else{
                      this.edited_tasks.push(children[i])
                    }
                  }

                  if(children[i].concluded != this.old_tasks.child_tasks[x].concluded){
                    if(this.edited_tasks == ""){
                      this.edited_tasks = [children[i]]
                    }else{
                      this.edited_tasks.push(children[i])
                    }
                  }

                }

              }


          }else{
            if(this.new_tasks == ""){
              this.new_tasks = [children[i]]
            }else{
              this.new_tasks.push(children[i])
            }
          }

          if(children[i].children){
            this.search_tree_save_add(children[i].children)
          }
        }

      },
//Select child tasks para deletar
      search_tree_save_del(children){

        for(let i = 0; i < children.length; i++){
          var check_task = false
          for(let x = 0; x < this.old_tasks.child_tasks.length; x++){

            if(children[i].children){
              this.search_tree_save_del(children[i].children)
            }

            if(this.old_tasks.child_tasks[x].id == children[i].id){
              check_task = true
            }

          }

          if(check_task == false){
            if(this.del_tasks == ""){
              this.del_tasks = [children[i]]
            }else{
              this.del_tasks.push(children[i])
            }
          }

        }

      },
/*
      async new_task_add(){

        var response = await Axios.create_task(this.token, this.new_task, 'null')

        if(response.success){
          this.new_task = ''
          this.load_tasks()
          this.notification = response
        }else{
          this.notification = new Object()
          this.notification.error = "Erro ao criar task!"
        }

      },
*/

//Cria a tree de tasks
      
      childtasks(){

        if(this.tasks.child_tasks.lenght != 0){

          for(let i = 0; i < this.tasks.root_tasks.length; i++){

            for(let x = 0; x < this.tasks.child_tasks.length; x++){

              if(this.tasks.root_tasks[i].id == this.tasks.child_tasks[x].id_parent){

                this.show_child_tasks(this.tasks.child_tasks[x], this.tasks.child_tasks)

                if(this.tasks.root_tasks[i].children){

                  this.tasks.root_tasks[i].children.push(this.tasks.child_tasks[x])

                }else{

                  this.tasks.root_tasks[i].children = Object.assign([this.tasks.child_tasks[x]])
                
                }

              }

            }

          }

        }
      },

      show_child_tasks(root_tasks, child_tasks){

        for(let i = 0; i < child_tasks.length; i++){

          if(root_tasks.id == child_tasks[i].id_parent){

            this.show_child_tasks(child_tasks[i], this.tasks.child_tasks)

            root_tasks.children = Object.assign([child_tasks[i]])

          }

        }
      },

      async search_task(){

        if(this.type == 'task' || this.type == 'concluded'){
          
          var response = await Axios.search_task(this.token, this.type, this.search)

          if(response.root_tasks){
            if(response.root_tasks.length != 0){
              
              this.tasks = response

              this.childtasks()

              this.c_tasks = this.tasks.root_tasks
            }
  
          }else{
            this.tasks.root_tasks = false
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