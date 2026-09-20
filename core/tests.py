import json

from django.test import Client, TestCase
from django.urls import reverse

from .models import Company, EnterpriseContact, JobPost


class EnterpriseFlowTests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        self.client.get(reverse("core:home"))
        self.csrf = self.client.cookies["csrftoken"].value

    def post_json(self, url, data):
        return self.client.post(
            url,
            data=json.dumps(data),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrf,
        )

    def test_register_company_then_hr_and_create_post(self):
        registration = {
            "company_name": "บริษัท ทดสอบ จำกัด",
            "registration_number": "0105560000000",
            "business_type": "ซอฟต์แวร์",
            "company_address": "อุบลราชธานี",
            "company_phone": "045-000-000",
            "company_email": "contact@example.com",
            "full_name": "สมหญิง ฝ่ายบุคคล",
            "position": "HR Officer",
            "department": "ฝ่ายบุคคล",
            "hr_phone": "080-000-0000",
            "hr_email": "hr@example.com",
            "password": "password123",
            "confirm_password": "password123",
        }
        response = self.post_json(reverse("core:enterprise_register"), registration)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Company.objects.count(), 1)
        self.assertEqual(EnterpriseContact.objects.count(), 1)
        self.assertNotEqual(EnterpriseContact.objects.get().password, "password123")

        post = {
            "title": "Data Analyst Intern", "openings": 2, "department": "Data",
            "skills": ["Python", "SQL"], "description": "วิเคราะห์ข้อมูล",
            "salary": "8,000 บาท", "location": "อุบลราชธานี",
            "work_hours": "จ.-ศ. 09:00-17:00", "requirements": "นักศึกษาชั้นปีที่ 4",
            "benefits": "มีพี่เลี้ยง",
        }
        response = self.post_json(reverse("core:enterprise_posts"), post)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(JobPost.objects.count(), 1)

        response = self.client.get(reverse("core:enterprise_posts"))
        self.assertEqual(response.json()["posts"][0]["title"], "Data Analyst Intern")

    def test_update_and_delete_post_for_enterprise(self):
        registration = {
            "company_name": "บริษัท ทดสอบ จำกัด",
            "registration_number": "0105560000001",
            "business_type": "ซอฟต์แวร์",
            "company_address": "อุบลราชธานี",
            "company_phone": "045-000-001",
            "company_email": "contact2@example.com",
            "full_name": "สมหญิง ฝ่ายบุคคล",
            "position": "HR Officer",
            "department": "ฝ่ายบุคคล",
            "hr_phone": "080-000-0001",
            "hr_email": "hr2@example.com",
            "password": "password123",
            "confirm_password": "password123",
        }
        self.post_json(reverse("core:enterprise_register"), registration)

        post = {
            "title": "Frontend Intern",
            "openings": 2,
            "department": "Engineering",
            "skills": ["React", "JavaScript"],
            "description": "พัฒนาฟีเจอร์เว็บ",
            "salary": "15,000 บาท",
            "location": "กรุงเทพฯ",
            "work_hours": "09:00-18:00",
            "requirements": "สามารถใช้ React ได้",
            "benefits": "โบนัส",
        }
        create_response = self.post_json(reverse("core:enterprise_posts"), post)
        post_id = create_response.json()["post"]["id"]

        update_payload = {
            "title": "Frontend Developer Intern",
            "openings": 3,
            "department": "Product Engineering",
            "skills": ["React", "TypeScript"],
            "description": "พัฒนาฟีเจอร์เว็บและระบบ",
            "salary": "18,000 บาท",
            "location": "กรุงเทพฯ (Hybrid)",
            "work_hours": "09:00-18:00",
            "requirements": "สามารถใช้ React และ TypeScript ได้",
            "benefits": "โบนัส + WFH",
        }
        response = self.client.put(
            f"/api/enterprise/posts/{post_id}/",
            data=json.dumps(update_payload),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrf,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["post"]["title"], "Frontend Developer Intern")
        self.assertEqual(JobPost.objects.get(pk=int(post_id.replace("db-", ""))).openings, 3)

        delete_response = self.client.delete(
            f"/api/enterprise/posts/{post_id}/",
            content_type="application/json",
            HTTP_X_CSRFTOKEN=self.csrf,
        )
        self.assertEqual(delete_response.status_code, 200)
        self.assertEqual(JobPost.objects.filter(pk=int(post_id.replace("db-", ""))).count(), 0)
