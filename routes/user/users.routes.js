


async function ImprimiendoMensajeAutoHook(request, reply){
        console.log('capturando request al enpoint de usuarios')
}

export default async function usersRoutes(fastify, opts) {
    fastify.addHook('onRequest', ImprimiendoMensajeAutoHook)
}