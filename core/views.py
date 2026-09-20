import json

from django.db import transaction
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie

from .data import JOBS
from .models import Company, EnterpriseContact, JobPost


@ensure_csrf_cookie
def home(request):
    return render(request, "core/mockup.html", {"jobs": JOBS})


def _json_body(request):
    try:
        return json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return None


def _required(data, fields):
    return [field for field in fields if not str(data.get(field, "")).strip()]


def enterprise_register(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    data = _json_body(request)
    if data is None:
        return JsonResponse({"error": "รูปแบบข้อมูลไม่ถูกต้อง"}, status=400)

    required = ["company_name", "registration_number", "business_type", "company_address",
                "company_phone", "company_email", "full_name", "position", "hr_phone",
                "hr_email", "password"]
    missing = _required(data, required)
    if missing:
        return JsonResponse({"error": "กรุณากรอกข้อมูลให้ครบทุกช่อง"}, status=400)
    if data["password"] != data.get("confirm_password"):
        return JsonResponse({"error": "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน"}, status=400)
    if len(data["password"]) < 8:
        return JsonResponse({"error": "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"}, status=400)

    try:
        with transaction.atomic():
            company = Company.objects.create(
                name=data["company_name"].strip(),
                registration_number=data["registration_number"].strip(),
                business_type=data["business_type"].strip(),
                address=data["company_address"].strip(),
                phone=data["company_phone"].strip(),
                email=data["company_email"].strip(),
            )
            contact = EnterpriseContact.objects.create(
                company=company,
                full_name=data["full_name"].strip(),
                position=data["position"].strip(),
                department=data.get("department", "").strip(),
                phone=data["hr_phone"].strip(),
                email=data["hr_email"].strip(),
                password=make_password(data["password"]),
            )
    except Exception as exc:
        if "UNIQUE" in str(exc):
            return JsonResponse({"error": "เลขทะเบียนบริษัทหรืออีเมลนี้ถูกใช้งานแล้ว"}, status=400)
        raise

    request.session["enterprise_company_id"] = company.id
    return JsonResponse({"company_id": company.id, "contact_id": contact.id, "company_name": company.name}, status=201)


def enterprise_posts(request):
    company_id = request.session.get("enterprise_company_id")
    if request.method == "GET":
        queryset = JobPost.objects.filter(company_id=company_id).order_by("-created_at") if company_id else JobPost.objects.none()
        return JsonResponse({"posts": [_serialize_post(post) for post in queryset]})
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    data = _json_body(request)
    if data is None:
        return JsonResponse({"error": "รูปแบบข้อมูลไม่ถูกต้อง"}, status=400)

    payload, error_response = _normalize_post_payload(data)
    if error_response is not None:
        return error_response

    company = Company.objects.filter(pk=company_id).first()
    if company is None:
        company, _ = Company.objects.get_or_create(
            registration_number="0000000000000",
            defaults={
                "name": "บริษัท ดิจิทัล โซลูชันส์ จำกัด",
                "business_type": "พัฒนาซอฟต์แวร์และดิจิทัลโซลูชัน",
                "address": "AIA Capital Center, กรุงเทพฯ",
                "phone": "02-123-4567",
                "email": "recruit@digitalsol.co.th",
            },
        )
        request.session["enterprise_company_id"] = company.id

    post = JobPost.objects.create(
        company=company, **payload,
    )
    return JsonResponse({"post": _serialize_post(post)}, status=201)


def _serialize_post(post):
    return {
        "id": f"db-{post.id}", "jobId": f"db-{post.id}", "title": post.title,
        "applicants": 0, "status": post.status, "postedAt": post.created_at.date().isoformat(),
        "company": post.company.name, "openings": post.openings, "department": post.department,
        "skills": post.skills, "description": post.description, "salary": post.salary,
        "location": post.location, "workHours": post.work_hours,
        "requirements": post.requirements, "benefits": post.benefits,
    }


def _normalize_post_payload(data):
    missing = _required(data, ["title", "openings", "department", "description", "location", "work_hours", "requirements"])
    if missing:
        return None, JsonResponse({"error": "กรุณากรอกข้อมูลประกาศให้ครบ"}, status=400)

    try:
        openings = int(data["openings"])
        if openings < 1:
            raise ValueError
    except (TypeError, ValueError):
        return None, JsonResponse({"error": "จำนวนที่รับต้องเป็นตัวเลขตั้งแต่ 1 ขึ้นไป"}, status=400)

    return {
        "title": str(data["title"]).strip(),
        "openings": openings,
        "department": str(data["department"]).strip(),
        "skills": data.get("skills", []) or [],
        "description": str(data["description"]).strip(),
        "salary": str(data.get("salary", "")).strip(),
        "location": str(data["location"]).strip(),
        "work_hours": str(data["work_hours"]).strip(),
        "requirements": str(data["requirements"]).strip(),
        "benefits": str(data.get("benefits", "")).strip(),
    }, None


def _find_company_post(request, post_id):
    company_id = request.session.get("enterprise_company_id")
    if company_id is None:
        return None, JsonResponse({"error": "กรุณาเข้าสู่ระบบสถานประกอบการก่อน"}, status=403)

    try:
        post_pk = int(str(post_id).replace("db-", ""))
    except (TypeError, ValueError):
        return None, JsonResponse({"error": "รหัสประกาศไม่ถูกต้อง"}, status=400)

    post = JobPost.objects.filter(company_id=company_id, pk=post_pk).first()
    if post is None:
        return None, JsonResponse({"error": "ไม่พบประกาศงานนี้"}, status=404)
    return post, None


def enterprise_post_detail(request, post_id):
    post, error_response = _find_company_post(request, post_id)
    if error_response is not None:
        return error_response

    if request.method == "GET":
        return JsonResponse({"post": _serialize_post(post)})

    if request.method == "PUT":
        data = _json_body(request)
        if data is None:
            return JsonResponse({"error": "รูปแบบข้อมูลไม่ถูกต้อง"}, status=400)
        payload, error_response = _normalize_post_payload(data)
        if error_response is not None:
            return error_response

        post.title = payload["title"]
        post.openings = payload["openings"]
        post.department = payload["department"]
        post.skills = payload["skills"]
        post.description = payload["description"]
        post.salary = payload["salary"]
        post.location = payload["location"]
        post.work_hours = payload["work_hours"]
        post.requirements = payload["requirements"]
        post.benefits = payload["benefits"]
        post.save()
        return JsonResponse({"post": _serialize_post(post)})

    if request.method == "DELETE":
        post.delete()
        return JsonResponse({"success": True, "deleted_id": f"db-{post.id}"})

    return JsonResponse({"error": "Method not allowed"}, status=405)


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
