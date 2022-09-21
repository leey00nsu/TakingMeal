package com.example.demo.service;

import com.example.demo.LocationList;
import com.example.demo.entity.Location;
import com.example.demo.entity.StoreCategory;
import com.example.demo.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationList load(){
        List<Location> all = locationRepository.findAll();
        LocationList locationList = new LocationList();
        List<Location> cards = new ArrayList<>();
        List<Location> goods = new ArrayList<>();

        for (Location location : all) {
            if (location.getCategory() == StoreCategory.CARD) {
                cards.add(location);
            } else {
                goods.add(location);
            }
        }

        locationList.setCard(cards);
        locationList.setGood(goods);

        return locationList;
    }
}
