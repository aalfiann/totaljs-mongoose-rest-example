NEWSCHEMA('User').make(function(schema) {

    // Better to use var instead const
    var mongoose = require(F.path.definitions('mongoose_schema'));

    // Schema for Mongoose
    var userSchema = {
        name: {
          type: String,
          required: [true, "A name is required"],
          trim: true,
          max: [40, 'The maximum name length is 40'],
          unique: true
        },
        address: {
            type: String
        }
    };

    // Define User model
    var User = mongoose.setModel('User',userSchema);

    // Define interface schema
    schema.define('id', 'string');
    schema.define('name', 'string', true);
    schema.define('address', 'string');

    // Listen schema validation error from totaljs
    mongoose.schemaErrorBuilder('custom');
    schema.setError((error) => { error.setTransform('custom') });

    // List User
    schema.addWorkflow('list',function($) {
        User.find().then((response) => {
            mongoose.successResponse($,'Data found',response);
        }, (err) => {
            mongoose.errorBuilder($,err);
        });
    });

    // Add User
    schema.addWorkflow('add', function($) {
        var body = $.model.$clean();
        new User(body).save().then((response) => {
            mongoose.successResponse($,'Add user successful',response);
        }, (err) => {
            mongoose.errorHandler($,err);
        });
    });

    // Search User
    schema.addWorkflow('search', function($) {
        var query = $.query;
        User.find({
            $or:[
                {name:{$regex: query.search}},
                {address:{$regex: query.search}}
            ]
        }).then((response) => {
            mongoose.successResponse($,'Data found',response);
        },(err) => {
            mongoose.errorHandler($,err);
        });
    });

    // Update User
    schema.addWorkflow('update', function($) {
        var body = $.model.$clean();
        User.findOneAndUpdate({
            _id:body.id
        }, {
            name:body.name,
            address:body.address
        }, {
            new:true
        }).then((response) => {
            mongoose.successResponse($,'Update data is succesful',response);
        },(err) => {
            mongoose.errorHandler($,err);
        });
    });

    // Delete User
    schema.addWorkflow('delete', function($) {
        User.deleteOne({
            _id:$.id
        }).then((response) => {
            mongoose.successResponse($,'Delete data is succesful',response);
        },(err) => {
            mongoose.errorHandler($,err);
        });
    });

});