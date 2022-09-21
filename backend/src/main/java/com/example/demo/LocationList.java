package com.example.demo;

import com.example.demo.entity.Location;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class LocationList {
    private List<Location> cafeteriaCardStore;
    private List<Location> goodInfluenceShop;

    public void setCard(List<Location> cafeteriaCardStore) {
        this.cafeteriaCardStore = cafeteriaCardStore;
    }

    public void setGood(List<Location> goodInfluenceShop) {
        this.goodInfluenceShop = goodInfluenceShop;
    }

}
