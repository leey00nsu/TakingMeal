package com.example.demo.service;

import com.example.demo.dto.CommentDTO;
import com.example.demo.entity.Comment;
import com.example.demo.entity.Location;
import com.example.demo.entity.User;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.LocationRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CommentService {

    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public List<Comment> load(Long storeId) throws Exception {
        Optional<Location> optional = locationRepository.findById(storeId);

        Location location;

        if (optional.isPresent()) location = optional.get();
        else throw new Exception();



        return commentRepository.findByLocationOrderByCommentTimeDesc(location);
    }
    @Transactional
    public List<Comment> add(Long storeId, String userId,
                             Map<String, String> map) throws Exception {

        Optional<Location> optional = locationRepository.findById(storeId);
        User user = userRepository.findByUserId(userId);
        String commentMessage = map.get("content");

        Location location;

        if (optional.isPresent()) location = optional.get();
        else throw new Exception();

        try {
            CommentDTO commentDTO = CommentDTO.builder()
                    .user(user)
                    .location(location)
                    .commentMessage(commentMessage)
                    .writer(userId)
                    .build();

            Comment comment = new Comment(commentDTO);
            commentRepository.save(comment);
        }catch (Exception ignored){
        }

        return commentRepository.findByLocationOrderByCommentTimeDesc(location);
    }
}
