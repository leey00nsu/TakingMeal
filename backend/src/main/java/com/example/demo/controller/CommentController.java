package com.example.demo.controller;

import com.example.demo.entity.Comment;
import com.example.demo.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{storeId}/comments")
    public List<Comment> getLocationComments(@PathVariable Long storeId) throws Exception {
        return commentService.load(storeId);
    }

    @PostMapping("/{storeId}/comments/{userId}")
    public List<Comment> addLocationComment(
            @PathVariable Long storeId,
            @PathVariable String userId,
            @RequestBody Map<String, String> map) throws Exception {


        return commentService.add(storeId, userId, map);
    }

}
