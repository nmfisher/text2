var create = function(name) {
	return knex('labels')
			.insert({id:null, name:name})
			.then(function(id) {
				return knex('labels').select('*').where({id:id[0]})
			});
}

var del = function(id) {
	return knex("labels").where("id","=",id).del();
}

var delAll = function(id) {
	return knex("labels").del();
}

var list = function() {
	return knex.select("*").from('labels');
}

var rename = function(id, newName) {
	console.log(id)
	console.log(newName)
	return knex('labels').where('id','=',id).update({ name: newName })
}
	
module.exports = {
	create: create,
	del: del,
	delAll: delAll,
	list:list,
	rename: rename
}