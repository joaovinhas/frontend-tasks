import axios from "axios";

const url = "http://127.0.0.1:8000/api";

class Axios{

//Users

	register(name, email, password, confirm_password){

		var promise = axios.post(url + '/register', {name: name, email: email, password: password, confirm_password: confirm_password}).then(response => { return response.data });

		return promise;

	}

	login(){

		var promise = axios.post(url + '/login').then(response => { return response.data });

		return promise;

	}

	show_user(){

		var promise = axios.post(url + '/show_user').then(response => { return response.data });

		return promise;

	}

	show_users(){

		var promise = axios.get(url + '/show_users').then(response => { return response.data });

		return promise;

	}

	edit_user(){

		var promise = axios.post(url + '/edit_user').then(response => { return response.data });

		return promise;

	}

	edit_permission(){

		var promise = axios.post(url + '/edit_permission').then(response => { return response.data });

		return promise;

	}

	search_user(){

		var promise = axios.post(url + '/search_user').then(response => { return response.data });

		return promise;

	}

	del_user(){

		var promise = axios.post(url + '/del_user').then(response => { return response.data });

		return promise;

	}

//Tasks

	create_task(){

		var promise = axios.post(url + '/create_task').then(response => { return response.data });

		return promise;

	}

	edit_task(){

		var promise = axios.post(url + '/edit_task').then(response => { return response.data });

		return promise;

	}

	all_tasks(){

		var promise = axios.post(url + '/all_tasks').then(response => { return response.data });

		return promise;

	}

	search_task(){

		var promise = axios.post(url + '/search_task').then(response => { return response.data });

		return promise;

	}

	del_task(){

		var promise = axios.post(url + '/del_task').then(response => { return response.data });

		return promise;

	}

}

export default new Axios()

