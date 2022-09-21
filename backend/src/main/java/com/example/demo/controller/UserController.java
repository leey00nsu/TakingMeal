package com.example.demo.controller;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.repository.MealRepository;
import com.example.demo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@Controller
@CrossOrigin
@Slf4j
public class UserController {

    @Autowired
    private UserRepository userRepository;


    //회원가입 form method = post
    @PostMapping("/signInPro")
    public String signInPro(@RequestBody UserDto userDto, Model model, HttpServletRequest request){

       User user = new User(userDto.getUserId(), userDto.getUserPw(), userDto.getUserAge(), userDto.getUserGender());
       userRepository.save(user);

        return "/index";
    }


    //로그인 form method = post
    @PostMapping("/loginPro")
    public String loginPro(@RequestBody UserDto userDto, HttpServletRequest request, HttpServletResponse response){

        if(userDto.getUserId() == null){
            return "/signIn";
        }

        if(userDto.getUserId().equals((userRepository.findByUserId(userDto.getUserId()).getUserId()))){
            System.out.println("아이디 일치");

            if(userDto.getUserPw().equals(userRepository.findByUserId(userDto.getUserId()).getUserPw())){
                System.out.println("로그인 성공");
                Cookie cookie = new Cookie("userId", String.valueOf(userDto.getUserId()));
                response.addCookie(cookie);

            }
            else
                System.out.println("로그인 실패");
        }
        else{
            System.out.println("아이디 불일치");
        }

        return "redirect:/";
    }

    @PostMapping("/update")
    public String userUpdate(@RequestBody UserDto userDto){

        User user = userRepository.findByUserId(userDto.getUserId());

        user.setUserAge(userDto.getUserAge());
        user.setUserGender(userDto.getUserGender());
        userRepository.save(user);
        return "/index";

    }

    //쿠키에서 유저정보 조회 api
    @GetMapping("/getCookie")
    public String getCookie(@CookieValue String userId) {

        System.out.println(userId);
        return "/index";
    }
}
