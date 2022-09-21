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

    public ResponseMealDto foodInfo(String userId, LocalDateTime date){

        User user = userRepository.findByUserId(userId);
        List<Meal> meals  = mealRepository.findMealByUser(user);
        List<LocalDateTime> days = new ArrayList<>();
        List<String> foods = new ArrayList<>();
        date = date.truncatedTo(ChronoUnit.DAYS);
        days.add(meals.get(0).getMealAddTime().truncatedTo(ChronoUnit.DAYS));
        foods.add(meals.get(0).getMealName());
        double amount = meals.get(0).getMealAmount();
        double cal = meals.get(0).getMealCal();
        double car = meals.get(0).getMealCarbon();
        double protein = meals.get(0).getMealProtein();
        double fat = meals.get(0).getMealFat();


        for(int i = 1; i < meals.size(); i++) {

            int j = i - 1;
            if (date.equals(days.get(j).truncatedTo(ChronoUnit.DAYS))) {
                days.add(meals.get(i).getMealAddTime().truncatedTo(ChronoUnit.DAYS));
                if (days.get(i).equals(days.get(j))) {
                    foods.add(meals.get(i).getMealName());
                    amount += meals.get(i).getMealAmount();
                    cal += meals.get(i).getMealCal();
                    car += meals.get(i).getMealCarbon();
                    protein += meals.get(i).getMealProtein();
                    fat += meals.get(i).getMealFat();

                }
                System.out.println(amount);
            }
        }

        ResponseMealDto responseMealDto = new ResponseMealDto(foods,amount,cal,car, protein, fat, days.get(0).truncatedTo(ChronoUnit.DAYS));

        return  responseMealDto;
    }

}
