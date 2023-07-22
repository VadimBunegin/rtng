"""simple_votings URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include

from main import views
from simple_votings import settings

urlpatterns = [
    path('admin/', admin.site.urls),

    path('login/', auth_views.LoginView.as_view(extra_context={
        'menu': views.get_menu_context(),
        'pagename': 'Авторизация'}),
         name='login'),
    path('group/add/', views.category_add_page, name='add_category'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('', views.index_page, name='index'),
    path('product/add/', views.product_add_page, name='add_product'),
    path('product/add/<int:cat_id>/', views.goods_create_form, name='goods_create_form'),
    path('product/delete/<int:product_id>', views.product_delete, name='product_delete'),
    path('category/delete/<int:product_id>', views.category_delete, name='category_delete'),
    path('category/edit/', views.category_edit_page, name='category_edit'),
    path('chat/', views.chat_room, name='chat_room'),
    path('chat/send/', views.send_message, name='send_message'),




    path('catalog/', views.catalog_page, name='catalog'),
    path('search/', views.search_results_page, name='search_results'),
    path('catalog/<int:product_id>/', views.product_page, name='product_page'),
    path('catalog/<int:product_id>/edit/', views.product_edit_page, name='product_edit_page'),


    path('_search/', views.search_product, name="search"),

    # ajax for product_edit_page
    path('_remove_image/', views.product_remove_image, name='remove_image'),
    path('_add_image/', views.product_add_image, name='product_add_image'),
    path('review_add/', views.review_add, name='review_add'),

    # ajax for review_add
    path('_review_add/', views.review_selector_change, name='review_selector_change'),

    path('catalog_reviews/', views.catalog_reviews, name='catalog_reviews'),

    path('__debug__/', include('debug_toolbar.urls')),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
