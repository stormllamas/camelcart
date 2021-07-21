import asyncio
import json
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async

from .models import Order, Seller
from django.contrib.auth import get_user_model
User = get_user_model()

class OrderConsumer(AsyncConsumer):
  async def websocket_connect(self, event):
    print("connected", event)

    bookings = 'order_update'
    self.bookings = bookings

    await self.channel_layer.group_add(
      bookings,
      self.channel_name
    )

    await self.send({
      "type": "websocket.accept"
    })

  async def websocket_receive(self, event):
    print("receive", event)
    dict_data = event.get('text', None)
    if dict_data:
      loaded_dict_data = json.loads(dict_data)

    await self.channel_layer.group_send(
      self.bookings,
      {
        'type': 'mark_order',
        'text': loaded_dict_data
      }
    )

  async def mark_order(self, event):
    print('message', event)
    order = await self.get_order(int(event['text']['order_id']))
    mark = event['text']['mark']
    
    await self.send({
      "type": "websocket.send",
      "text": json.dumps({
        "mark": mark,
        "order": {
          'id': order['id'],
          'ref_code': order['ref_code'],
          'order_type': order['order_type'],

          'seller': {
            'id': order['seller']['id'],
            'name': order['seller']['name']
          },

          'rider': {
            'id': order['rider']['id'],
            'name': order['rider']['name'],
            'contact': order['rider']['contact'] if order['rider']['contact'] else None,
            'picture': order['rider']['picture'] if order['rider']['picture'] else None,
            'plate_number': order['rider']['plate_number'] if order['rider']['plate_number'] else None
          } if order['rider'] != None and mark == 'claim' else None,

          'loc1_address': order['loc1_address'],
          'loc2_address': order['loc2_address'],
          'payment_type': order['payment_type'],
          'ordered_shipping': float(order['ordered_shipping']),
          'ordered_commission': float(order['ordered_commission'] if order['ordered_commission'] else 0),
          'total': float(order['total']),
          'count': order['count'],
          'rider_payment_needed': order['rider_payment_needed'],
          'two_way': order['two_way'],
          'subtotal': float(order['subtotal']),
          'date_ordered': str(order['date_ordered']),
          'date_delivered': str(order['date_delivered']),
        },
      })
    })


  async def websocket_disconnect(self, event):
    print("disconnect", event)

  @database_sync_to_async
  def get_order(self, order_id):
    order = Order.objects.get(pk=order_id)
    return {
      'id': order.id,
      'ref_code': order.ref_code,
      'order_type': order.order_type,
      'seller': {
        'id': order.seller.id if order.seller else None,
        'name': order.seller.name if order.seller else None
      },

      'rider': {
        'id': order.rider.id if order.rider else None,
        'name': f'{order.rider.first_name} {order.rider.last_name}' if order.rider else None,
        'contact': order.rider.contact if order.rider.contact else None,
        'picture': order.rider.picture.url if order.rider.picture else None,
        'plate_number': order.rider.plate_number if order.rider.plate_number else None
      } if order.rider != None else None,

      'loc1_address': order.loc1_address,
      'loc2_address': order.loc2_address,
      'payment_type': order.payment_type,
      'ordered_shipping': order.ordered_shipping,
      'ordered_commission':  order.ordered_commission if order.ordered_commission else 0,
      'total': order.ordered_total,
      'count': order.count,
      'rider_payment_needed': order.rider_payment_needed,
      'two_way': order.two_way,
      'subtotal': sum([item.quantity*item.ordered_price if item.ordered_price else 0 for item in order.order_items.all()]),
      'date_ordered': order.date_ordered,
      'date_delivered': order.date_delivered,
    }

  @database_sync_to_async
  def get_user(self, user_id):
    return User.objects.get(pk=user_id)