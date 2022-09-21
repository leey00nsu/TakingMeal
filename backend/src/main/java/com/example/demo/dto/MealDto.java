package com.example.demo.dto;

import com.example.demo.entity.User;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;

@Data
@Getter
@Setter
@NoArgsConstructor

public class MealDto {

    private String mealName;

    private double mealAmount;

    private double mealCal;

    private double mealCarbon;

    private double mealProtein;

    private double mealFat;





    public MealDto(String desc_kor, double serving_wt, double nutr_cont1, double nutr_cont2, double nutr_cont3, double nutr_cont4) {
        this.mealName = desc_kor;
        this.mealAmount = serving_wt;
        this.mealCal = nutr_cont1;
        this.mealCarbon = nutr_cont2;
        this.mealProtein = nutr_cont3;
        this.mealFat = nutr_cont4;
    }
}

