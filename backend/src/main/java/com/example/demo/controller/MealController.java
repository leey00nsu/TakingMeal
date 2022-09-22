package com.example.demo.controller;


import com.example.demo.dto.ResponseMealDto;
import com.example.demo.entity.Meal;
import com.example.demo.dto.MealDto;
import com.example.demo.entity.User;
import com.example.demo.repository.MealRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.RegisterService;
import com.example.demo.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


import org.json.simple.parser.ParseException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@CrossOrigin
@RestController
@RequestMapping("/food")
@RequiredArgsConstructor
@Slf4j
public class MealController {



    @Autowired
    private MealRepository mealRepository;
    @Autowired
    private UserRepository userRepository;

    private final RegisterService registerService;

    private final SearchService searchService;



    //음식 검색 api
    // http://localhost:8080/food/search?foodName=피자 foodName에 파라미터로 음식명(한글)을 넘겨주면 피자 리스트 10개 리턴
    @GetMapping("/search")
    public JSONArray foodRequest(@RequestParam("foodName") String foodName, HttpServletRequest request) throws ParseException, UnsupportedEncodingException {


        String utffoodName = URLEncoder.encode(foodName, "UTF-8");

        return searchService.foodSearch(utffoodName);

    }


    //식단 추가 등록 api
    @PostMapping("/register/{userId}")
    public String foodRegister(@RequestBody MealDto  mealDto, @PathVariable String userId){

        registerService.foodRegister(mealDto, userId);


        return "";
    }
    

    //유저 식단 정보 반환 api
    @GetMapping("/info/{userId}/{date}")
    public ResponseMealDto foodInfo(@PathVariable String userId, @PathVariable String date){

        String userDate = "2022-09-1 13:47:13.248";
        userDate = userDate.replace("2022-09-1", "2022-09-" + date);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
        LocalDateTime dateTime = LocalDateTime.parse(userDate, formatter);
        System.out.println(dateTime);
        return registerService.foodInfo(userId, dateTime);
    }


}
