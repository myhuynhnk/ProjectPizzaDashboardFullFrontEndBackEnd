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
import org.springframework.web.bind.annotation.RestController;

import com.devcamp.api.model.CUser;
import com.devcamp.api.repository.IUserRepository;

@RestController
public class UserController {
	@Autowired
	IUserRepository userRepository;
	
	@CrossOrigin
	@GetMapping("/user/all")
	public ResponseEntity<List<CUser>> getAllUser() {
		try {
			List<CUser> listUser = new ArrayList<>();
			userRepository.findAll().forEach(listUser::add);
			return new ResponseEntity<>(listUser, HttpStatus.OK);
		} catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@CrossOrigin
	@GetMapping("/user/detail/{id}")
	public ResponseEntity<CUser> getUserById(@PathVariable("id") long id) {
		try {
			CUser userCurrent = userRepository.findById(id).get();
			if(userCurrent != null) {
				return new ResponseEntity<>(userCurrent, HttpStatus.OK);
			}else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@CrossOrigin
	@PostMapping("/user/create")
	public ResponseEntity<Object> createUser(@RequestBody CUser pUser) {
		try {
			CUser newUser = userRepository.save(pUser);
			return new ResponseEntity<>(newUser, HttpStatus.CREATED);
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("+++++++++++++++++:::::: " + e.getCause().getCause().getMessage());
			return ResponseEntity.unprocessableEntity().body("Failed to Create specified user: " + e.getCause().getCause().getMessage());
		}
	}
	
	@CrossOrigin
	@PutMapping("/user/update/{id}")
	public ResponseEntity<Object> updateUser(@PathVariable("id") long id, @RequestBody CUser pUser) {
		Optional<CUser> userOptional = userRepository.findById(id);
		if(userOptional.isPresent()) {
			CUser userUpdate = userOptional.get();
			userUpdate.setFullName(pUser.getFullName());
			userUpdate.setEmail(pUser.getEmail());
			userUpdate.setAddress(pUser.getAddress());
			userUpdate.setPhone(pUser.getPhone());
			userUpdate.setOrders(pUser.getOrders());
			CUser savedUserUpdate = userRepository.save(userUpdate);
			try {
				return new ResponseEntity<>(savedUserUpdate, HttpStatus.OK);
			} catch (Exception e) {
				// TODO: handle exception
				System.out.println("+++++++++++++++++:::::: " + e.getCause().getCause().getMessage());
				return ResponseEntity.unprocessableEntity().body("Failed to Create specified user: " + e.getCause().getCause().getMessage());
			}
		} else {
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
	}
	
	@CrossOrigin
	@DeleteMapping("/user/delete/{id}")
	public ResponseEntity<CUser> deleteUserById(@PathVariable("id") long id) {
		try {
			Optional<CUser> user = userRepository.findById(id);
			if(user.isPresent()) {
				userRepository.deleteById(id);
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			} else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

