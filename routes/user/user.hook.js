async function imprimirMensajeUser(request, reply){
    console.log('Imprimiendo mensaje desde user')
    return 'Imprimiendo mensaje desde user'
}

export default async function userRoutes(fastify, opts){
    fastify.get('/', imprimirMensajeUser)
}