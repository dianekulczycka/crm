package org.example.crmdemo.dto.pagination;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SortDto {
    private String order = "id";
    private String direction = "desc";
    private Integer page = 1;
}
