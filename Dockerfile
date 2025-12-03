# --- IMAGEM BASE ---
FROM node:14.16.1-alpine3.10 AS base
WORKDIR /var/www/

# --- SERVIÇOS ORIGINAIS ---

FROM base AS contact-service
ADD  services/contact/ .
RUN npm install --only=production 
CMD [ "node", "app.js" ]

FROM base AS order-service
ADD  services/order/ .
RUN npm install --only=production 
CMD [ "node", "app.js" ]

FROM base AS shipping-service
ADD  services/shipping/ .
RUN npm install --only=production 
CMD [ "node", "app.js" ]

# --- NOVOS SERVIÇOS (SPRINT FINAL) ---

FROM base AS report-service
ADD  services/report/ .
RUN npm install --only=production 
CMD [ "node", "app.js" ]

FROM base AS fraud-service
ADD  services/fraud/ .
RUN npm install --only=production 
CMD [ "node", "app.js" ]

FROM base AS inventory-service
ADD  services/inventory/ .
RUN npm install --only=production 
CMD [ "node", "app.js" ]