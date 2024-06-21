from django.urls import path
from . import views

urlpatterns = [
    path('user/signup/', views.SignUpView.as_view(), name='sign_up'),
    path('user/signin/', views.SignInView.as_view(), name='sign_in'),
    path('user/data/', views.UserDataView.as_view(), name='user_data'),
    path('user/decrypt/', views.DecryptView.as_view(), name='user_data'),
    path('predict/history/', views.GetPredictionHistoryView.as_view(), name='get_prediction_history'),
    path('predict/<str:type>/', views.PredictView.as_view(), name='predict')
]