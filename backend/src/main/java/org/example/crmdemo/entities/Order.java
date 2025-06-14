package org.example.crmdemo.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@DynamicUpdate

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String phone;
    private Integer age;
    private String course;
    @Column(name = "course_format")
    private String courseFormat;
    @Column(name = "course_type")
    private String courseType;
    private Integer sum;
    @Column(name = "alreadyPaid")
    private Integer alreadyPaid;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    private String utm;
    private String msg;
    private String status;
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "manager_id")
    private Manager manager;
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "group_id")
    private Group group;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
}
