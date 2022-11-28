from django.db import models


class Task(models.Model):
    """
    A model designed to represent tasks to be performed.
    The title field is mandatory and created_date field is auto filled.
    Done field is set to False as default.
    Author IP field and done_date fields are allowed to be empty.
    """
    title = models.CharField(max_length=256)
    done = models.BooleanField(default=False)
    author_ip = models.CharField(max_length=256, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    done_date = models.DateTimeField(blank=True, null=True)
