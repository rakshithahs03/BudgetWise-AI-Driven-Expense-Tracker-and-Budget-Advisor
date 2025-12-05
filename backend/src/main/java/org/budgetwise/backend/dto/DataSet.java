package org.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DataSet {
    private String label;
    private List<Double> data;
}