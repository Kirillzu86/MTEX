from decimal import Decimal

from django.core.management.base import BaseCommand

from catalog.models import Category, Product


class Command(BaseCommand):
    help = "Create demo categories and products for local development."

    def handle(self, *args, **options):
        categories = [
            ("Кухни", "kitchens", "Кухонные гарнитуры на заказ"),
            ("Шкафы", "wardrobes", "Шкафы-купе и гардеробные"),
            ("Гостиные", "living-rooms", "ТВ-зоны и системы хранения"),
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
                "category": category_map["kitchens"],
                "name": "Кухня City Line",
                "slug": "city-line",
                "description": "Современная кухня с матовыми фасадами, встроенной техникой и продуманным хранением.",
                "price": Decimal("590000.00"),
                "is_featured": True,
            },
            {
                "category": category_map["wardrobes"],
                "name": "Шкаф Alto",
                "slug": "alto",
                "description": "Встроенный шкаф с раздвижными дверями, подсветкой и индивидуальным наполнением.",
                "price": Decimal("320000.00"),
                "is_featured": True,
            },
            {
                "category": category_map["living-rooms"],
                "name": "Гостиная Forma",
                "slug": "forma",
                "description": "Лаконичная мебельная композиция для гостиной с закрытыми и открытыми секциями.",
                "price": Decimal("410000.00"),
                "is_featured": False,
            },
        ]

        for product in products:
            Product.objects.update_or_create(slug=product["slug"], defaults=product)

        self.stdout.write(self.style.SUCCESS("Demo catalog created."))
