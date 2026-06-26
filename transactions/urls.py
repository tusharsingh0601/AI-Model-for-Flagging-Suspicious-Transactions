from django.urls import path
from django.contrib.auth import views as auth_views # 1. Import built-in auth views
from . import views
print("====== URL FILE LOADED ======")
print(__file__)

urlpatterns = [
    # --- Main Pages ---
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),

    # --- Authentication (The Fix) ---
    
    # 1. LOGIN: Use Django's built-in view, but tell it where our HTML is
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    
    # 2. LOGOUT: Redirect to home after logging out
    path('logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    
    # 3. SIGNUP: This uses our custom view because we need to save the user
    path('signup/', views.signup, name='signup'),
    
    # --- API for AI ---
    path('predict/', views.predict, name='predict'),
    path('predict_csv/', views.predict_csv, name='predict_csv'),
]