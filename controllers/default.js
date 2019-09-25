exports.install = function() {

	ROUTE('/', view_plain);
	
};

function view_plain() {
	var self = this;
	self.plain(F.config.name+'\n'+'Version : '+F.config.version+'\n'+'Author : '+F.config.author);
}