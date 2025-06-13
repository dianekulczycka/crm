package org.example.crmdemo.dto.manager;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.crmdemo.dto.order.StatDto;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ManagerDto {
    private Integer id;
    private String email;
    private String name;
    private String surname;
    private Boolean isActive;
    private LocalDateTime lastLogin;
    private Boolean isBanned;
    private String role;
    private List<StatDto> stats;
}
