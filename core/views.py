from django.shortcuts import render
from .data import JOBS


def home(request):
    return render(request, "core/mockup.html", {"jobs": JOBS})


def login_page(request):
    return render(request, "core/login.html")


def job_detail(request, job_id):
    job = next((item for item in JOBS if item["id"] == job_id), None)
    return render(request, "core/job_detail.html", {"job": job})


def dashboard(request, role, title, description):
    return render(request, "core/dashboard.html", {"role": role, "title": title, "description": description, "jobs": JOBS})


def student_dashboard(request):
    return dashboard(request, "student", "พื้นที่ของนักศึกษา", "ดูงานที่แนะนำ รายการโปรด และสถานะการสมัคร")


def enterprise_dashboard(request):
    return dashboard(request, "enterprise", "พื้นที่สถานประกอบการ", "จัดการประกาศงานและผู้สมัคร")


def institution_dashboard(request):
    return dashboard(request, "institution", "พื้นที่สถาบันการศึกษา", "ตรวจสอบนักศึกษาและคำขอยืนยันทักษะ")


def admin_dashboard(request):
    return dashboard(request, "admin", "พื้นที่ผู้ดูแลระบบ", "จัดการผู้ใช้งาน ประกาศงาน และรายการรอตรวจสอบ")