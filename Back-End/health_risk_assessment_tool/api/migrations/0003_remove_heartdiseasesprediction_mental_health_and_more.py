# Generated by Django 4.2.13 on 2024-06-20 03:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_user_email_alter_user_full_name_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='heartdiseasesprediction',
            name='mental_health',
        ),
        migrations.RemoveField(
            model_name='heartdiseasesprediction',
            name='physical_health',
        ),
        migrations.RemoveField(
            model_name='heartdiseasesprediction',
            name='race',
        ),
        migrations.RemoveField(
            model_name='heartdiseasesprediction',
            name='sleep_time',
        ),
        migrations.RemoveField(
            model_name='personaldata',
            name='race',
        ),
        migrations.RemoveField(
            model_name='personaldata',
            name='smoke',
        ),
        migrations.AddField(
            model_name='personaldata',
            name='ever_married',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='personaldata',
            name='pregnancy_count',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='personaldata',
            name='residence_type',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='personaldata',
            name='work_type',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='strokeprediction',
            name='age',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='strokeprediction',
            name='average_glucose_level',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='strokeprediction',
            name='bmi',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='strokeprediction',
            name='ever_married',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='strokeprediction',
            name='gender',
            field=models.CharField(default=1, max_length=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='strokeprediction',
            name='heart_disease',
            field=models.BooleanField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='strokeprediction',
            name='hypertension',
            field=models.BooleanField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='strokeprediction',
            name='residence_type',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='strokeprediction',
            name='smoking_status',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='strokeprediction',
            name='work_type',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='heartattackprediction',
            name='gender',
            field=models.CharField(max_length=1),
        ),
    ]