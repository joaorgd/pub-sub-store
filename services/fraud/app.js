const RabbitMQService = require('./rabbitmq-service')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

async function processMessage(msg) {
    const orderData = JSON.parse(msg.content)
    
    let isFraud = false; 
    let totalValue = orderData.products.reduce((sum, p) => sum + parseFloat(p.value), 0);
    
    console.log(`Verificação de fraude:`)
    console.log(`Pedido: ${orderData.name}`) 

    if (totalValue > 5000) {
        isFraud = true;
        console.log(`Status: REPROVADO`)
        console.log(`Motivo: Valor muito alto suspeito.`)
        
        await (await RabbitMQService.getInstance()).send('contact', {
            "clientFullName": orderData.name,
            "to": orderData.email,
            "subject": "Pedido Cancelado - Suspeita de Fraude",
            "text": `Olá ${orderData.name}, seu pedido foi cancelado por segurança.`
        })
    } else {
        console.log(`Status: APROVADO`)
        console.log(`Motivo: Cliente seguro.`)
        
         await (await RabbitMQService.getInstance()).send('contact', { 
            "clientFullName": orderData.name,
            "to": orderData.email,
            "subject": "Pedido Aprovado",
            "text": `${orderData.name}, seu pedido de disco de vinil acaba de ser aprovado!`,
        })
        
        await (await RabbitMQService.getInstance()).send('shipping', orderData)
    }
}

async function consume() {
    console.log(`SUCCESSFULLY SUBSCRIBED TO QUEUE: ${process.env.RABBITMQ_QUEUE_NAME}`)
    await (await RabbitMQService.getInstance()).consume(process.env.RABBITMQ_QUEUE_NAME, (msg) => {processMessage(msg)})
} 

consume()