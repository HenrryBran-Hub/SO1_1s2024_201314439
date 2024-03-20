import redis

redis_host = '10.159.202.6'

r = redis.Redis(host=redis_host, port=6379)

pubsub = r.pubsub()
pubsub.subscribe('test')

print('Esperando mensajes...')

for message in pubsub.listen():
    if message['type'] == 'message':
        print('Mensaje recibido:', message['data'])
