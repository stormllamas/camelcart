# Generated by Django 3.1.1 on 2021-03-17 09:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logistics', '0068_seller_is_published'),
        ('accounts', '0018_auto_20210222_0734'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='promo_codes_used',
            field=models.ManyToManyField(to='logistics.PromoCode'),
        ),
    ]
