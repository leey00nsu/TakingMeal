package com.example.demo.controller;

import com.example.demo.LocationList;
import com.example.demo.service.LocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class LoadApiController {

    private final LocationService locationService;

    @GetMapping("/loadapi")
    public LocationList loadApi(){

        return locationService.load();
    }
}
