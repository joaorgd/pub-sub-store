# ... (Mantenha o topo igual até shipping-service) ...

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