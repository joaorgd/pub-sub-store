const RabbitMQService = require('./rabbitmq-service')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })

// ... imports e validação mantêm-se iguais ...

async function processMessage(msg) {
    const orderData = JSON.parse(msg.content)
    try {
        if(isValidOrder(orderData)) {
            // MUDANÇA AQUI: Em vez de enviar para 'shipping', enviamos para 'fraud-check'
            await (await RabbitMQService.getInstance()).send('fraud-check', orderData)
            console.log(`✔ ORDER VALIDATED, SENT TO FRAUD CHECK`)
        } else {
            await (await RabbitMQService.getInstance()).send('contact', { 
                "clientFullName": orderData.name,
                "to": orderData.email,
                "subject": "Pedido Reprovado",
                "text": `${orderData.name}, seus dados não foram suficientes...`,
            })
            console.log(`X ORDER REJECTED`)
        }
    } catch (error) {
        console.log(`X ERROR TO PROCESS: ${error.response}`)
    }
}
// ... resto do código igual ...

function isValidOrder(orderData) {
    if(!orderData.products  || orderData.products.length <= 0) { //SEM PRODUTO
        return false
    }
    if(!orderData.cpf || !orderData.name) { //SEM DADOS PESSOAIS
        return false
    }
    return true
}

async function processMessage(msg) {
    const orderData = JSON.parse(msg.content)
    try {
        if(isValidOrder(orderData)) {
            await (await RabbitMQService.getInstance()).send('contact', { 
                "clientFullName": orderData.name,
                "to": orderData.email,
                "subject": "Pedido Aprovado",
                "text": `${orderData.name}, seu pedido de disco de vinil acaba de ser aprovado, e esta sendo preparado para entrega!`,
            })

            await (await RabbitMQService.getInstance()).send('shipping', orderData)
            console.log(`✔ ORDER APPROVED`)
        } else {
            await (await RabbitMQService.getInstance()).send('contact', { 
                "clientFullName": orderData.name,
                "to": orderData.email,
                "subject": "Pedido Reprovado",
                "text": `${orderData.name}, seus dados não foram suficientes para realizar a compra :( por favor tente novamente!`,
            })
            console.log(`X ORDER REJECTED`)
        }
    } catch (error) {
        console.log(`X ERROR TO PROCESS: ${error.response}`)
    }
}

async function consume() {
    console.log(`SUCCESSFULLY SUBSCRIBED TO QUEUE: ${process.env.RABBITMQ_QUEUE_NAME}`)
    await (await RabbitMQService.getInstance()).consume(process.env.RABBITMQ_QUEUE_NAME, (msg) => {processMessage(msg)})
} 

consume()