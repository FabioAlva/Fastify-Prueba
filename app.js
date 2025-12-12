
export default async function(fastify, opts){

 fastify.register(AutoLoad,{
    dir: path.join(__dirname,'schemas'),
    indexPattern:  /^loader.js$/i
 })

 fastify.register(AutoLoad, {
    dir: path.join(__dirname,'plugins'),
    dirNameRoutePrefix: false,
    options :  Object.assign({},opts)
 })

fastify.register(AutoLoad,{
 dir: join(__dirname,'routes'),
 options : Object.assign({},opts)
}
)
}
