package com.devcamp.api.controller;

import java.util.ArrayList;
import java.util.Date;
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
import org.springframework.web.bind.annotation.RestController;

import com.devcamp.api.model.COrder;
import com.devcamp.api.model.CUser;
import com.devcamp.api.repository.IOrderRepository;
import com.devcamp.api.repository.IUserRepository;

@RestController
public class OrderController {
	@Autowired
	IOrderRepository orderRepository;
	
	@Autowired
	IUserRepository userRepository;
	
	@CrossOrigin
	@GetMapping("/order/all")
	public ResponseEntity<List<COrder>> getAllOrder() {
		try {
			List<COrder> listOrder = new ArrayList<>();
			orderRepository.findAll().forEach(listOrder::add);
			return new ResponseEntity<>(listOrder, HttpStatus.OK);
		} catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@CrossOrigin
	@GetMapping("/user/{userId}/order")
	public ResponseEntity<List<COrder>> getOrderByUserId(@PathVariable(value = "userId") long userId) {
		try {
			List<COrder> listOrder = new ArrayList<>();
			Optional<CUser> userOptional = userRepository.findById(userId);
			if(userOptional.isPresent()) {
				orderRepository.findByUserId(userId).forEach(listOrder::add);
				return new ResponseEntity<>(listOrder, HttpStatus.OK);
			}else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@CrossOrigin
	@GetMapping("/order/detail/{id}")
	public ResponseEntity<COrder> getOrderById(@PathVariable("id") long id) {
		try {
			COrder order = orderRepository.findById(id).get();
			if(order != null) {
				return new ResponseEntity<>(order, HttpStatus.OK);
			}else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	
	@CrossOrigin
	@PostMapping("/order/create/{userId}")
	public ResponseEntity<Object> createOrder(@PathVariable(value = "userId") long userId, @RequestBody COrder pOrder){
			Optional<CUser> userOptional = userRepository.findById(userId);
			if(userOptional.isPresent()) {
				CUser userCurrent = userOptional.get();
				pOrder.setCreateDate(new Date());
				pOrder.setUpdateDate(null);
				pOrder.setUser(userCurrent);
				
				COrder savedOrder = orderRepository.save(pOrder);
				try {
					return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
				} catch (Exception e) {
					// TODO: handle exception
					System.out.println("+++++++++++++++++:::::: " + e.getCause().getCause().getMessage());
					return ResponseEntity.unprocessableEntity().body("Failed to Create specified order: " + e.getCause().getCause().getMessage());
				}
			} else {
				return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
			}
	}
	
	@CrossOrigin
	@PutMapping("/order/update/{id}")
	public ResponseEntity<Object> updateOrder(@PathVariable("id") long id, @RequestBody COrder pOrder) {
		Optional<COrder> orderOptional = orderRepository.findById(id);
		if(orderOptional.isPresent()) {
			COrder orderUpdate = orderOptional.get();
			orderUpdate.setOrderId(pOrder.getOrderId());
			orderUpdate.setSize(pOrder.getSize());
			orderUpdate.setGrill(pOrder.getGrill());
			orderUpdate.setCountDrink(pOrder.getCountDrink());
			orderUpdate.setSalad(pOrder.getSalad());
			orderUpdate.setSoftDrink(pOrder.getSoftDrink());
			orderUpdate.setTypePizza(pOrder.getTypePizza());
			orderUpdate.setVoucherCode(pOrder.getVoucherCode());
			orderUpdate.setTotalPrice(pOrder.getTotalPrice());
			orderUpdate.setDiscount(pOrder.getDiscount());
			orderUpdate.setStatus(pOrder.getStatus());
			orderUpdate.setMessage(pOrder.getMessage());
			orderUpdate.setUpdateDate(new Date());
			
			COrder savedOrderUpdate = orderRepository.save(orderUpdate);
			try {
				return new ResponseEntity<>(savedOrderUpdate, HttpStatus.OK);
			} catch (Exception e) {
				// TODO: handle exception
				System.out.println("+++++++++++++++++:::::: " + e.getCause().getCause().getMessage());
				return ResponseEntity.unprocessableEntity().body("Failed to Create specified order: " + e.getCause().getCause().getMessage());
			}
		}else {
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
	}
	
	@CrossOrigin
	@DeleteMapping("/order/delete/{id}")
	public ResponseEntity<COrder> deleteOrder(@PathVariable("id") long id) {
		try {
			COrder order = orderRepository.findById(id).get();
			if(order != null) {
				orderRepository.deleteById(id);
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

