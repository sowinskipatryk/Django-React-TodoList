from rest_framework import serializers
from .models import Task
from django.utils import timezone


class GetTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task  # Link to model
        fields = '__all__'  # Serialize all fields


class PostTaskSerializer(serializers.ModelSerializer):
    def validate(self, data):  # Override validate method to add custom checks
        # Raise error if task is not marked as done but has a date of completion
        if not data.get('done') and data.get('done_date'):
            raise serializers.ValidationError()

        # Set date of completion as current time if task is done but has no date
        elif data.get('done') and not data.get('done_date'):
            data['done_date'] = timezone.now()  # Add done date if task is ended
        super().validate(data)  # Perform default validation
        return data

    class Meta:
        model = Task
        fields = ('title', 'done', 'done_date', 'author_ip')  # Limit fields
