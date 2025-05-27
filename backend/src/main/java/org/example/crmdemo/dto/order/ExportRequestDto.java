package org.example.crmdemo.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExportRequestDto {
    private String order;
    private String direction;
    private String name;
    private String surname;
    private String email;
    private String phone;
    private String status;
    private String course;
    private String courseFormat;
    private String courseType;
    private String groupName;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private Boolean isAssignedToMe;
    private Integer page;
}
