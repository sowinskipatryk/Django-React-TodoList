from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.exceptions import ObjectDoesNotExist
from .serializers import GetTaskSerializer, PostTaskSerializer
from .models import Task


# View for handling new task creation and retrieving all tasks
@api_view(['GET', 'POST'])
def get_tasks_or_create_new(request):
    if request.method == 'POST':
        request.data['author_ip'] = request.META['REMOTE_ADDR']  # Add IP field
        serializer = PostTaskSerializer(data=request.data)
        if serializer.is_valid():  # Case when validation has passed
            serializer.save()  # Save the data to the database
            return Response(serializer.data)
        else:
            return Response(status=400)
    tasks = Task.objects.all()  # Get all Task objects
    serializer = GetTaskSerializer(tasks, many=True)  # Serialize the data
    return Response(serializer.data)


# View for handling task deletion and retrieving a single task with given ID
@api_view(['GET', 'DELETE'])
def get_single_task_or_delete(request, pk):
    try:
        task = Task.objects.get(id=pk)  # Get object with said ID or raise error
        if request.method == 'DELETE':
            task.delete()
            return Response('Task deleted successfully!')
        serializer = GetTaskSerializer(task)
        return Response(serializer.data)
    except ObjectDoesNotExist:  # Raise error if object doesn't exist
        return Response(
            'The task with given ID does not exist in the database!',
            status=404)
