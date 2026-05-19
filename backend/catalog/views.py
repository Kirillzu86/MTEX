from django.contrib.auth import authenticate
from rest_framework import filters, generics, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, CustomerRequest, Product
from .serializers import (
    AdminCategorySerializer,
    AdminCustomerRequestSerializer,
    AdminProductSerializer,
    CategorySerializer,
    CustomerRequestSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = "slug"


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductListSerializer
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "description", "category__name"]

    def get_queryset(self):
        queryset = (
            Product.objects.filter(is_active=True, category__is_active=True)
            .select_related("category")
            .prefetch_related("images")
        )
        category = self.request.query_params.get("category")
        featured = self.request.query_params.get("featured")

        if category:
            queryset = queryset.filter(category__slug=category)
        if featured in {"1", "true", "True"}:
            queryset = queryset.filter(is_featured=True)

        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer


class CustomerRequestCreateView(generics.CreateAPIView):
    queryset = CustomerRequest.objects.all()
    serializer_class = CustomerRequestSerializer


class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)

        if not user or not user.is_staff:
            return Response({"detail": "Неверный логин или пароль."}, status=status.HTTP_400_BAD_REQUEST)

        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            }
        )


class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = AdminCategorySerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = "id"
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "description"]


class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("category").prefetch_related("images")
    serializer_class = AdminProductSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = "id"
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "description", "category__name"]


class AdminCustomerRequestViewSet(viewsets.ModelViewSet):
    queryset = CustomerRequest.objects.select_related("product", "product__category").prefetch_related("product__images")
    serializer_class = AdminCustomerRequestSerializer
    permission_classes = [permissions.IsAdminUser]
    http_method_names = ["get", "patch", "delete", "head", "options"]
