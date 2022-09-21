package com.example.demo.entity;

import com.example.demo.dto.LocationApiDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Table(name = "Location")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lId")
    private Long id;

    @Column(name = "locationName")
    private String name;

    @Column(name = "locationAddress")
    private String address;

    @Column(name = "locationX")
    private Double lat;

    @Column(name = "locationY")
    private Double lng;

    @Column(name = "category")
    private StoreCategory category;

    @JsonIgnore
    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Comment> comments = new ArrayList<>();

    public Location(LocationApiDTO locationApiDTO) {
        this.name = locationApiDTO.getName();
        this.address = locationApiDTO.getAddress();
        this.lat = locationApiDTO.getLat();
        this.lng = locationApiDTO.getLng();
        this.category = locationApiDTO.getCategory();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Location location = (Location) o;
        return id != null && Objects.equals(id, location.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
