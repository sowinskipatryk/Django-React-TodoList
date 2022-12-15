from django.urls import path
from . import views

# Added paths to created views
urlpatterns = [
    path('todolist/', views.get_tasks_or_create_new,
         name='get_tasks_or_create_new'),
    path('todolist/<int:pk>/', views.get_single_task_or_delete,
         name='get_single_task_or_delete'),
    path('', views.index, name='index')
]
