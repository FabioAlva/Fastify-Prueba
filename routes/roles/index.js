

async function capturarRequest(request, reply) {
  console.log('Capturando request de roles')
}

export default async function rolesRoutes(fastify, opts) {
  
  fastify.addHook('onRequest', capturarRequest)

  fastify.get('/', async function imprimirMensaje(request, reply) {
    return 'hola ruta roles'
  })

}
