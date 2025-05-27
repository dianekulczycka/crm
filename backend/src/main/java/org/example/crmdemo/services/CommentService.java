package org.example.crmdemo.services;

import lombok.RequiredArgsConstructor;
import org.example.crmdemo.dto.comment.CommentDto;
import org.example.crmdemo.entities.Comment;
import org.example.crmdemo.entities.Manager;
import org.example.crmdemo.entities.Order;
import org.example.crmdemo.mappers.CommentMapper;
import org.example.crmdemo.repositories.CommentRepository;
import org.example.crmdemo.repositories.ManagerRepository;
import org.example.crmdemo.repositories.OrderRepository;
import org.example.crmdemo.utilities.JwtUtility;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final OrderRepository orderRepository;
    private final ManagerRepository managerRepository;
    private final JwtUtility jwtUtility;

    @Transactional
    public CommentDto addComment(Long orderId, String token, CommentDto dto) {
        String email = jwtUtility.extractUsername(token);

        Manager manager = managerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getManager() != null && !order.getManager().equals(manager.getSurname())) {
            throw new RuntimeException("You can only comment on your orders");
        }

        Comment comment = createComment(dto, order, manager);
        order.setManager(manager.getSurname());

        if (order.getStatus() == null) {
            order.setStatus("In Work");
        }

        orderRepository.save(order);

        return CommentMapper.toDto(comment);
    }

    private Comment createComment(CommentDto dto, Order order, Manager manager) {
        Comment comment = CommentMapper.toEntity(dto, order);
        comment.setAuthor(manager.getName() + " " + manager.getSurname());
        return commentRepository.save(comment);
    }

    public List<CommentDto> getComments(Long orderId) {
        return commentRepository.findByOrderId(orderId).stream()
                .map(CommentMapper::toDto)
                .toList();
    }
}