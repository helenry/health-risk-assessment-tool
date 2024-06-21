# Generated by Django 4.2.13 on 2024-06-09 22:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='user',
            name='full_name',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.TextField(),
        ),
        migrations.CreateModel(
            name='StrokePrediction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prediction', models.BooleanField(max_length=1)),
                ('crt_at', models.DateTimeField(auto_now_add=True)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='PersonalData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gender', models.CharField(max_length=1)),
                ('birth_date', models.DateField()),
                ('weight', models.IntegerField()),
                ('height', models.IntegerField()),
                ('race', models.TextField()),
                ('smoke', models.BooleanField()),
                ('crt_at', models.DateTimeField(auto_now_add=True)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='HeartDiseasesPrediction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bmi', models.IntegerField()),
                ('race', models.IntegerField()),
                ('gender', models.IntegerField()),
                ('asthma', models.IntegerField()),
                ('stroke', models.IntegerField()),
                ('smoking', models.IntegerField()),
                ('diabetic', models.IntegerField()),
                ('sleep_time', models.IntegerField()),
                ('skin_cancer', models.IntegerField()),
                ('age_category', models.IntegerField()),
                ('drank_alcohol', models.IntegerField()),
                ('mental_health', models.IntegerField()),
                ('kidney_disease', models.IntegerField()),
                ('general_health', models.IntegerField()),
                ('physical_health', models.IntegerField()),
                ('physical_activity', models.IntegerField()),
                ('walking_difficulty', models.IntegerField()),
                ('prediction', models.BooleanField(max_length=1)),
                ('crt_at', models.DateTimeField(auto_now_add=True)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='HeartAttackPrediction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slope', models.IntegerField()),
                ('gender', models.IntegerField()),
                ('previous_peak', models.IntegerField()),
                ('chest_pain_type', models.IntegerField()),
                ('exercise_induced_angina', models.IntegerField()),
                ('thalium_stress_test_result', models.IntegerField()),
                ('maximum_heart_rate_achieved', models.IntegerField()),
                ('major_coronary_arteries_number', models.IntegerField()),
                ('resting_electrocardiographic_result', models.IntegerField()),
                ('prediction', models.BooleanField(max_length=1)),
                ('crt_at', models.DateTimeField(auto_now_add=True)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='DiabetesMellitusPrediction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('age', models.IntegerField()),
                ('bmi', models.IntegerField()),
                ('pregnancy_count', models.IntegerField()),
                ('diastolic_blood_pressure', models.IntegerField()),
                ('diabetes_pedigree_function', models.IntegerField()),
                ('plasma_glucose_concentration', models.IntegerField()),
                ('prediction', models.BooleanField(max_length=1)),
                ('crt_at', models.DateTimeField(auto_now_add=True)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.user')),
            ],
        ),
    ]
