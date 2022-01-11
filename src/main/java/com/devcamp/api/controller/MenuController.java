package com.devcamp.api.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

import com.devcamp.api.model.CMenu;
import com.devcamp.api.repository.IMenuRepository;

@RestController
@RequestMapping("/menu")
public class MenuController {
    @Autowired
    IMenuRepository menuRepository;

    @CrossOrigin
    @GetMapping("/all")
    public ResponseEntity<List<CMenu>> getAllMenu() {
        try {
            List<CMenu> listMenu = new ArrayList<>();
            menuRepository.findAll().forEach(listMenu::add);
            return new ResponseEntity<>(listMenu, HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin
    @GetMapping("/detail/{id}")
    public ResponseEntity<CMenu> getMenuById(@PathVariable("id") long id) {
        try {
            CMenu menu = menuRepository.findById(id).get();
            if(menu != null) {
                return new ResponseEntity<>(menu, HttpStatus.OK);
            }else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        }catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin
    @PostMapping("/create")
    public ResponseEntity<Object> createMenu(@RequestBody CMenu pMenu) {
        try {
            return new ResponseEntity<>(menuRepository.save(pMenu), HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println("++++++++++++++++++:::::::::::" + e.getCause().getCause().getMessage());
            return ResponseEntity.unprocessableEntity().body("Fail to Create specified menu: " + e.getCause().getCause().getMessage());
        }
    }

    @CrossOrigin
    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateMenu(@PathVariable("id") long id, @RequestBody CMenu pMenu) {
        Optional<CMenu> menuOptional = menuRepository.findById(id);
        if(menuOptional.isPresent()) {
            CMenu menuUpdate = menuOptional.get();
            menuUpdate.setSize(pMenu.getSize());
            menuUpdate.setDiameter(pMenu.getDiameter());
            menuUpdate.setGrill(pMenu.getGrill());
            menuUpdate.setSalad(pMenu.getSalad());
            menuUpdate.setCountDrink(pMenu.getCountDrink());
            menuUpdate.setPrice(pMenu.getPrice());
            try {
                return new ResponseEntity<>(menuRepository.save(menuUpdate), HttpStatus.OK);
            }catch (Exception e) {
                System.out.println("++++++++++++++++++:::::::::::" + e.getCause().getCause().getMessage());
                return ResponseEntity.unprocessableEntity().body("Fail to Update specified menu: " + e.getCause().getCause().getMessage());
            }
        } else {
            return ResponseEntity.badRequest().body("Fail to get specified menu: " + id +" for update");
        }
    }

    @CrossOrigin
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<CMenu> deleteMenu(@PathVariable("id") long id) {
        try {
            Optional<CMenu> menuOptional = menuRepository.findById(id);
            if(menuOptional.isPresent()) {
                menuRepository.deleteById(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        }catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

