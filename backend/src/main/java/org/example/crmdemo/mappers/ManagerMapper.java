package org.example.crmdemo.mappers;

import org.example.crmdemo.dto.manager.ManagerDto;
import org.example.crmdemo.dto.order.StatDto;
import org.example.crmdemo.entities.Manager;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ManagerMapper {
    public ManagerDto toDto(Manager manager, List<StatDto> stats) {
        if (manager == null) {
            return null;
        }
        return ManagerDto.builder()
                .id(manager.getId())
                .email(manager.getEmail())
                .name(manager.getName())
                .surname(manager.getSurname())
                .isActive(manager.getIsActive())
                .lastLogin(manager.getLastLogIn() != null ? manager.getLastLogIn() : null)
                .isBanned(manager.getIsBanned())
                .stats(stats)
                .build();
    }
}
