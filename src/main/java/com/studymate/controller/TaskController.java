package com.studymate.controller;

import com.studymate.model.Task;
import com.studymate.model.User;
import com.studymate.repository.UserRepository;
import com.studymate.service.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    public TaskController(
            TaskService taskService,
            UserRepository userRepository
    ) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Task> getAllTasks(
            @RequestParam String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return List.of();
        }

        return taskService.getTasksByUser(user);
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @PostMapping
    public Task createTask(
            @RequestParam String email,
            @RequestBody Task task
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return null;
        }

        return taskService.createTask(task, user);
    }

    @PutMapping("/{id}")
    public Task updateTask(
            @PathVariable Long id,
            @RequestBody Task task
    ) {
        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}