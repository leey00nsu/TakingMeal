package com.example.demo.service;

import com.example.demo.dto.MealDto;
import com.example.demo.dto.ResponseMealDto;
import com.example.demo.entity.Meal;
import com.example.demo.entity.User;
import com.example.demo.repository.MealRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegisterService {

    private final UserRepository userRepository;

    private final MealRepository mealRepository;

    //식단 추가
    public String foodRegister(MealDto mealDto, String userId){

        User user = userRepository.findByUserId(userId);
        Meal meal = Meal.builder()
                .user(user)
                .mealName(mealDto.getMealName())
                .mealAmount(mealDto.getMealAmount())
                .mealCal(mealDto.getMealCal())
                .mealCarbon(mealDto.getMealCarbon())
                .mealProtein(mealDto.getMealProtein())
                .mealFat(mealDto.getMealFat())
                .build();


        mealRepository.save(meal);

        return "success";

    }

    public ResponseMealDto foodInfo(String userId, LocalDateTime date) {

        User user = userRepository.findByUserId(userId);
        List<Meal> meals = mealRepository.findMealByUser(user);
        List<LocalDateTime> days = new ArrayList<>();
        List<String> foods = new ArrayList<>();
        date = date.truncatedTo(ChronoUnit.DAYS);
        days.add(meals.get(0).getMealAddTime().truncatedTo(ChronoUnit.DAYS));
        double amount = 0;
        double cal = 0;
        double car = 0;
        double protein = 0;
        double fat = 0;

        for (int i = 0; i < meals.size(); i++) {
            if (date.equals(meals.get(i).getMealAddTime().truncatedTo(ChronoUnit.DAYS))) {

                foods.add(meals.get(i).getMealName());
                amount += meals.get(i).getMealAmount();
                cal += meals.get(i).getMealCal();
                car += meals.get(i).getMealCarbon();
                protein += meals.get(i).getMealProtein();
                fat += meals.get(i).getMealFat();
                days.add(meals.get(i).getMealAddTime());
            }
        }
        ResponseMealDto responseMealDto = new ResponseMealDto(foods, amount, cal, car, protein, fat, date);
        return responseMealDto;
    }
}
