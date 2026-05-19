from django.contrib import admin

from .models import Category, CustomerRequest, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "order", "updated_at")
    list_editable = ("is_active", "order")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "is_active", "is_featured", "updated_at")
    list_filter = ("category", "is_active", "is_featured")
    list_editable = ("price", "is_active", "is_featured")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "description")
    inlines = [ProductImageInline]


@admin.register(CustomerRequest)
class CustomerRequestAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "product", "is_processed", "created_at")
    list_filter = ("is_processed", "created_at")
    list_editable = ("is_processed",)
    search_fields = ("name", "phone", "comment")
    readonly_fields = ("created_at", "updated_at")
