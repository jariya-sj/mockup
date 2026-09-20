from django.contrib import admin

from .models import Company, EnterpriseContact, JobPost

admin.site.register(Company)
admin.site.register(EnterpriseContact)
admin.site.register(JobPost)
