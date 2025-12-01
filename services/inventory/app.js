const RabbitMQService = require('./rabbitmq-service')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

async function processMessage(msg) {
    const orderData = JSON.parse(msg.content)
    
    // Lógica simulada de estoque [cite: 30-33]
    console.log(`Estoque atualizado:`)
    if(orderData.products) {
        orderData.products.forEach(p => {
            console.log(`Produto: ${p.name}`)
            console.log(`Quantidade restante: ${Math.floor(Math.random() * 50)}`) // Simulação
        });
    }
}

async function consume() {
    console.log(`SUCCESSFULLY SUBSCRIBED TO QUEUE: ${process.env.RABBITMQ_QUEUE_NAME}`)
    await (await RabbitMQService.getInstance()).consume(process.env.RABBITMQ_QUEUE_NAME, (msg) => {processMessage(msg)})
} 

consume()