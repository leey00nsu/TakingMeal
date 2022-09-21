package com.example.demo.dto;

import com.example.demo.entity.Location;
import com.example.demo.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentDTO {

    private User user;
    private Location location;
    private String commentMessage;
    private String writer;

    @Builder
    public CommentDTO(User user, Location location, String commentMessage, String writer) {
        this.user = user;
        this.location = location;
        this.commentMessage = commentMessage;
        this.writer = writer;
    }
}
