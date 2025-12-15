import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'

module.exports = fp(async function authentication(fastify, options) {

    const revokedTokens = new Map()
    fastify.register(fastifyJwt,{
     secret: fastify.secrets.JWT_SECRET,
     trusted : function isTrusted (decodedToken){
         return !revokedTokens.has(decodedToken.jti) 
     }})


 fastify.decorate('authenticate' , async function authenticateFn(request, reply){
    try{
     await request.jwtVerify()
    }catch(err){
        reply.send(err)
    }
})


fastify.decorateRequest('revokeToken', function revokeTokenFn(){
  revokedTokens.set(this.user.jti,true)

})

fastify.decorateRequest('generateToken', async function generateTokenFn(){
   const token = await fastify.jwt.sign({
    id:String(this.user.id),
    username: this.user.username
   },{
    jti:String(Date.now()),
    expiresIn : fastify.secrets.JWT_EXPIRE_IN
   })
   return token
}) } ,{

    name: 'authentication-plugin',
    dependencies : ['application-config']
})
 




