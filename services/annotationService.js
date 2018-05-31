var create = function(user, annotation, sentence0_id, sentence1_id) {
	return knex('annotations')
			.insert({id:null, user:user, annotation:annotation, sentence0_id: sentence0_id, sentence1_id: sentence1_id})
			.then(function(id) {
				return knex('annotations').select('*').where({id:id[0]})
			}).catch(function(err) { 
        console.log(err);
      });
}

var del = function(id) {
	return knex("annotations").where("id","=",id).del();
}

var delAll = function(id) {
	return knex("annotations").del();
}

var list = function() {
	return knex.select("*").from('annotations');
}
	
module.exports = {
	create: create,
	del: del,
	delAll: delAll,
	list:list,
}
