package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class ResponseMealDto {

    private List<String> foods = new ArrayList<>();

    private double amount;

    private double cal;

    private double carbon;

    private double protein;

    private double fat;

    private LocalDateTime day;

    public ResponseMealDto(List<String> foods, double amount, double cal, double carbon, double protein, double fat,
                           LocalDateTime day){

        this.foods = foods;
        this.amount = amount;
        this.cal = cal;
        this.carbon = carbon;
        this.protein = protein;
        this.fat = fat;
        this.day = day;
    }
}
