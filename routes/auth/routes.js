import fp from 'fastify-plugin'
import generateHash from './generate-hash.js'
import fastify from 'fastify'

module.exports.prefixOverride = ''
module.exports = fp (async function applicationAuth(fasfity,opts){
fasfity.post ('/register', {schema: {body: fasfity.getSchema('schema:auth:register')},handler: 
async function registerHandler (request, reply){
const existingUser = await this.usersDataSource.readUser(request.body.username)
if(existingUser){
        const err = new Error ('User already exists')
        err.statusCode = 409
        throw err 
    }

    const {hash , salt} = await generateHash(request.body.password)

    try{

        const newUserId = await this.usersDataSource.createUser({
         username: request.body.username ,
         salt ,
         hash   

      })
      request.log.info({userId:newUserId}, 'User registered')

      reply.code(201)

      return {registered: true}

     }
     catch (error){

         request.log.error(error, 'failed to register user')

         reply.code(500)

         return {registered: false} 
     }
}
})

fasfity.post('/autentiticate' , {schema:{ body : fasfity.getSchema('schema:auth:register')
} , response : { 200: fasfity.getSchema('schema:auth:token')}, 
handler : async function authenticateHandler(request, reply){
    const user =  await  this.usersDataSource.readUser(request.body.username)
    if (!user){
        const err = new Error ('Wrong credentials provided')
        err.statusCode = 401
         throw err 
    }

 const {hash} = await generateHash(request.body.password , user.salt)
 if( hash != user.hash){
   const err = new Error ('Wrong credentials provided')
    err.statusCode= 401
    throw err 
 }

 request.user = user 
 return refreshHandler (request, reply)
}
})

fasfity.get('/me',{
 onRequest : fasfity.authenticate,
 schema : {
    headers : fasfity.getSchema('schema:auth:token-header')
 },
 response :{
    200: fasfity.getSchema('schema:user')
 }
 , handler: async function meHandler(request, reply){
    return request.user
 }}
)

fasfity.post ('/refresh' , {
onRequest:  fasfity.authenticate , 
schema : {
   headers : fasfity.getSchema('schema:auth:token-header'),
   response : {
    200: fastify.getSchema('schema:auth:token')
   }
} , 
handler: refreshHandler
})

async function refreshHandler(request,reply) {
    const token = await request.generateToken()
    return { token }
}

fasfity.post('/logout',{handler: async function logoutHandler (request, reply){
   onRequest: fasfity.authenticate,
    request.revokeToken() 
    reply.code(204)
 }})

}, {
    name: 'auth-routes', 
    dependencies : ['authentication-plugin'] ,
    encapsulate: true
})














