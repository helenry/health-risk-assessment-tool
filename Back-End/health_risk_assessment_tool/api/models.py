from django.db import models

class User(models.Model):
    full_name = models.TextField()
    email = models.TextField()
    password = models.TextField()
    crt_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name

class PersonalData(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    birth_date = models.DateField()
    gender = models.IntegerField()
    weight = models.IntegerField()
    height = models.IntegerField()
    ever_married = models.IntegerField()
    work_type = models.IntegerField()
    residence_type = models.IntegerField()
    pregnancy_count = models.IntegerField()
    crt_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.gender

class StrokePrediction(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    gender = models.IntegerField() # personal data
    age = models.IntegerField() # personal data
    hypertension = models.IntegerField()
    heart_disease = models.IntegerField()
    ever_married = models.IntegerField() # personal data
    work_type = models.IntegerField() # personal data
    residence_type = models.IntegerField() # personal data
    average_glucose_level = models.IntegerField()
    bmi = models.IntegerField() # personal data
    smoking_status = models.IntegerField()
    prediction = models.IntegerField()
    crt_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.prediction

class HeartDiseasesPrediction(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    bmi = models.IntegerField() # personal data
    smoking = models.IntegerField()
    drank_alcohol = models.IntegerField()
    stroke = models.IntegerField()
    walking_difficulty = models.IntegerField()
    gender = models.IntegerField() # personal data
    age_category = models.IntegerField() # personal data
    diabetic = models.IntegerField()
    physical_activity = models.IntegerField()
    general_health = models.IntegerField()
    asthma = models.IntegerField()
    kidney_disease = models.IntegerField()
    skin_cancer = models.IntegerField()
    prediction = models.IntegerField()
    crt_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.prediction

class HeartAttackPrediction(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    gender = models.IntegerField() # personal data
    chest_pain_type = models.IntegerField()
    resting_electrocardiographic_result = models.IntegerField()
    maximum_heart_rate_achieved = models.IntegerField()
    exercise_induced_angina = models.IntegerField()
    previous_peak = models.IntegerField()
    slope = models.IntegerField()
    major_coronary_arteries_number = models.IntegerField()
    thalium_stress_test_result = models.IntegerField()
    prediction = models.IntegerField()
    crt_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.prediction

class DiabetesMellitusPrediction(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    pregnancy_count = models.IntegerField() # personal data
    plasma_glucose_concentration = models.IntegerField()
    diastolic_blood_pressure = models.IntegerField()
    triceps_skin_fold_thickness = models.IntegerField()
    two_hour_insulin = models.IntegerField()
    bmi = models.IntegerField() # personal data
    diabetes_pedigree_function = models.IntegerField()
    age = models.IntegerField() # personal data
    prediction = models.IntegerField()
    crt_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.prediction