package com.example.demo.entity;

import com.example.demo.dto.CommentDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Setter
@ToString
@RequiredArgsConstructor
@Getter
@Table(name = "Comment")
public class Comment {

    @Id @GeneratedValue
    @Column(name = "cId")
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uId")
    @ToString.Exclude
    private User user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lId")
    @ToString.Exclude
    private Location location;

    @Column(name = "commentMessage")
    private String commentMessage;

    @Column(name = "commentTime")
    @CreationTimestamp
    private LocalDateTime commentTime;

    @Column(name = "writer")
    private String writer;

    public Comment(CommentDTO commentDTO) {
        this.user = commentDTO.getUser();
        this.location = commentDTO.getLocation();
        this.commentMessage = commentDTO.getCommentMessage();
        this.commentTime = LocalDateTime.now();
        this.writer = commentDTO.getWriter();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Comment comment = (Comment) o;
        return id != null && Objects.equals(id, comment.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
