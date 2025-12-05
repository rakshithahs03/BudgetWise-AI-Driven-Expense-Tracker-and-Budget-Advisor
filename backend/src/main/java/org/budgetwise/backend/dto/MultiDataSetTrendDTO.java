package org.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MultiDataSetTrendDTO {
    private List<String> labels;
    private List<DataSet> datasets;
}