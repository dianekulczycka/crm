package org.example.crmdemo.controllers;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.crmdemo.dto.order.ExportRequestDto;
import org.example.crmdemo.dto.order.OrderDto;
import org.example.crmdemo.dto.order.OrderRequestDto;
import org.example.crmdemo.dto.order.StatDto;
import org.example.crmdemo.dto.pagination.FilterDto;
import org.example.crmdemo.dto.pagination.PaginationResponseDto;
import org.example.crmdemo.dto.pagination.SortDto;
import org.example.crmdemo.mappers.OrderMapper;
import org.example.crmdemo.services.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/api/orders")
@AllArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final OrderMapper orderMapper;

    @GetMapping("/")
    public ResponseEntity<PaginationResponseDto<OrderDto>> getOrders(
            @Valid SortDto sortDto,
            @Valid FilterDto filterDto,
            @RequestParam(value = "isAssignedToMe", defaultValue = "false") boolean isAssignedToMe,
            @RequestHeader("Authorization") String token) {
        filterDto.setIsAssignedToMe(isAssignedToMe);
        if (filterDto.isEmpty()) {
            PaginationResponseDto<OrderDto> response = orderService.getOrders(sortDto);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            PaginationResponseDto<OrderDto> response = orderService
                    .getOrdersWithFilters(filterDto, sortDto, token.replace("Bearer ", ""));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<List<StatDto>> getOrderStats() {
        return new ResponseEntity<>(orderService.getOrderStats(), HttpStatus.OK);
    }

    @PatchMapping("/order/{id}")
    public ResponseEntity<Void> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody OrderRequestDto orderRequestDto,
            @RequestHeader("Authorization") String token) {
        OrderDto orderDto = orderMapper.mapToOrderDto(orderRequestDto);
        orderService.updateOrder(id, orderDto, token.replace("Bearer ", ""));
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @PostMapping("/excel")
    public ResponseEntity<byte[]> exportOrdersToExcel(
            @Valid @RequestBody ExportRequestDto dto,
            @RequestHeader("Authorization") String token) {
        byte[] excelFile = orderService.exportToExcel(dto, token.replace("Bearer ", ""));
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=orders.xlsx")
                .body(excelFile);
    }
}
