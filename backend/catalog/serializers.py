from rest_framework import serializers

from .models import Category, CustomerRequest, Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_text")


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "slug", "description")


class AdminCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "slug", "description", "is_active", "order", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "price",
            "is_featured",
            "category",
            "images",
        )


class ProductDetailSerializer(ProductListSerializer):
    pass


class AdminProductSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source="category", read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "price",
            "is_active",
            "is_featured",
            "category",
            "category_detail",
            "images",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "category_detail", "images", "created_at", "updated_at")


class CustomerRequestSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        source="product",
        queryset=Product.objects.filter(is_active=True, category__is_active=True),
        required=False,
        allow_null=True,
        write_only=True,
    )
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = CustomerRequest
        fields = ("id", "name", "phone", "comment", "product_id", "product", "created_at")
        read_only_fields = ("id", "product", "created_at")


class AdminCustomerRequestSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = CustomerRequest
        fields = ("id", "name", "phone", "comment", "product", "is_processed", "created_at", "updated_at")
        read_only_fields = ("id", "name", "phone", "comment", "product", "created_at", "updated_at")
