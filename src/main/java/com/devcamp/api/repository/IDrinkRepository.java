package com.devcamp.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devcamp.api.model.CDrink;

@Repository
public interface IDrinkRepository extends JpaRepository<CDrink, Long>{

}
