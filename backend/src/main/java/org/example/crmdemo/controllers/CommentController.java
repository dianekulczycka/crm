package org.example.crmdemo.controllers;

import lombok.RequiredArgsConstructor;
import org.example.crmdemo.dto.comment.CommentDto;
import org.example.crmdemo.services.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/api/orders/{orderId}/comments")
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long orderId) {
        return new ResponseEntity<>(commentService.getComments(orderId), HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String token,
            @RequestBody CommentDto commentDto) {
        return new ResponseEntity<>(
                commentService.addComment(orderId, token.replace("Bearer ", ""), commentDto),
                HttpStatus.ACCEPTED
        );
    }
}
