# Generated by Django 3.1.1 on 2020-12-05 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0009_siteconfiguration_rider_commission'),
    ]

    operations = [
        migrations.AddField(
            model_name='siteconfiguration',
            name='shipping_base',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
    ]
