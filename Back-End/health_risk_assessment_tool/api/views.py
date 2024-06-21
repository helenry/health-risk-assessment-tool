import os
import jwt
import json
import pickle

from django.db.models import Q
from dotenv import load_dotenv
from django.shortcuts import render
from .serializers import UserSerializer
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from django.core.serializers import serialize
from django.core.exceptions import ObjectDoesNotExist
from .models import User, PersonalData, StrokePrediction, HeartDiseasesPrediction, HeartAttackPrediction, DiabetesMellitusPrediction

class SignUpView(APIView):
    def post(self, request):
        load_dotenv()

        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)

            User.objects.create(full_name=body['full_name'], email=body['email'], password=body['password'])
            user = User.objects.get(email=body['email'], password=body['password'])
            logged = user.id
            user = json.loads(serialize('json', [user]))[0]['fields']
            user['id'] = logged

            token = jwt.encode(
                {
                    'user': user,
                    'exp': datetime.utcnow() + timedelta(days=1)
                },
                os.getenv('JWT_SECRET_KEY'),
                algorithm='HS256'
            )

            return Response({ 'status': True, 'message': 'SIGN UP SUCCESS', 'payload': {
                'user': user,
                'token': token
            } })
        except Exception as e:
            return Response({ 'status': False, 'message': f'ERROR SIGN UP: {e}' })

class SignInView(APIView):
    def post(self, request):
        load_dotenv()

        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)

            user = User.objects.get(email=body['email'], password=body['password'])
            logged = user.id
            user = json.loads(serialize('json', [user]))[0]['fields']
            user['id'] = logged

            token = jwt.encode(
                {
                    'user': user,
                    'exp': datetime.utcnow() + timedelta(days=1)
                },
                os.getenv('JWT_SECRET_KEY'),
                algorithm='HS256'
            )

            return Response({ 'status': True, 'message': 'SIGN IN SUCCESS', 'payload': {
                'user': user,
                'token': token
            } })
        except Exception as e:
            return Response({ 'status': False, 'message': f'ERROR SIGN IN: {e}' })

class UserDataView(APIView):
    def post(self, request):
        load_dotenv()
        token = request.META.get('HTTP_AUTHORIZATION')[7:]

        try:
            logged = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
        except jwt.exceptions.DecodeError as e:
            return Response({ 'status': False, 'message': f'UNAUTHORIZED ACCESS' })

        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)

            user = User.objects.get(id=logged['user']['id'])

            PersonalData.objects.create(
                user_id=user,
                birth_date=body['birth_date'],
                gender=body['gender'],
                weight=body['weight'],
                height=body['height'],
                ever_married=body['ever_married'],
                work_type=body['work_type'],
                residence_type=body['residence_type'],
                pregnancy_count=body['pregnancy_count']
            )

            data = PersonalData.objects.get(user_id=logged['user']['id'])
            data = json.loads(serialize('json', [data]))[0]['fields']

            return Response({ 'status': True, 'message': 'POST USER DATA SUCCESS', 'payload': {
                'data': data
            } })
        except Exception as e:
            return Response({ 'status': False, 'message': f'ERROR POST USER DATA: {e}' })

    def get(self, request):
        load_dotenv()
        token = request.META.get('HTTP_AUTHORIZATION')[7:]

        try:
            logged = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
        except jwt.exceptions.DecodeError as e:
            return Response({ 'status': False, 'message': f'UNAUTHORIZED ACCESS' })

        try:
            data = PersonalData.objects.get(user_id=logged['user']['id'])
            data = json.loads(serialize('json', [data]))[0]['fields']

            return Response({ 'status': True, 'message': 'GET USER DATA SUCCESS', 'payload': {
                'data': data,
            } })
        except Exception as e:
            return Response({ 'status': False, 'message': f'ERROR GET USER DATA: {e}' })

    def patch(self, request):
        load_dotenv()
        token = request.META.get('HTTP_AUTHORIZATION')[7:]

        try:
            logged = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
        except jwt.exceptions.DecodeError as e:
            return Response({ 'status': False, 'message': f'UNAUTHORIZED ACCESS' })

        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)

            personal_data = PersonalData.objects.get(user_id=logged['user']['id'])

            for field, value in body.items():
                if field in ['birth_date', 'gender', 'weight', 'height', 'ever_married', 'work_type', 'residence_type', 'pregnancy_count']:
                    setattr(personal_data, field, value)

            personal_data.save()

            data = PersonalData.objects.get(user_id=logged['user']['id'])
            data = json.loads(serialize('json', [data]))[0]['fields']

            return Response({ 'status': True, 'message': 'PATCH USER DATA SUCCESS', 'payload': {
                'data': data
            } })
        except Exception as e:
            return Response({ 'status': False, 'message': f'ERROR PATCH USER DATA: {e}' })
        
class DecryptView(APIView):
    def get(self, request):
        load_dotenv()
        token = request.META.get('HTTP_AUTHORIZATION')[7:]

        try:
            logged = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
        except jwt.exceptions.DecodeError as e:
            return Response({ 'status': False, 'message': f'UNAUTHORIZED ACCESS' })

        try:
            try:
                data = PersonalData.objects.get(user_id=logged['user']['id'])
                data = json.loads(serialize('json', [data]))[0]['fields']
            except ObjectDoesNotExist:
                data = None

            return Response({ 'status': True, 'message': 'DECRYPT SUCCESS', 'payload': {
                'user': logged['user'],
                'data': data
            } })
        except Exception as e:
            return Response({ 'status': False, 'message': f'ERROR DECRYPT: {e}' })

class PredictView(APIView):
    def post(self, request, type):
        load_dotenv()
        token = request.META.get('HTTP_AUTHORIZATION')[7:]

        try:
            logged = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
        except jwt.exceptions.DecodeError as e:
            return Response({ 'status': False, 'message': f'UNAUTHORIZED ACCESS' })

        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)

            filename = 'stroke' if type == 'stroke' else 'heart_diseases' if type == 'heartdiseases' else 'heart_attack' if type == 'heartattack' else 'diabetes_mellitus'
            
            with open(f'api\models\{filename}_model.pkl', 'rb') as f:
                pipeline = pickle.load(f)

            prediction = pipeline.predict([body['data']])

            user = User.objects.get(id=logged['user']['id'])

            if type == 'stroke':
                StrokePrediction.objects.create(
                    user_id=user,
                    gender=body['data'][0],
                    age=body['data'][1],
                    hypertension=body['data'][2],
                    heart_disease=body['data'][3],
                    ever_married=body['data'][4],
                    work_type=body['data'][5],
                    residence_type=body['data'][6],
                    average_glucose_level=body['data'][7],
                    bmi=body['data'][8],
                    smoking_status=body['data'][9],
                    prediction=prediction
                )
            elif type == 'heartdiseases':
                HeartDiseasesPrediction.objects.create(
                    user_id=user,
                    bmi=body['data'][0],
                    smoking=body['data'][1],
                    drank_alcohol=body['data'][2],
                    stroke=body['data'][3],
                    walking_difficulty=body['data'][4],
                    gender=body['data'][5],
                    age_category=body['data'][6],
                    diabetic=body['data'][7],
                    physical_activity=body['data'][8],
                    general_health=body['data'][9],
                    asthma=body['data'][10],
                    kidney_disease=body['data'][11],
                    skin_cancer=body['data'][12],
                    prediction=prediction
                )
            elif type == 'heartattack':
                HeartAttackPrediction.objects.create(
                    user_id=user,
                    gender=body['data'][0],
                    chest_pain_type=body['data'][1],
                    resting_electrocardiographic_result=body['data'][2],
                    maximum_heart_rate_achieved=body['data'][3],
                    exercise_induced_angina=body['data'][4],
                    previous_peak=body['data'][5],
                    slope=body['data'][6],
                    major_coronary_arteries_number=body['data'][7],
                    thalium_stress_test_result=body['data'][8],
                    prediction=prediction
                )
            elif type == 'diabetesmellitus':
                DiabetesMellitusPrediction.objects.create(
                    user_id=user,
                    pregnancy_count=body['data'][0],
                    plasma_glucose_concentration=body['data'][1],
                    diastolic_blood_pressure=body['data'][2],
                    triceps_skin_fold_thickness=body['data'][3],
                    two_hour_insulin=body['data'][4],
                    bmi=body['data'][5],
                    diabetes_pedigree_function=body['data'][6],
                    age=body['data'][7],
                    prediction=prediction
                )

            return Response({ 'status': True, 'message': f'PREDICT {type.upper()} SUCCESS', 'payload': { 'prediction_result': prediction[0] } })
        except Exception as e:
            return Response({ 'status': False, 'message': f'ERROR PREDICT {type.upper()}: {e}' })

class GetPredictionHistoryView(APIView):
    def get(self, request):
        load_dotenv()
        token = request.META.get('HTTP_AUTHORIZATION')[7:]

        try:
            logged = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
        except jwt.exceptions.DecodeError as e:
            return Response({ 'status': False, 'message': f'UNAUTHORIZED ACCESS' })

        try:
            stroke = StrokePrediction.objects.filter(user_id=logged['user']['id']).values()
            heartattack = HeartAttackPrediction.objects.filter(user_id=logged['user']['id']).values()
            heartdiseases = HeartDiseasesPrediction.objects.filter(user_id=logged['user']['id']).values()
            diabetesmellitus = DiabetesMellitusPrediction.objects.filter(user_id=logged['user']['id']).values()

            return Response({ 'status': True, 'message': f'GET ALL PREDICTION HISTORY SUCCESS', 'payload': {
                'history': {
                    'stroke': stroke,
                    'heartattack': heartattack,
                    'heartdiseases': heartdiseases,
                    'diabetesmellitus': diabetesmellitus
                }
            } })
        except Exception as e:
            return Response({ 'status': False, 'message': f'ERROR GET ALL PREDICTION HISTORY: {e}' })