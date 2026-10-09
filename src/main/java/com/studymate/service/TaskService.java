package com.studymate.service;

import com.studymate.model.Task;
import com.studymate.model.User;
import com.studymate.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByUser(user);
    }

    public Task getTaskById(Long id) {
        Optional<Task> task = taskRepository.findById(id);
        return task.orElse(null);
    }

    public Task createTask(Task task, User user) {
        task.setUser(user);
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task updatedTask) {

        Optional<Task> existingTask =
                taskRepository.findById(id);

        if (existingTask.isPresent()) {

            Task task = existingTask.get();

            task.setName(updatedTask.getName());
            task.setPriority(updatedTask.getPriority());
            task.setDeadline(updatedTask.getDeadline());
            task.setCompleted(updatedTask.isCompleted());

            return taskRepository.save(task);
        }

        return null;
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}