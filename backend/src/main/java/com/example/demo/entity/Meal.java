package com.example.demo.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mId;

    @Column(name = "mealName")
    private String mealName;

    @Column(name = "mealAmount")
    private double mealAmount;

    @Column(name = "mealCal")
    private double mealCal;

    @Column(name = "mealCarbon")
    private double mealCarbon;

    @Column(name = "mealProtein")
    private double mealProtein;

    @Column(name = "mealFat")
    private double mealFat;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "uId")
    private User user;

    @CreationTimestamp
    @Column(updatable = false, name = "mealAddTime")
    private LocalDateTime mealAddTime;

    @Builder
    public Meal(String mealName, double mealAmount, double mealCal, double mealCarbon, double mealProtein, double mealFat
               , User user ){
        this.mealName = mealName;
        this.mealAmount = mealAmount;
        this.mealCal = mealCal;
        this.mealCarbon = mealCarbon;
        this.mealProtein = mealProtein;
        this.mealFat = mealFat;
        this.user=user;

    }

    public static Meal registerMeal(String mealName, double mealAmount, double mealCal, double mealCarbon,
                                    double mealProtein, double mealFat, User user){
        return Meal.builder()
                .mealName(mealName)
                .mealAmount(mealAmount)
                .mealCal(mealCal)
                .mealCarbon(mealCarbon)
                .mealProtein(mealProtein)
                .mealFat(mealFat)
                .user(user)
                .build();
    }


}
