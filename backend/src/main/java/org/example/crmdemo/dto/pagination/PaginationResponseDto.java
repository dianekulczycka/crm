package org.example.crmdemo.dto.pagination;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaginationResponseDto<T> {
    private Long total;
    private Integer perPage;
    private Integer nextPage;
    private Integer prevPage;
    private List<T> data;
}
