package com.example.demo.repository;


import com.example.demo.entity.Meal;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {

    List<Meal> findMealByUser(User user);
}
