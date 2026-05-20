from decimal import Decimal

from django.core.management.base import BaseCommand

from catalog.models import Category, Product


class Command(BaseCommand):
    help = "Create demo furniture hardware categories and products for local development."

    def handle(self, *args, **options):
        categories = [
            ("Мебельные ручки", "handles", "Ручки, кнопки и профили для фасадов"),
            ("Петли и механизмы", "hinges", "Петли, доводчики и подъемники"),
            ("Направляющие", "slides", "Шариковые и скрытые направляющие"),
            ("Опоры и ножки", "legs", "Опоры для шкафов, кухонь и столов"),
            ("Крепеж", "fasteners", "Конфирматы, стяжки, уголки и заглушки"),
        ]

        category_map = {}
        for index, (name, slug, description) in enumerate(categories):
            category, _ = Category.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": name,
                    "description": description,
                    "is_active": True,
                    "order": index,
                },
            )
            category_map[slug] = category

        products = [
            {
                "category": category_map["handles"],
                "name": "Ручка профильная Line 160 мм",
                "slug": "line-handle-160",
                "description": "Алюминиевая профильная ручка для кухонных фасадов и шкафов.",
                "price": Decimal("1450.00"),
                "is_featured": True,
            },
            {
                "category": category_map["hinges"],
                "name": "Петля с доводчиком SoftClose",
                "slug": "softclose-hinge",
                "description": "Петля 110 градусов с плавным закрыванием для корпусной мебели.",
                "price": Decimal("980.00"),
                "is_featured": True,
            },
            {
                "category": category_map["slides"],
                "name": "Направляющие полного выдвижения 450 мм",
                "slug": "full-extension-slide-450",
                "description": "Шариковые направляющие для ящиков с высокой нагрузкой.",
                "price": Decimal("2650.00"),
                "is_featured": True,
            },
            {
                "category": category_map["legs"],
                "name": "Опора регулируемая кухонная 100 мм",
                "slug": "kitchen-leg-100",
                "description": "Пластиковая регулируемая опора для кухонных модулей.",
                "price": Decimal("320.00"),
                "is_featured": False,
            },
            {
                "category": category_map["fasteners"],
                "name": "Комплект конфирматов 7x50",
                "slug": "confirmat-pack",
                "description": "Крепеж для сборки корпусной мебели, упаковка 100 шт.",
                "price": Decimal("1800.00"),
                "is_featured": False,
            },
        ]

        for product in products:
            Product.objects.update_or_create(slug=product["slug"], defaults=product)

        active_category_slugs = [slug for _, slug, _ in categories]
        active_product_slugs = [product["slug"] for product in products]
        Category.objects.exclude(slug__in=active_category_slugs).update(is_active=False)
        Product.objects.exclude(slug__in=active_product_slugs).update(is_active=False)

        self.stdout.write(self.style.SUCCESS("Demo hardware catalog created."))
