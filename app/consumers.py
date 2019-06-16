import json

from channels.consumer import AsyncConsumer


class SoundPlayerConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        await self.send({
            'type': 'websocket.accept',
        })

    async def websocket_receive(self, event):
        message = json.loads(event['text'])
        sound_name = message['sound_name']
        await self.send({
            'type': 'websocket.send',
            'text': json.dumps({'sound_name': sound_name}),
        })

    async def websocket_disconnect(self, event):
        pass

