from rest_framework.test import APITestCase
from rest_framework import status
from .models import Task
from datetime import datetime


class ToDoListTestCase(APITestCase):
    def setUp(self) -> None:
        Task.objects.get_or_create(title='Test the app')
        Task.objects.get_or_create(title='Read the article', done=True,
                                   done_date=datetime.now())

    # Test if get request for all tasks listed responds with status code 200
    def test_get_tasks(self):
        url = '/todolist'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Task.objects.filter(title='Test the app').exists())

    # Test if post request for the task with given data responds with status
    # code 200, the object exists in the database and if the author_ip and
    # done_date attributes were autofilled
    def test_create_task(self):
        url = '/todolist'
        data = {"title": "Wash the dishes", "done": "True"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Task.objects.filter(title=data['title']).exists())
        self.assertTrue(Task.objects.filter(done=data['done']).exists())
        self.assertNotEqual(Task.objects.get(title=data['title']).done_date,
                            None)
        self.assertNotEqual(Task.objects.get(title=data['title']).author_ip,
                            None)

    # Test if post request responds with status code 400 for task with given
    # done_date but done attribute set to False (task not done)
    def test_create_task_invalid_data(self):
        url = '/todolist'
        data = {"title": "Wash the dishes", "done": "False",
                "done_date": "2022-11-27T23:18:05.056576Z"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test if delete request responds with status code 200 for existing task ID
    # and if the instance of the task was deleted (does not exist anymore)
    def test_delete_existing_task(self):
        url = '/todolist/1/'
        task = Task.objects.get(id=1)
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Task.objects.filter(title=task.title).exists())

    # Test if delete request responds with status code 404 for non existing task ID
    def test_delete_non_existing_task(self):
        url = '/todolist/12/'
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Test if get request responds with status code 200 for existing task ID
    def test_get_single_task(self):
        url = '/todolist/1/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Test if get request responds with status code 404 for non existing task ID
    def test_get_single_non_existing_task(self):
        url = '/todolist/12/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
