import json
import random

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from . import utils


class SoundPlayerConsumer(AsyncJsonWebsocketConsumer):
    group_name = 'music'

    async def connect(self):
        await self.accept()

        sound_names = utils.get_sound_names()

        device_sound_name = random.choice(sound_names)

        formatted_sound_string = self.get_formatted_sound_string(device_sound_name)

        data = {
            'just_connected': True,
            'device_sound_name': device_sound_name,
            'formatted_sound_string': formatted_sound_string,
        }

        await self.send_json(data)

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive_json(self, message):
        sound_name = message['sound_name']

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'play_sound',
                'sound_name': sound_name,
            }
        )

    async def play_sound(self, message):
        sound_name = message['sound_name']
        content = {
          'sound_name': sound_name,
        }
        await self.send_json(content)

    def get_formatted_sound_string(self, sound_name):
        name, _ = sound_name.split('__')
        name = name.replace('-', ' ')
        return f'Booyeah! You got a {name}'

