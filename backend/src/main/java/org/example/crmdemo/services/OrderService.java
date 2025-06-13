package org.example.crmdemo.services;

import com.alibaba.excel.EasyExcel;
import lombok.RequiredArgsConstructor;
import org.example.crmdemo.dto.order.ExportRequestDto;
import org.example.crmdemo.dto.order.OrderDto;
import org.example.crmdemo.dto.order.StatDto;
import org.example.crmdemo.dto.pagination.FilterDto;
import org.example.crmdemo.dto.pagination.PaginationResponseDto;
import org.example.crmdemo.dto.pagination.SortDto;
import org.example.crmdemo.entities.Group;
import org.example.crmdemo.entities.Manager;
import org.example.crmdemo.entities.Order;
import org.example.crmdemo.mappers.OrderMapper;
import org.example.crmdemo.repositories.ManagerRepository;
import org.example.crmdemo.repositories.OrderRepository;
import org.example.crmdemo.utilities.JwtUtility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ManagerRepository managerRepository;
    private final JwtUtility jwtUtility;
    private final GroupService groupService;
    private final OrderMapper orderMapper;

    public PaginationResponseDto<OrderDto> getOrders(SortDto sortDto) {
        Pageable pageable = createPageable(sortDto.getPage(), sortDto.getOrder(), sortDto.getDirection());
        Page<Order> ordersPage = orderRepository.findAll(pageable);
        return retrieveOrdersFromRepo(pageable, ordersPage);
    }

    public List<StatDto> getOrderStats() {
        List<Order> orders = orderRepository.findAll();

        return orders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getStatus() == null ? "Not assigned" : order.getStatus(),
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .map(entry -> new StatDto(entry.getKey(), entry.getValue()))
                .toList();
    }

    public PaginationResponseDto<OrderDto> getOrdersWithFilters(FilterDto filterDto,
                                                                SortDto sortDto,
                                                                String token) {
        Pageable pageable = createPageable(sortDto.getPage(), sortDto.getOrder(), sortDto.getDirection());
        Manager manager = null;
        if (Boolean.TRUE.equals(filterDto.getIsAssignedToMe())) {
            manager = getManagerFromToken(token);
        }

        Page<Order> ordersPage = orderRepository.findOrdersFiltered(
                filterDto.getName(),
                filterDto.getSurname(),
                filterDto.getEmail(),
                filterDto.getPhone(),
                filterDto.getStatus(),
                filterDto.getCourse(),
                filterDto.getCourseFormat(),
                filterDto.getCourseType(),
                filterDto.getGroupName(),
                filterDto.getStartDate() != null ? filterDto.getStartDate().atStartOfDay() : null,
                filterDto.getEndDate() != null ? filterDto.getEndDate().atStartOfDay() : null,
                manager,
                pageable
        );
        return retrieveOrdersFromRepo(pageable, ordersPage);
    }

    private PaginationResponseDto<OrderDto> retrieveOrdersFromRepo(Pageable pageable,
                                                                   Page<Order> ordersPage) {
        List<OrderDto> orderDtos = ordersPage
                .getContent()
                .stream()
                .map(OrderMapper::toDto)
                .toList();

        Integer nextPage = ordersPage.hasNext() ? pageable.getPageNumber() + 1 : null;
        Integer prevPage = ordersPage.hasPrevious() ? pageable.getPageNumber() - 1 : null;

        return new PaginationResponseDto<>(
                ordersPage.getTotalElements(),
                pageable.getPageSize(),
                nextPage,
                prevPage,
                orderDtos
        );
    }

    public Pageable createPageable(Integer page, String order, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(order).ascending()
                : Sort.by(order).descending();
        return PageRequest.of(page - 1, 25, sort);
    }

    @Transactional
    public void updateOrder(Long orderId, OrderDto orderDto, String token) {
        Manager manager = getManagerFromToken(token);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getManager() != null && !order.getManager().equals(manager)) {
            throw new RuntimeException("You can only update your orders");
        }

        orderMapper.updateEntity(order, orderDto);

        if (orderDto.getGroupName() != null) {
            Group group = groupService.getOrCreateGroup(orderDto.getGroupName().toUpperCase());
            order.setGroup(group);
        }

        if (order.getStatus() == null) {
            order.setStatus("In Work");
        }

        if ("New".equalsIgnoreCase(order.getStatus())) {
            order.setManager(null);
        } else {
            order.setManager(manager);
        }

        orderRepository.save(order);
    }

    public byte[] exportToExcel(ExportRequestDto exportRequestDto, String token) {
        Manager manager = null;
        if (Boolean.TRUE.equals(exportRequestDto.getIsAssignedToMe())) {
            manager = getManagerFromToken(token);
        }

        Sort sort = Sort.by(
                Sort.Direction.fromString(
                        Optional.ofNullable(exportRequestDto.getDirection()).orElse("desc").toUpperCase()
                ),
                Optional.ofNullable(exportRequestDto.getOrder()).orElse("id")
        );

        List<Order> orders = orderRepository.findOrdersFiltered(
                exportRequestDto.getName(),
                exportRequestDto.getSurname(),
                exportRequestDto.getEmail(),
                exportRequestDto.getPhone(),
                exportRequestDto.getStatus(),
                exportRequestDto.getCourse(),
                exportRequestDto.getCourseFormat(),
                exportRequestDto.getCourseType(),
                exportRequestDto.getGroupName(),
                exportRequestDto.getStartDate() != null ? exportRequestDto.getStartDate().atStartOfDay() : null,
                exportRequestDto.getEndDate() != null ? exportRequestDto.getEndDate().atStartOfDay() : null,
                manager,
                sort
        );

        List<OrderDto> orderDtos = orders.stream()
                .map(OrderMapper::toDto)
                .toList();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        EasyExcel.write(outputStream, OrderDto.class)
                .sheet("orders " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yy")))
                .doWrite(orderDtos);

        return outputStream.toByteArray();
    }

    public Manager getManagerFromToken(String token) {
        String email = jwtUtility.extractUsername(token);
        return managerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Manager not found"));
    }
}