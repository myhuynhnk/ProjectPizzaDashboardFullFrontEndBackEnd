package com.devcamp.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devcamp.api.model.COrder;

@Repository
public interface IOrderRepository extends JpaRepository<COrder, Long>{
	List<COrder> findByUserId(long userId);

}
