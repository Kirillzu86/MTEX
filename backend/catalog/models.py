from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)
    updated_at = models.DateTimeField("Дата обновления", auto_now=True)

    class Meta:
        abstract = True


class Category(TimeStampedModel):
    name = models.CharField("Название", max_length=160)
    slug = models.SlugField("URL", max_length=180, unique=True)
    description = models.TextField("Описание", blank=True)
    is_active = models.BooleanField("Активна", default=True)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self) -> str:
        return self.name


class Product(TimeStampedModel):
    category = models.ForeignKey(
        Category,
        verbose_name="Категория",
        related_name="products",
        on_delete=models.PROTECT,
    )
    name = models.CharField("Название", max_length=220)
    slug = models.SlugField("URL", max_length=240, unique=True)
    description = models.TextField("Описание", blank=True)
    price = models.DecimalField("Цена", max_digits=12, decimal_places=2)
    is_active = models.BooleanField("Показывать на сайте", default=True)
    is_featured = models.BooleanField("Показывать на главной", default=False)

    class Meta:
        ordering = ["-is_featured", "name"]
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

    def __str__(self) -> str:
        return self.name


class ProductImage(TimeStampedModel):
    product = models.ForeignKey(
        Product,
        verbose_name="Товар",
        related_name="images",
        on_delete=models.CASCADE,
    )
    image = models.ImageField("Фотография", upload_to="products/")
    alt_text = models.CharField("Описание изображения", max_length=180, blank=True)
    order = models.PositiveIntegerField("Порядок", default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Фотография товара"
        verbose_name_plural = "Фотографии товаров"

    def __str__(self) -> str:
        return f"{self.product.name} #{self.pk}"


class CustomerRequest(TimeStampedModel):
    product = models.ForeignKey(
        Product,
        verbose_name="Товар",
        related_name="requests",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    name = models.CharField("Имя", max_length=140)
    phone = models.CharField("Телефон", max_length=40)
    comment = models.TextField("Комментарий", blank=True)
    is_processed = models.BooleanField("Обработана", default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Заявка клиента"
        verbose_name_plural = "Заявки клиентов"

    def __str__(self) -> str:
        return f"{self.name} - {self.phone}"
