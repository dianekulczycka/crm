package org.example.crmdemo.services;

import lombok.RequiredArgsConstructor;
import org.example.crmdemo.dto.manager.CreateManagerRequestDto;
import org.example.crmdemo.dto.manager.ManagerDto;
import org.example.crmdemo.dto.order.StatDto;
import org.example.crmdemo.dto.pagination.PaginationResponseDto;
import org.example.crmdemo.entities.Manager;
import org.example.crmdemo.enums.Role;
import org.example.crmdemo.mappers.ManagerMapper;
import org.example.crmdemo.repositories.ManagerRepository;
import org.example.crmdemo.repositories.OrderRepository;
import org.example.crmdemo.utilities.JwtUtility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManagerService implements UserDetailsService {
    private final ManagerRepository managerRepository;
    private final ManagerMapper managerMapper;
    private final JwtUtility jwtUtility;
    private final OrderRepository orderRepository;

    public PaginationResponseDto<ManagerDto> getManagers(Integer page) {
        Pageable pageable = PageRequest.of(
                page - 1,
                3,
                Sort.by("id")
                        .descending());
        Page<Manager> managersPage = managerRepository.findAll(pageable);

        List<ManagerDto> managerDtos = managersPage.getContent()
                .stream()
                .map(manager -> {
                    List<StatDto> stats = orderRepository.findAllByManager(manager.getSurname())
                            .stream()
                            .collect(Collectors.groupingBy(
                                    order -> order.getStatus() == null ? "Not assigned" : order.getStatus(),
                                    Collectors.counting()
                            ))
                            .entrySet()
                            .stream()
                            .map(entry -> new StatDto(entry.getKey(), entry.getValue()))
                            .toList();
                    return managerMapper.toDto(manager, stats);
                })
                .toList();

        Integer nextPage = managersPage.hasNext() ? page + 1 : null;
        Integer prevPage = managersPage.hasPrevious() ? page - 1 : null;

        return new PaginationResponseDto<>(
                managersPage.getTotalElements(),
                pageable.getPageSize(),
                nextPage,
                prevPage,
                managerDtos
        );
    }


    @Transactional
    public void createManager(CreateManagerRequestDto dto, String token) {
        Manager admin = managerRepository.findByEmail(jwtUtility.extractUsername(token))
                .orElseThrow(() -> new RuntimeException("Invalid role, unable to create a manager"));

        Optional<Manager> existingManager = managerRepository.findByEmail(dto.getEmail());
        if (existingManager.isPresent()) {
            throw new RuntimeException("Manager with this email already exists");
        }

        if (admin.getRole() == Role.ROLE_ADMIN) {
            Manager manager = new Manager();
            manager.setEmail(dto.getEmail());
            manager.setPassword(null);
            manager.setRole(Role.ROLE_MANAGER);
            manager.setName(dto.getName());
            manager.setSurname(dto.getSurname());
            manager.setIsActive(false);
            manager.setIsBanned(false);
            manager.setLastLogIn(null);
            managerRepository.save(manager);
        }
    }

    public void toggleBan(Long id, String token) {
        Manager managerToBan = managerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manager to ban not found"));

        Manager admin = managerRepository.findByEmail(jwtUtility.extractUsername(token))
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (managerToBan.getId().equals(admin.getId())) {
            throw new RuntimeException("You cannot ban yourself");
        }

        managerToBan.setIsBanned(!managerToBan.getIsBanned());
        managerRepository.save(managerToBan);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return managerRepository
                .findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User with provided email was not found"));
    }
}
