exports.generate = function(error, message, status, data){
    
 let myResponse = {
         error: error,
         message: message,
         status: status,
         data: data
 }

 return myResponse;
}