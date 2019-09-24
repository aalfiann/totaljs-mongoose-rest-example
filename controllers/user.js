exports.install = function() {

    ROUTE('/api/user', ['get','post','*User --> @search']);
    ROUTE('/api/user/list', ['get','post','*User --> @list']);
    ROUTE('/api/user/add', ['post','*User --> @add']);
    ROUTE('/api/user/update', ['put','*User --> @update']);
    ROUTE('/api/user/delete/{id}', ['delete','*User --> @delete']);

};
