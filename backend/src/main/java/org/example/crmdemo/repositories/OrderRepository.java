package org.example.crmdemo.repositories;

import org.example.crmdemo.entities.Manager;
import org.example.crmdemo.entities.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("""
        SELECT o FROM Order o
        LEFT JOIN o.group g
        WHERE (:name IS NULL OR o.name LIKE CONCAT('%', :name, '%'))
          AND (:surname IS NULL OR o.surname LIKE CONCAT('%', :surname, '%'))
          AND (:email IS NULL OR o.email LIKE CONCAT('%', :email, '%'))
          AND (:phone IS NULL OR o.phone LIKE CONCAT('%', :phone, '%'))
          AND (
                :status IS NULL
                OR LOWER(CAST(o.status AS string)) = LOWER(:status)
                OR (:status = 'new' AND o.status IS NULL)
              )
          AND (:course IS NULL OR LOWER(o.course) = LOWER(:course))
          AND (:courseFormat IS NULL OR LOWER(o.courseFormat) = LOWER(:courseFormat))
          AND (:courseType IS NULL OR LOWER(o.courseType) = LOWER(:courseType))
          AND (:groupName IS NULL OR g.name LIKE CONCAT('%', :groupName, '%'))
          AND (:startDate IS NULL OR o.createdAt >= :startDate)
          AND (:endDate IS NULL OR o.createdAt <= :endDate)
          AND (:manager IS NULL OR o.manager = :manager)
    """)
    Page<Order> findOrdersFiltered(
            @Param("name") String name,
            @Param("surname") String surname,
            @Param("email") String email,
            @Param("phone") String phone,
            @Param("status") String status,
            @Param("course") String course,
            @Param("courseFormat") String courseFormat,
            @Param("courseType") String courseType,
            @Param("groupName") String groupName,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("manager") Manager manager,
            Pageable pageable
    );
    @Query("""
        SELECT o FROM Order o
        LEFT JOIN o.group g
        WHERE (:name IS NULL OR o.name LIKE CONCAT('%', :name, '%'))
          AND (:surname IS NULL OR o.surname LIKE CONCAT('%', :surname, '%'))
          AND (:email IS NULL OR o.email LIKE CONCAT('%', :email, '%'))
          AND (:phone IS NULL OR o.phone LIKE CONCAT('%', :phone, '%'))
          AND (
                :status IS NULL
                OR LOWER(CAST(o.status AS string)) = LOWER(:status)
                OR (:status = 'new' AND o.status IS NULL)
              )
          AND (:course IS NULL OR LOWER(o.course) = LOWER(:course))
          AND (:courseFormat IS NULL OR LOWER(o.courseFormat) = LOWER(:courseFormat))
          AND (:courseType IS NULL OR LOWER(o.courseType) = LOWER(:courseType))
          AND (:groupName IS NULL OR g.name LIKE CONCAT('%', :groupName, '%'))
          AND (:startDate IS NULL OR o.createdAt >= :startDate)
          AND (:endDate IS NULL OR o.createdAt <= :endDate)
          AND (:manager IS NULL OR o.manager = :manager)
    """)
    List<Order> findOrdersFiltered(
            @Param("name") String name,
            @Param("surname") String surname,
            @Param("email") String email,
            @Param("phone") String phone,
            @Param("status") String status,
            @Param("course") String course,
            @Param("courseFormat") String courseFormat,
            @Param("courseType") String courseType,
            @Param("groupName") String groupName,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("manager") Manager manager,
            Sort sort
    );
    List<Order> findAllByManager(Manager manager);
}


