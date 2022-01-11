package com.devcamp.api.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "menus")
public class CMenu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "size")
    private char size;

    @Column(name = "diamater")
    private int diameter;

    @Column(name = "grill")
    private int grill;

    @Column(name = "salad")
    private int salad;

    @Column(name = "count_drink")
    private int countDrink;

    @NotNull(message = "Must be have price")
    @Column(name = "price")
    private int price;

    public CMenu(long id, char size, int diameter, int grill, int salad, int countDrink, int price) {
        this.id = id;
        this.size = size;
        this.diameter = diameter;
        this.grill = grill;
        this.salad = salad;
        this.countDrink = countDrink;
        this.price = price;
    }

    public CMenu() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public char getSize() {
        return size;
    }

    public void setSize(char size) {
        this.size = size;
    }

    public int getDiameter() {
        return diameter;
    }

    public void setDiameter(int diameter) {
        this.diameter = diameter;
    }

    public int getGrill() {
        return grill;
    }

    public void setGrill(int grill) {
        this.grill = grill;
    }

    public int getSalad() {
        return salad;
    }

    public void setSalad(int salad) {
        this.salad = salad;
    }

    public int getCountDrink() {
        return countDrink;
    }

    public void setCountDrink(int countDrink) {
        this.countDrink = countDrink;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }
}

