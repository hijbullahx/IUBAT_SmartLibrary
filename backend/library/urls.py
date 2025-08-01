from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, LibraryEntryViewSet, ELibraryPCViewSet, ELibraryUsageViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'entries', LibraryEntryViewSet)
router.register(r'pcs', ELibraryPCViewSet)
router.register(r'usage', ELibraryUsageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
