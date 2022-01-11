package com.devcamp.api.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devcamp.api.model.CDrink;
import com.devcamp.api.repository.IDrinkRepository;

@RestController
@RequestMapping("/drink")
public class DrinkController {
    @Autowired
    IDrinkRepository drinkRepository;

    @CrossOrigin
    @GetMapping("/all")
    public ResponseEntity<List<CDrink>> getAllDrink() {
        try {
            List<CDrink> listDrink = new ArrayList<>();
            drinkRepository.findAll().forEach(listDrink::add);
            return new ResponseEntity<>(listDrink, HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin
    @GetMapping("/detail/{id}")
    public ResponseEntity<CDrink> getDrinkById(@PathVariable("id") long id) {
        try {
            Optional<CDrink> drinkOptional = drinkRepository.findById(id);
            if(drinkOptional.isPresent()) {
                return new ResponseEntity<>(drinkOptional.get(), HttpStatus.OK);
            }else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        }catch (Exception e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin
    @PostMapping("/create")
    public ResponseEntity<Object> createDrink(@Valid @RequestBody CDrink pDrink) {
        try {
            pDrink.setCreateDate(new Date());
            pDrink.setUpdateDate(null);
            CDrink newDrink = drinkRepository.save(pDrink);
            return new ResponseEntity<>(newDrink, HttpStatus.CREATED);
        }catch (Exception e) {
            System.out.println("++++++++++++++++++:::::::::::" + e.getCause().getCause().getMessage());
            return ResponseEntity.unprocessableEntity().body("Fail to Create specified drink: " + e.getCause().getCause().getMessage());
        }
    }

    @CrossOrigin
    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateDrink(@PathVariable("id") long id, @RequestBody CDrink pDrink) {
        Optional<CDrink> drinkOptional = drinkRepository.findById(id);
        if(drinkOptional.isPresent()) {
            CDrink drinkUpdate = drinkOptional.get();
            drinkUpdate.setUpdateDate(new Date());
            drinkUpdate.setDrinkCode(pDrink.getDrinkCode());
            drinkUpdate.setDrinkName(pDrink.getDrinkName());
            drinkUpdate.setPrice(pDrink.getPrice());
            drinkUpdate.setNote(pDrink.getNote());
            try {
                return new ResponseEntity<>(drinkRepository.save(drinkUpdate), HttpStatus.OK);
            }catch (Exception e) {
                System.out.println("++++++++++++++++++:::::::::::" + e.getCause().getCause().getMessage());
                return ResponseEntity.unprocessableEntity().body("Fail to Update specified drink: " + e.getCause().getCause().getMessage());
            }
        } else {
            return ResponseEntity.badRequest().body("Fail to get specified drink: " + id +" for update");
        }
    }

    @CrossOrigin
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<CDrink> deleteDrink(@PathVariable("id") long id) {
        try {
            Optional<CDrink> drinkOptional = drinkRepository.findById(id);
            if(drinkOptional.isPresent()) {
                drinkRepository.deleteById(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        }catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin
    @DeleteMapping("/delete/all")
    public ResponseEntity<CDrink> deleteAllDrink() {
        drinkRepository.deleteAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

