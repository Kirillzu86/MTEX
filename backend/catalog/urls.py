from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminCategoryViewSet,
    AdminCustomerRequestViewSet,
    AdminLoginView,
    AdminProductViewSet,
    CategoryViewSet,
    CustomerRequestCreateView,
    ProductViewSet,
)


router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("products", ProductViewSet, basename="product")

admin_router = DefaultRouter()
admin_router.register("categories", AdminCategoryViewSet, basename="admin-category")
admin_router.register("products", AdminProductViewSet, basename="admin-product")
admin_router.register("requests", AdminCustomerRequestViewSet, basename="admin-request")

urlpatterns = [
    path("", include(router.urls)),
    path("requests/", CustomerRequestCreateView.as_view(), name="customer-request-create"),
    path("admin/login/", AdminLoginView.as_view(), name="admin-login"),
    path("admin/", include(admin_router.urls)),
]
