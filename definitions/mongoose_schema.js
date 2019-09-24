const db = require(F.path.definitions('mongoose_conn'));
const mongoose = require('mongoose');
const mongooseSchema = mongoose.Schema;

function transform(doc, ret) {
    delete ret._id;
    ret.id = doc._id.toString();
    return ret;  
}

function createSchema(obj) {
    const schema = new mongooseSchema(obj, {
        toObject: { transform },
        toJSON: { transform }  
    });
      
    schema.set('toObject', {virtuals:true});
    return schema;
}

function setModel(name,schema) {
    return db.model(name, createSchema(schema));
}

/**
 * Modify error from totaljs schema
 * @param {string} name     this is the error key name 
 */
function schemaErrorBuilder(name){
    return ErrorBuilder.addTransform(name, function(isResponse) {
        var builder = [];
    
        for (var i = 0, length = this.items.length; i < length; i++) {
            var err = this.items[i];
            builder.push({name:err.name,error:err.error});
        }
    
        if (isResponse) {
            if (builder.length > 0){
                this.status = 400;
                return JSON.stringify({
                    code:this.status,
                    status:'error',
                    message:'Invalid parameter',
                    error:builder
                });
            } else {
                this.status = 500;
                return JSON.stringify({
                    code:this.status,
                    status:'error',
                    message:'Something went wrong...'
                });
            }
        }
        return builder;
    });
}

function errorHandler($, err){
    $.controller.status = 400;
    var error = {
        code:err.code,
        status:'error',
        message:err.errmsg,
        error:{
            driver:err.driver,
            name:err.name,
            index:err.index,
            keyPattern:err.keyPattern,
            keyValue:err.keyValue
        }
    }
    $.callback(JSON.parse(JSON.stringify(error)));
}

function successResponse ($,message, response=[]) {
    $.controller.status = 200;
    var success = {
        'code':200,
        'status':'success',
        'message':message,
        'response':response
    }
    $.callback(JSON.parse(JSON.stringify(success)));
}

function failResponse ($, message, response=[]) {
    $.controller.status = 200;
    var fail = {
        'code':200,
        'status':'error',
        'message':message,
        'response':response
    }
    $.callback(JSON.parse(JSON.stringify(fail)));
}

function customResponse ($, code, status, message, response=[], isError=false) {
    $.controller.status = code;
    var custom = {
        'code':code,
        'status':status,
        'message':message
    }
    if(response !== undefined && response !== null) {
        var name = undefined;
        if(isError) {
            name = 'error';
        } else {
            name = 'response';
        }
        custom[name] = response;
    }
    $.callback(JSON.parse(JSON.stringify(custom)));
}

module.exports = {
    createSchema,
    setModel,
    schemaErrorBuilder,
    errorHandler,
    successResponse,
    failResponse,
    customResponse
}