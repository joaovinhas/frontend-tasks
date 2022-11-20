import axios from "axios";

const url = "http://127.0.0.1:8000/api";

class Axios{

//Users

	register(name, email, password, confirm_password){

		var promise = axios.post(url + '/register', {name: name, email: email, password: password, password_confirmation: confirm_password}).then(response => { return response.data });

		return promise;

	}

	login(email, password){

		var promise = axios.post(url + '/login', {email: email, password: password}).then(response => { return response.data });

		return promise;

	}

	logout(token){

		var promise = axios.get(url + '/logout', { headers: {"Authorization" : `Bearer ${token}`}} ).then(response => { return response.data });

		return promise;

	}

	dashboard(token){

		var promise = axios.get(url + '/dashboard', { headers: {"Authorization" : `Bearer ${token}`}} ).then(response => { return response.data });

		return promise;

	}

	async check_user(token){

		var promise = await axios.get(url + '/check_user', { headers: {"Authorization" : `Bearer ${token}`}} ).then(response => { return response.data });

		return promise;

	}

	show_user(token){

		var promise = axios.get(url + '/show_user', { headers: {"Authorization" : `Bearer ${token}`}} ).then(response => { return response.data });

		return promise;

	}

	show_users(token){

		var promise = axios.get(url + '/show_users', { headers: {"Authorization" : `Bearer ${token}`}} ).then(response => { return response.data });

		return promise;

	}

	async edit_user(token, username, email){

		var promise = await axios.post(url + '/edit_user', { name: username, email: email} ,{ headers: {"Authorization" : `Bearer ${token}`}} ).then(response => { return response.data });

		return promise;

	}

	edit_permission(token, id_user, permission, status){

		var promise = axios.post(url + '/edit_permission', { id_user: id_user, permission: permission,  status: status }, {headers: {"Authorization" : `Bearer ${token}`}} ).then(response => { return response.data });

		return promise;

	}

	edit_password(token, new_password, confirm_password){

		var promise = axios.post(url + '/edit_password', {  new_password: new_password, confirm_password: confirm_password }, {headers: {"Authorization" : `Bearer ${token}`}} ).then(response => { return response.data });

		return promise;

	}

	search_user(token, type, search){

		var promise = axios.post(url + '/search_user', { type: type, search: search }, {headers: {"Authorization" : `Bearer ${token}`}} ).then(response => { return response.data });

		return promise;

	}

	del_user(){

		var promise = axios.post(url + '/del_user').then(response => { return response.data });

		return promise;

	}

//Tasks

	create_task(token, new_task, id_parent){

		var promise = axios.post(url + '/create_task', { new_task: new_task, id_parent: id_parent}, {headers: {"Authorization" : `Bearer ${token}`}} ).then(response => { return response.data });

		return promise;

	}

	edit_task(token, id_task, edit_task, concluded){

		var promise = axios.post(url + '/edit_task', { id: id_task, task: edit_task, concluded: concluded}, {headers: {"Authorization" : `Bearer ${token}`}} ).then(response => { return response.data });

		return promise;

	}

	all_tasks(token){

		var promise = axios.get(url + '/all_tasks', { headers: {"Authorization" : `Bearer ${token}`}}).then(response => { return response.data });

		return promise;

	}

	search_task(token, type, search){

		var promise = axios.post(url + '/search_task', { type: type, search: search }, {headers: {"Authorization" : `Bearer ${token}`}} ).then(response => { return response.data });

		return promise;

	}

	del_task(token, id_task){

		var promise = axios.post(url + '/del_task', { id: id_task}, {headers: {"Authorization" : `Bearer ${token}`}} ).then(response => { return response.data });

		return promise;

	}

}

export default new Axios()

