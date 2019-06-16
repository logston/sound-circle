import json
import random

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from . import utils


class SoundPlayerConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        await self.accept()

        sound_names = utils.get_sound_names()

        device_sound_name = random.choice(sound_names)

        data = {
            'just_connected': True,
            'device_sound_name': device_sound_name,
        }

        await self.send_json(data)

    async def receive_json(self, message):
        sound_name = message['sound_name']
        content = {
          'sound_name': sound_name,
        }
        await self.send_json(content)

    async def disconnect(self):
        pass

