from django.urls import path
from . import views

app_name = "core"
urlpatterns = [
    path("", views.home, name="home"),
    path("login/", views.login_page, name="login"),
    path("jobs/<str:job_id>/", views.job_detail, name="job_detail"),
    path("student/", views.student_dashboard, name="student"),
    path("enterprise/", views.enterprise_dashboard, name="enterprise"),
    path("institution/", views.institution_dashboard, name="institution"),
    path("admin-dashboard/", views.admin_dashboard, name="admin_dashboard"),
]