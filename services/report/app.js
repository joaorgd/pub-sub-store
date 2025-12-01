const RabbitMQService = require('./rabbitmq-service')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })

var report = {}

async function updateReport(products) {
    for(let product of products) {
        if(!product.name) {
            continue
        } else if(!report[product.name]) {
            report[product.name] = 1;
        } else {
            report[product.name]++;
        }
    }
}

async function printReport() {
    for (const [key, value] of Object.entries(report)) {
        console.log(`${key} = ${value} sales`);
      }
}

async function processMessage(msg) {
    const orderData = JSON.parse(msg.content)
    // Adiciona produtos ao relatório
    await updateReport(orderData.products)
    // Imprime o relatório atualizado
    await printReport()
}

async function consume() {
    console.log(`REPORT SERVICE STARTED`)
    // Usa a variável de ambiente ou um padrão
    const queueName = process.env.RABBITMQ_QUEUE_NAME || 'report'; 
    await (await RabbitMQService.getInstance()).consume(queueName, (msg) => {processMessage(msg)})
} 

consume()