const redis = require('redis');

const client = redis.createClient({
    host: '10.159.202.6',
    port: 6379 
});

client.on('error', function (err) {
    console.error('Error de conexión a Redis:', err);
});

const message = { msg: "Hola a todos" };

client.publish('test', JSON.stringify(message), (err) => {
    if (err) {
        console.error('Error al publicar el mensaje:', err);
    } else {
        console.log('Mensaje publicado con éxito en el canal test.');
    }
    client.quit();
});
