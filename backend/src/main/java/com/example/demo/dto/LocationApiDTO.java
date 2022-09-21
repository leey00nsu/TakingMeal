package com.example.demo.dto;

import com.example.demo.entity.StoreCategory;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Getter
@NoArgsConstructor
public class LocationApiDTO {

    private String name;
    private String address;
    private Double lat;
    private Double lng;
    private StoreCategory category; //가게 카테고리 [CARD, GOOD]

    @Builder
    public LocationApiDTO(String name, String address, Double lat, Double lng, StoreCategory category) {
        this.name = name;
        this.address = address;
        this.lat = lat;
        this.lng = lng;
        this.category = category;
    }
}
