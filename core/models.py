from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=13, unique=True)
    business_type = models.CharField(max_length=255)
    address = models.TextField()
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class EnterpriseContact(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="contacts")
    full_name = models.CharField(max_length=255)
    position = models.CharField(max_length=150)
    department = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.company.name})"


class JobPost(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="job_posts")
    title = models.CharField(max_length=255)
    openings = models.PositiveIntegerField(default=1)
    department = models.CharField(max_length=150)
    skills = models.JSONField(default=list)
    description = models.TextField()
    salary = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=255)
    work_hours = models.CharField(max_length=150)
    requirements = models.TextField()
    benefits = models.TextField(blank=True)
    status = models.CharField(max_length=20, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
